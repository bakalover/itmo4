package com.soa.navigatorspring.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
public class Coordinates {

    @DecimalMin(value = "-868", message = "x should be greater thatn -868")
    private long x;

    @NotNull(message = "coordinates.x is not provided")
    @DecimalMin(value = "-355", message = "y should be greater thatn -355")
    private Integer y;
}
