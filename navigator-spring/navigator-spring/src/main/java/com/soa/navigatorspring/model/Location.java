package com.soa.navigatorspring.model;

import com.soa.navigatorspring.validation.NullableNotBlank;
import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class Location {

    @NotNull
    private Long id;

    @NotNull(message = "location.x is not provided")
    private long x;

    @NotNull(message = "location.y is not provided")
    private Integer y;

    @NotNull(message = "location.z is not provided")
    private Float z;

    @NullableNotBlank
    private String name;
}
