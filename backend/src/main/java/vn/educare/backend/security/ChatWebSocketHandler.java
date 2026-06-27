package vn.educare.backend.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import vn.educare.backend.model.UserEntity;
import vn.educare.backend.repository.UserRepository;

import java.io.IOException;
import java.net.URI;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
@Slf4j
public class ChatWebSocketHandler extends TextWebSocketHandler {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    // session ID -> session
    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
    // session ID -> user ID
    private final Map<String, String> sessionUserIds = new ConcurrentHashMap<>();
    // session ID -> active room slug
    private final Map<String, String> sessionRooms = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String token = extractToken(session);
        if (token == null) {
            session.close(CloseStatus.BAD_DATA.withReason("Missing token"));
            return;
        }

        try {
            String userId = jwtService.extractUserId(token);
            UserEntity user = userRepository.findById(userId).orElse(null);
            if (user == null || !jwtService.isTokenValid(token, user)) {
                session.close(CloseStatus.BAD_DATA.withReason("Invalid token"));
                return;
            }

            sessions.put(session.getId(), session);
            sessionUserIds.put(session.getId(), userId);
            log.info("WebSocket connection established for user: {}", user.getFullName());
        } catch (Exception e) {
            session.close(CloseStatus.BAD_DATA.withReason("Token validation failed"));
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session.getId());
        sessionUserIds.remove(session.getId());
        String room = sessionRooms.remove(session.getId());
        
        // Notify others that typing stopped if they were typing
        if (room != null) {
            broadcastTyping(room, session.getId(), false);
            broadcastOnlineCount(room);
        }
        log.info("WebSocket connection closed for session: {}", session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        try {
            WsRequest request = objectMapper.readValue(payload, WsRequest.class);
            if (request == null || request.type() == null) return;

            String userId = sessionUserIds.get(session.getId());
            if (userId == null) return;

            switch (request.type()) {
                case "SUBSCRIBE":
                    if (request.roomSlug() != null) {
                        String oldRoomSlug = sessionRooms.get(session.getId());
                        String roomSlug = "crew-bot".equals(request.roomSlug()) ? "crew-bot-" + userId : request.roomSlug();
                        sessionRooms.put(session.getId(), roomSlug);
                        log.info("User {} subscribed to room {}", userId, roomSlug);
                        
                        // Broadcast online count to new room
                        broadcastOnlineCount(roomSlug);
                        
                        // Broadcast online count to old room if it changed
                        if (oldRoomSlug != null && !oldRoomSlug.equals(roomSlug)) {
                            broadcastOnlineCount(oldRoomSlug);
                        }
                    }
                    break;
                case "TYPING":
                    if (request.roomSlug() != null) {
                        String roomSlug = "crew-bot".equals(request.roomSlug()) ? "crew-bot-" + userId : request.roomSlug();
                        boolean isTyping = Boolean.parseBoolean(request.content());
                        broadcastTyping(roomSlug, session.getId(), isTyping);
                    }
                    break;
                case "READ":
                    if (request.roomSlug() != null) {
                        String roomSlug = "crew-bot".equals(request.roomSlug()) ? "crew-bot-" + userId : request.roomSlug();
                        broadcastReadReceipt(roomSlug, session.getId());
                    }
                    break;
                default:
                    break;
            }
        } catch (Exception e) {
            log.error("Error processing websocket message", e);
        }
    }

    public void broadcastNewMessage(String roomSlug, Object messageResponse) {
        WsResponse response = new WsResponse("NEW_MESSAGE", roomSlug, messageResponse);
        broadcastToRoom(roomSlug, response);
    }

    public void broadcastRoomPinUpdate(String roomSlug, Object roomResponse) {
        WsResponse response = new WsResponse("ROOM_PIN_UPDATE", roomSlug, roomResponse);
        broadcastToRoom(roomSlug, response);
    }

    public void broadcastRoomInfoUpdate(String roomSlug, Object roomResponse) {
        WsResponse response = new WsResponse("ROOM_INFO_UPDATE", roomSlug, roomResponse);
        broadcastToRoom(roomSlug, response);
    }

    public void broadcastMessageReaction(String roomSlug, Object messageResponse) {
        WsResponse response = new WsResponse("MESSAGE_REACTION", roomSlug, messageResponse);
        broadcastToRoom(roomSlug, response);
    }

    private void broadcastTyping(String roomSlug, String senderSessionId, boolean isTyping) {
        String userId = sessionUserIds.get(senderSessionId);
        if (userId == null) return;
        
        UserEntity user = userRepository.findById(userId).orElse(null);
        String username = user != null ? user.getFullName() : "Ai đó";

        String displaySlug = roomSlug.startsWith("crew-bot-") ? "crew-bot" : roomSlug;
        WsResponse response = new WsResponse("TYPING_STATUS", displaySlug, Map.of(
            "userId", userId,
            "username", username,
            "isTyping", isTyping
        ));

        String payload;
        try {
            payload = objectMapper.writeValueAsString(response);
        } catch (Exception e) {
            return;
        }

        TextMessage textMessage = new TextMessage(payload);
        for (WebSocketSession session : sessions.values()) {
            if (!session.getId().equals(senderSessionId) && roomSlug.equals(sessionRooms.get(session.getId()))) {
                try {
                    session.sendMessage(textMessage);
                } catch (IOException e) {
                    log.error("Failed to send typing message", e);
                }
            }
        }
    }

    private void broadcastReadReceipt(String roomSlug, String senderSessionId) {
        String userId = sessionUserIds.get(senderSessionId);
        if (userId == null) return;

        String displaySlug = roomSlug.startsWith("crew-bot-") ? "crew-bot" : roomSlug;
        WsResponse response = new WsResponse("READ_RECEIPT", displaySlug, Map.of(
            "userId", userId
        ));

        String payload;
        try {
            payload = objectMapper.writeValueAsString(response);
        } catch (Exception e) {
            return;
        }

        TextMessage textMessage = new TextMessage(payload);
        for (WebSocketSession session : sessions.values()) {
            if (!session.getId().equals(senderSessionId) && roomSlug.equals(sessionRooms.get(session.getId()))) {
                try {
                    session.sendMessage(textMessage);
                } catch (IOException e) {
                    log.error("Failed to send read receipt message", e);
                }
            }
        }
    }

    private void broadcastOnlineCount(String roomSlug) {
        int count = 0;
        for (WebSocketSession session : sessions.values()) {
            if (roomSlug.equals(sessionRooms.get(session.getId()))) {
                count++;
            }
        }

        String displaySlug = roomSlug.startsWith("crew-bot-") ? "crew-bot" : roomSlug;
        WsResponse response = new WsResponse("ONLINE_COUNT", displaySlug, Map.of(
            "onlineCount", count
        ));

        broadcastToRoom(roomSlug, response);
    }

    private void broadcastToRoom(String roomSlug, WsResponse response) {
        TextMessage defaultMsg = null;
        TextMessage mappedMsg = null;

        try {
            defaultMsg = new TextMessage(objectMapper.writeValueAsString(response));
            if (roomSlug.startsWith("crew-bot-")) {
                WsResponse mappedResponse = new WsResponse(response.type(), "crew-bot", response.data());
                mappedMsg = new TextMessage(objectMapper.writeValueAsString(mappedResponse));
            }
        } catch (Exception e) {
            log.error("Failed to serialize WebSocket response", e);
            return;
        }

        for (WebSocketSession session : sessions.values()) {
            String sessionRoom = sessionRooms.get(session.getId());
            if (roomSlug.equals(sessionRoom)) {
                try {
                    if (mappedMsg != null) {
                        session.sendMessage(mappedMsg);
                    } else {
                        session.sendMessage(defaultMsg);
                    }
                } catch (IOException e) {
                    log.error("Failed to send message", e);
                }
            }
        }
    }

    private String extractToken(WebSocketSession session) {
        URI uri = session.getUri();
        if (uri == null) return null;
        String query = uri.getQuery();
        if (query == null) return null;

        for (String param : query.split("&")) {
            String[] entry = param.split("=");
            if (entry.length == 2 && "token".equals(entry[0])) {
                return entry[1];
            }
        }
        return null;
    }

    public record WsRequest(String type, String roomSlug, String content) {}
    public record WsResponse(String type, String roomSlug, Object data) {}
}
