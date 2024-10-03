package core.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import lombok.Data;

@Entity
@Data
public class Coordinates {
    @Id
    @NotNull
    private Long id;

    @NotNull
    @DecimalMin(value = "-868", message = "x should be greater thatn -868")
    private Integer x;

    @DecimalMin(value = "-355", message = "y should be greater thatn -355")
    private Integer y;
}
