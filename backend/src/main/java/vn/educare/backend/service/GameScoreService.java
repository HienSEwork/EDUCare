package vn.educare.backend.service;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.educare.backend.api.ApiException;
import vn.educare.backend.api.AuthDtos.GameLeaderboardResponse;
import vn.educare.backend.api.AuthDtos.GameScoreEntry;
import vn.educare.backend.api.AuthDtos.GameScoreSubmitRequest;
import vn.educare.backend.api.AuthDtos.GameScoreSubmitResponse;
import vn.educare.backend.model.GameScoreEntity;
import vn.educare.backend.model.UserEntity;
import vn.educare.backend.repository.GameRepository;
import vn.educare.backend.repository.GameScoreRepository;
import vn.educare.backend.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class GameScoreService {

  private final GameScoreRepository gameScoreRepository;
  private final GameRepository gameRepository;
  private final UserRepository userRepository;

  private static final DateTimeFormatter DATE_FMT =
      DateTimeFormatter.ofPattern("dd/MM/yyyy").withZone(ZoneId.of("Asia/Ho_Chi_Minh"));

  @Transactional
  public GameScoreSubmitResponse submitScore(String gameSlug, String userId, GameScoreSubmitRequest req) {
    UserEntity user = userRepository.findById(userId)
        .orElseThrow(() -> new ApiException(401, "Unauthorized"));

    Optional<GameScoreEntity> previousBest =
        gameScoreRepository.findTopByGameSlugAndUserIdOrderByScoreDesc(gameSlug, userId);
    boolean personalBest = previousBest.isEmpty() || req.score() > previousBest.get().getScore();

    GameScoreEntity entry = new GameScoreEntity();
    entry.setGameSlug(gameSlug);
    entry.setUserId(userId);
    entry.setPlayerName(user.getFullName());
    entry.setScore(req.score());
    entry.setDifficulty(req.difficulty() == null ? "medium" : req.difficulty());
    entry.setUserStreak(user.getStreak() == null ? 0 : user.getStreak());
    entry.setUserXp(user.getXp() == null ? 0 : user.getXp());
    entry.setPlayedAt(Instant.now());
    gameScoreRepository.save(entry);

    GameLeaderboardResponse lb = buildLeaderboard(gameSlug, userId);
    int rank = lb.top().stream()
        .filter(GameScoreEntry::isMe)
        .findFirst()
        .map(GameScoreEntry::rank)
        .orElse(-1);

    return new GameScoreSubmitResponse(rank, personalBest, lb);
  }

  @Transactional(readOnly = true)
  public GameLeaderboardResponse leaderboard(String gameSlug, String userId) {
    return buildLeaderboard(gameSlug, userId);
  }

  private GameLeaderboardResponse buildLeaderboard(String gameSlug, String userId) {
    List<GameScoreEntity> top10 =
        gameScoreRepository.findTop10ByGameSlugOrderByScoreDescPlayedAtAsc(gameSlug);

    List<GameScoreEntry> entries = new ArrayList<>();
    for (int i = 0; i < top10.size(); i++) {
      GameScoreEntity e = top10.get(i);
      entries.add(new GameScoreEntry(
          i + 1,
          e.getPlayerName(),
          e.getScore(),
          e.getDifficulty(),
          e.getUserStreak(),
          e.getUserXp(),
          DATE_FMT.format(e.getPlayedAt()),
          userId != null && userId.equals(e.getUserId())));
    }

    GameScoreEntry myBest = null;
    if (userId != null) {
      Optional<GameScoreEntity> myTop =
          gameScoreRepository.findTopByGameSlugAndUserIdOrderByScoreDesc(gameSlug, userId);
      if (myTop.isPresent()) {
        GameScoreEntity me = myTop.get();
        int myRank = (int) gameScoreRepository.countByGameSlugAndScoreGreaterThan(gameSlug, me.getScore()) + 1;
        boolean inTop = entries.stream().anyMatch(GameScoreEntry::isMe);
        if (!inTop) {
          myBest = new GameScoreEntry(
              myRank,
              me.getPlayerName(),
              me.getScore(),
              me.getDifficulty(),
              me.getUserStreak(),
              me.getUserXp(),
              DATE_FMT.format(me.getPlayedAt()),
              true);
        }
      }
    }

    String gameTitle = gameRepository.findBySlug(gameSlug)
        .map(vn.educare.backend.model.GameEntity::getTitle)
        .orElse(gameSlug);

    return new GameLeaderboardResponse(gameSlug, gameTitle, entries, myBest);
  }
}
