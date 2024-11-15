package com.soa.navigator.model;

import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import lombok.Data;

@Data
public class Route {

    @NotNull
    private Integer id;

    @NotNull(message = "name is null")
    @NotBlank(message = "name is blank")
    private String name;

    @NotNull(message = "coordinates is null")
    private Coordinates coordinates;

    private String creationDate;

    @NotNull(message = "from location is null")
    private Location from;

    private Location to;

    @DecimalMin(value = "2", message = "distance should be greater 1")
    private long distance;
}
