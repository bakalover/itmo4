package com.soa.navigator.model;

import com.soa.navigator.helpers.validation.NullableNotBlank;
import javax.validation.constraints.NotNull;
import lombok.Data;

@Data
public class Location {

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
