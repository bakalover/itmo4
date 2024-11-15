package core.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Data
public class Coordinates {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Min(value = -868, message = "x should be greater than -868")
    private long x;

    @NotNull(message = "coordinates.y not provided")
    @Min(value = -355, message = "y should be greater than -355")
    private Integer y;
}
