package com.soa.navigator.model;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Coordinates {

    @Min(value = -868, message = "x should be greater than -868")
    private long x;

    @NotNull(message = "coordinates.y not provided")
    @Min(value = -355, message = "y should be greater than -355")
    private Integer y;
}
