package vn.educare.backend.api;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vn.educare.backend.api.AuthDtos.AdminUserListResponse;
import vn.educare.backend.api.AuthDtos.AdminUserResponse;
import vn.educare.backend.api.AuthDtos.AdminUserUpdateRequest;
import vn.educare.backend.service.AdminUserService;

@RestController
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

  private final AdminUserService adminUserService;

  /** GET /api/admin/users?q=&plan=&role= */
  @GetMapping("/api/admin/users")
  public AdminUserListResponse listUsers(
      @RequestParam(required = false) String q,
      @RequestParam(required = false) String plan,
      @RequestParam(required = false) String role) {
    return adminUserService.listUsers(q, plan, role);
  }

  /** GET /api/admin/users/{id} */
  @GetMapping("/api/admin/users/{id}")
  public AdminUserResponse getUser(@PathVariable String id) {
    return adminUserService.getUser(id);
  }

  /** PUT /api/admin/users/{id} — update plan / role */
  @PutMapping("/api/admin/users/{id}")
  public AdminUserResponse updateUser(
      @PathVariable String id,
      @RequestBody AdminUserUpdateRequest request) {
    return adminUserService.updateUser(id, request);
  }

  /** DELETE /api/admin/users/{id} */
  @DeleteMapping("/api/admin/users/{id}")
  public void deleteUser(@PathVariable String id) {
    adminUserService.deleteUser(id);
  }
}
