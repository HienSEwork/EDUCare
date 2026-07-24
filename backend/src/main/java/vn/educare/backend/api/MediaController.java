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
    if (file.getSize() > 100L * 1024 * 1024) {
      throw new ApiException(400, "File vượt quá giới hạn 100 MB");
    }
    if (contentType == null || (!contentType.startsWith("image/") && !contentType.startsWith("audio/") && !contentType.startsWith("video/"))) {
      throw new ApiException(400, "Chỉ hỗ trợ file ảnh, âm thanh và video");
    }

    try {
      String resourceType = contentType.startsWith("image/") ? "image" : "video";

      Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
          "resource_type", resourceType,
          "folder", "educare/content"
      ));

      String secureUrl = (String) uploadResult.get("secure_url");
      return Map.of("url", secureUrl);
    } catch (IOException e) {
      throw new ApiException(500, "Failed to upload file to cloud: " + e.getMessage());
    }
  }
}
