package vn.educare.backend.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import vn.educare.backend.model.UserEntity;
import vn.educare.backend.model.UserPlan;
import vn.educare.backend.model.UserRole;

public interface UserRepository extends JpaRepository<UserEntity, String> {
  Optional<UserEntity> findByEmail(String email);
  Optional<UserEntity> findByUsername(String username);
  Optional<UserEntity> findByEmailOrUsername(String email, String username);
  long countByRole(UserRole role);
  List<UserEntity> findTop10ByRoleAndStreakGreaterThanEqualOrderByStreakDescQuizScoreTotalDescXpDesc(UserRole role, int streak);

  @Query("select coalesce(avg(u.xp), 0) from UserEntity u")
  Double averageXp();

  @Query("""
      select u from UserEntity u
      where (:q is null or
             lower(u.fullName) like lower(concat('%', :q, '%')) or
             lower(u.email)    like lower(concat('%', :q, '%')) or
             lower(u.username) like lower(concat('%', :q, '%')))
        and (:plan is null or u.plan = :plan)
        and (:role is null or u.role = :role)
      order by u.createdAt desc
      """)
  List<UserEntity> searchUsers(
      @Param("q")    String q,
      @Param("plan") UserPlan plan,
      @Param("role") UserRole role);
}
