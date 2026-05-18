package vn.educare.backend.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import vn.educare.backend.model.UserEntity;
import vn.educare.backend.model.UserRole;

public interface UserRepository extends JpaRepository<UserEntity, String> {
  Optional<UserEntity> findByEmail(String email);
  Optional<UserEntity> findByUsername(String username);
  Optional<UserEntity> findByEmailOrUsername(String email, String username);
  long countByRole(UserRole role);
  java.util.List<UserEntity> findTop10ByRoleAndStreakGreaterThanEqualOrderByStreakDescQuizScoreTotalDescXpDesc(UserRole role, int streak);

  @Query("select coalesce(avg(u.xp), 0) from UserEntity u")
  Double averageXp();
}
