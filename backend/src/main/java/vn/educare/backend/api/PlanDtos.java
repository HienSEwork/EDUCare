package vn.educare.backend.api;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.Instant;
import vn.educare.backend.model.PlanType;

public class PlanDtos {

  public record PlanUpsertRequest(
      @NotBlank(message = "Mã gói cước không được để trống")
      String id,

      @NotBlank(message = "Tên gói cước không được để trống")
      String name,

      @NotNull(message = "Giá cước không được để trống")
      @DecimalMin(value = "0.0", message = "Giá cước không được nhỏ hơn 0")
      BigDecimal price,

      @NotNull(message = "Thời gian hiệu lực không được để trống")
      @Min(value = 1, message = "Thời gian hiệu lực phải tối thiểu 1 ngày")
      Integer durationDays,

      String description,

      @NotNull(message = "Trạng thái hoạt động không được để trống")
      Boolean active,

      Instant startDate,

      Instant endDate,

      @NotNull(message = "Loại gói cước không được để trống")
      PlanType planType
  ) {}
}
