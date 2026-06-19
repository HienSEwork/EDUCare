package vn.educare.backend.security;

import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

public class PayOSCryptoUtils {

  public static String hmacSha256(String data, String key) {
    try {
      SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
      Mac mac = Mac.getInstance("HmacSHA256");
      mac.init(secretKeySpec);
      byte[] hashBytes = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
      StringBuilder hexString = new StringBuilder();
      for (byte b : hashBytes) {
        String hex = Integer.toHexString(0xff & b);
        if (hex.length() == 1) {
          hexString.append('0');
        }
        hexString.append(hex);
      }
      return hexString.toString();
    } catch (Exception e) {
      throw new RuntimeException("Failed to calculate hmacSha256", e);
    }
  }

  public static String generateSignature(Map<String, Object> data, String checksumKey) {
    // Sort keys alphabetically
    Map<String, Object> sortedMap = new TreeMap<>(data);
    
    // Join as key1=value1&key2=value2...
    String signData = sortedMap.entrySet().stream()
        .map(entry -> entry.getKey() + "=" + entry.getValue().toString())
        .collect(Collectors.joining("&"));
        
    return hmacSha256(signData, checksumKey);
  }
}
