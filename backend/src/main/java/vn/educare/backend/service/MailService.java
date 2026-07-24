package vn.educare.backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.nio.charset.StandardCharsets;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import vn.educare.backend.api.ApiException;

@Service
public class MailService {

  private static final Logger log = LoggerFactory.getLogger(MailService.class);

  private final JavaMailSender mailSender;

  @Value("${spring.mail.username:}")
  private String fromAddress;

  public MailService(JavaMailSender mailSender) {
    this.mailSender = mailSender;
  }

  public boolean isConfigured() {
    return fromAddress != null && !fromAddress.isBlank();
  }

  public void sendResetOtp(String to, String fullName, String otpCode) {
    MimeMessage message = mailSender.createMimeMessage();
    try {
      MimeMessageHelper helper = new MimeMessageHelper(
          message,
          MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
          StandardCharsets.UTF_8.name());
      helper.setFrom(fromAddress);
      helper.setTo(to);
      helper.setSubject("EDUcare - Mã xác thực đặt lại mật khẩu");
      helper.setText(
          plainText(fullName, otpCode),
          htmlText(fullName, otpCode));
      mailSender.send(message);
    } catch (MessagingException | MailException exception) {
      log.error("Failed to send password reset email", exception);
      throw new ApiException(503, "Không thể gửi email OTP. Vui lòng thử lại sau.");
    }
  }

  private String plainText(String fullName, String otpCode) {
    return "Xin chào " + safeName(fullName) + ",\n\n"
        + "Mã OTP đặt lại mật khẩu EDUcare của bạn là: " + otpCode + "\n\n"
        + "Mã có hiệu lực trong 15 phút và chỉ dùng được một lần. "
        + "Không chia sẻ mã này với bất kỳ ai.\n\n"
        + "Nếu bạn không yêu cầu, hãy bỏ qua email này.\n\nEDUcare";
  }

  private String htmlText(String fullName, String otpCode) {
    return "<div style=\"font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#172033\">"
        + "<div style=\"padding:24px;border:1px solid #fbcfe8;border-radius:20px;background:#fff7fa\">"
        + "<h2 style=\"margin:0 0 16px;color:#db2777\">Đặt lại mật khẩu EDUcare</h2>"
        + "<p>Xin chào <strong>" + escapeHtml(safeName(fullName)) + "</strong>,</p>"
        + "<p>Mã xác thực của bạn là:</p>"
        + "<div style=\"margin:20px 0;padding:16px;text-align:center;border-radius:14px;"
        + "background:#ffffff;color:#be185d;font-size:30px;font-weight:800;letter-spacing:8px\">"
        + otpCode + "</div>"
        + "<p>Mã có hiệu lực trong <strong>15 phút</strong> và chỉ dùng được một lần.</p>"
        + "<p style=\"color:#64748b\">Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>"
        + "</div></div>";
  }

  private String safeName(String fullName) {
    return fullName == null || fullName.isBlank() ? "bạn" : fullName.trim();
  }

  private String escapeHtml(String value) {
    return value.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace("\"", "&quot;")
        .replace("'", "&#39;");
  }
}
