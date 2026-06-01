package vn.educare.backend.api;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.educare.backend.api.AuthDtos.AddXpRequest;
import vn.educare.backend.api.AuthDtos.AdminDashboardResponse;
import vn.educare.backend.api.AuthDtos.DashboardResponse;
import vn.educare.backend.api.AuthDtos.ProgressResponse;
import vn.educare.backend.service.DashboardService;
import vn.educare.backend.service.ProgressService;

@RestController
@RequiredArgsConstructor
public class DashboardController {

  private final DashboardService dashboardService;
  private final ProgressService progressService;
  private final CurrentUser currentUser;

  @GetMapping("/api/dashboard")
  public DashboardResponse dashboard() {
    return dashboardService.userDashboard(currentUser.id());
  }

  @PostMapping("/api/progress/lessons/{slug}/complete")
  public ProgressResponse completeLesson(@PathVariable String slug) {
    return progressService.completeLesson(currentUser.id(), slug);
  }

  @PostMapping("/api/progress/micro-lessons/{microLessonId}/complete")
  public ProgressResponse completeMicroLesson(@PathVariable Long microLessonId) {
    return progressService.completeMicroLesson(currentUser.id(), microLessonId);
  }

  @PostMapping("/api/progress/xp")
  public ProgressResponse addXp(@Valid @RequestBody AddXpRequest request) {
    return progressService.addXp(currentUser.id(), request.amount());
  }

  @GetMapping("/api/admin/dashboard")
  @PreAuthorize("hasRole('ADMIN')")
  public AdminDashboardResponse adminDashboard() {
    return dashboardService.adminDashboard();
  }
}
