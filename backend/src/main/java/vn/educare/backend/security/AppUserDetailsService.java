package vn.educare.backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import vn.educare.backend.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class AppUserDetailsService implements UserDetailsService {

  private final UserRepository userRepository;

  @Override
  public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
    return userRepository.findById(userId)
        .map(AppUserDetails::new)
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
  }
}
