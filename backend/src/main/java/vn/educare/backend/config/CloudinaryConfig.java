package vn.educare.backend.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

  @Bean
  public Cloudinary cloudinary(AppProperties appProperties) {
    var config = appProperties.cloudinary();
    return new Cloudinary(ObjectUtils.asMap(
        "cloud_name", config.cloudName(),
        "api_key", config.apiKey(),
        "api_secret", config.apiSecret()
    ));
  }
}
