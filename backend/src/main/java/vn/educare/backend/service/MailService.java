package vn.educare.backend.service;

import java.nio.charset.StandardCharsets;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class MailService {

  private static final Logger LOGGER = LoggerFactory.getLogger(MailService.class);

  private final JavaMailSender mailSender;

  @Value("${spring.mail.username:}")
  private String fromAddress;

  public MailService(JavaMailSender mailSender) {
    this.mailSender = mailSender;
  }

  public void sendResetOtp(String to, String otpCode) {
    String subject = "EDUcare - Mã xác thực đặt lại mật khẩu";
    String plainText = "Bạn vừa yêu cầu đặt lại mật khẩu trên EDUcare.\n\n"
        + "Mã xác thực của bạn là: " + otpCode + "\n\n"
        + "Vui lòng nhập mã này trong vòng 15 phút để hoàn tất thao tác.\n\n"
        + "Trân trọng,\nĐội ngũ EDUcare";
    String htmlText = "<p>Xin chào,</p>"
        + "<p>Bạn vừa yêu cầu đặt lại mật khẩu trên <strong>EDUcare</strong>.</p>"
        + "<p>Mã xác thực của bạn là: <strong>" + otpCode + "</strong></p>"
        + "<p>Vui lòng nhập mã này trong vòng 15 phút để hoàn tất thao tác.</p>"
        + "<p>Trân trọng,<br/>Đội ngũ EDUcare</p>";

    MimeMessage message = mailSender.createMimeMessage();
    try {
      MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());
      if (fromAddress != null && !fromAddress.isBlank()) {
        helper.setFrom(fromAddress);
      }
      helper.setTo(to);
      helper.setSubject(subject);
      helper.setText(plainText, htmlText);
      LOGGER.info("Sending reset OTP email to {}", to);
      mailSender.send(message);
    } catch (MessagingException e) {
      throw new RuntimeException("Failed to send reset OTP email", e);
    }
  }
}
