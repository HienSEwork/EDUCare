package vn.educare.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class LinkPreviewService {

  public record LinkPreviewDto(String url, String title, String description, String image) {}

  public LinkPreviewDto getPreview(String url) {
    try {
      if (url == null || url.isBlank()) {
        return null;
      }
      
      String youtubeVideoId = extractYoutubeVideoId(url);
      String defaultImage = null;
      if (youtubeVideoId != null) {
        defaultImage = "https://img.youtube.com/vi/" + youtubeVideoId + "/hqdefault.jpg";
      }

      Document doc = Jsoup.connect(url)
          .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
          .timeout(5000)
          .followRedirects(true)
          .get();

      String title = getMetaTag(doc, "og:title");
      if (title == null || title.isBlank()) {
        title = doc.title();
      }

      String description = getMetaTag(doc, "og:description");
      if (description == null || description.isBlank()) {
        description = getMetaTag(doc, "description");
      }

      String image = getMetaTag(doc, "og:image");
      if (image == null || image.isBlank()) {
        image = defaultImage;
      }

      return new LinkPreviewDto(url, title, description, image);
    } catch (Exception e) {
      log.error("Failed to fetch link preview for url: {}", url, e);
      // Fallback: return simple dto with url as title
      String youtubeVideoId = extractYoutubeVideoId(url);
      String fallbackImage = youtubeVideoId != null ? "https://img.youtube.com/vi/" + youtubeVideoId + "/hqdefault.jpg" : null;
      return new LinkPreviewDto(url, url, "Không thể tải mô tả.", fallbackImage);
    }
  }

  private String getMetaTag(Document doc, String tag) {
    Element element = doc.selectFirst("meta[property=" + tag + "]");
    if (element != null) {
      return element.attr("content");
    }
    element = doc.selectFirst("meta[name=" + tag + "]");
    if (element != null) {
      return element.attr("content");
    }
    return null;
  }

  private String extractYoutubeVideoId(String url) {
    if (url.contains("youtube.com") || url.contains("youtu.be")) {
      java.util.regex.Pattern pattern = java.util.regex.Pattern.compile(
          "(?:youtube\\.com\\/(?:[^\\/]+\\/.+\\/|(?:v|e(?:mbed)?)\\/"
          + "|.*[?&]v=)|youtu\\.be\\/)([^\"&?\\/\\s]{11})", 
          java.util.regex.Pattern.CASE_INSENSITIVE
      );
      java.util.regex.Matcher matcher = pattern.matcher(url);
      if (matcher.find()) {
        return matcher.group(1);
      }
    }
    return null;
  }
}
