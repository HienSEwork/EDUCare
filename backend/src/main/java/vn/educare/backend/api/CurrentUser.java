package vn.educare.backend.api;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import vn.educare.backend.security.AppUserDetails;

@Component
public class CurrentUser {

  public String id() {
    return details().user().getId();
  }

  public String idOrNull() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null && authentication.getPrincipal() instanceof AppUserDetails details) {
      return details.user().getId();
    }
    return null;
  }

  public AppUserDetails details() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !(authentication.getPrincipal() instanceof AppUserDetails details)) {
      throw new ApiException(401, "Unauthorized");
    }
    return details;
  }
}
