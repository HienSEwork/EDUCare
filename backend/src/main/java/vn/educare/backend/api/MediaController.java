package vn.educare.backend.api;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import java.io.IOException;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import vn.educare.backend.api.ApiException;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class MediaController {

  private final Cloudinary cloudinary;

  @PostMapping("/upload")
  public Map<String, Object> uploadFile(@RequestParam("file") MultipartFile file) {
    if (file.isEmpty()) {
      throw new ApiException(400, "File is empty");
    }

    String contentType = file.getContentType();
    if (contentType == null || (!contentType.startsWith("image/") && !contentType.startsWith("audio/"))) {
      throw new ApiException(400, "Only image and audio file formats are supported");
    }

    try {
      String resourceType = contentType.startsWith("audio/") ? "video" : "image";

      Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
          "resource_type", resourceType
      ));

      String secureUrl = (String) uploadResult.get("secure_url");
      return Map.of("url", secureUrl);
    } catch (IOException e) {
      throw new ApiException(500, "Failed to upload file to cloud: " + e.getMessage());
    }
  }
}
