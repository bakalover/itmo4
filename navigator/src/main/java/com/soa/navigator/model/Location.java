package com.soa.navigator.model;

import com.soa.navigator.helpers.validation.NullableNotBlank;
import javax.validation.constraints.NotNull;
import lombok.Data;

@Data
public class Location {

    @NotNull
    private Long id;

    @NotNull
    private Double x;

    @NotNull
    private Integer y;

    @NotNull
    private Float z;

    @NullableNotBlank
    private String name;
}
