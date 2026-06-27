# V20 private-crew-bot-chat

## Purpose
- Upgrade the crewBot chat channel to be private (1-on-1) per user, rather than a single shared public chat room.
- Integrate Google's Gemini API to replace static keyword-based bot matching with a smart, topic-restricted AI conversation experience.

## Data Contract
- No new columns or schema modifications are introduced.
- The `slug` value for system-generated crewBot rooms is updated from the static `"crew-bot"` to `"crew-bot-" + userId` in the database to isolate rooms per user.
- To maintain seamless client-side compatibility:
  - The API exposes and expects the slug `"crew-bot"` to the frontend client.
  - The backend dynamically resolves and proxies requests from `"crew-bot"` to `"crew-bot-" + userId` based on the authenticated user context.

## Backend Integration
- **`AppProperties.java`**: Added `Gemini` record wrapper to bind the API key.
- **`GeminiService.java`**: Added a new service class that sends HTTP REST POST requests to the Gemini API (`gemini-1.5-flash`) using standard `java.net.http.HttpClient`.
  - Configured strict System Instructions to focus only on sex education, puberty growth, and student mental health. Off-topic questions (e.g. math, coding) are politely rejected.
- **`CommunityService.java`**:
  - Modified `findRoom` to accept `userId` and resolve `"crew-bot"` to the user-specific room `"crew-bot-" + userId`.
  - Updated `ensureCrewBotRoom`, `chatRooms`, `messages`, `postMessage`, and other group chat callers to align with the new private room lookup.
  - Linked `crewBotReply` to query `GeminiService` and gracefully fallback to static keyword patterns if the key is missing or calls fail.
- **`ChatWebSocketHandler.java`**:
  - Dynamically routes and handles `SUBSCRIBE`, `TYPING` and `READ` requests for `"crew-bot"` to `"crew-bot-" + userId`.
  - Translates outgoing room-slug payloads in `WsResponse` back to `"crew-bot"` to keep the frontend client aligned.

## Database Integration
- No modifications needed in `data/init.sql` or `data/seed.sql` because the tables and fields remain unchanged.
- Old database records under slug `"crew-bot"` can remain or be ignored; new active users will automatically get their private `"crew-bot-" + userId` rooms created.

## Frontend Integration
- No frontend changes are necessary because the backend handles proxying and translation transparently.

## Compatibility
- Fully backwards-compatible. Frontend client runs unmodified.

## Verification
- Run backend unit tests: `mvn -f backend/pom.xml test`.
- Manually run multi-user verification to confirm chat privacy and AI smart reply capabilities.
