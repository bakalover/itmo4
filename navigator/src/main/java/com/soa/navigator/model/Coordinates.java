package com.soa.navigator.model;

import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Coordinates {

    @NotNull
    @DecimalMin(value = "-868", message = "x should be greater thatn -868")
    private Integer x;

    @DecimalMin(value = "-355", message = "y should be greater thatn -355")
    private Integer y;
}
