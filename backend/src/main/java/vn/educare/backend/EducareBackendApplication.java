package vn.educare.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class EducareBackendApplication {

  public static void main(String[] args) {
    SpringApplication.run(EducareBackendApplication.class, args);
  }
}
