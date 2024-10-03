package com.soa.navigator.model;

import javax.validation.constraints.NotNull;

import lombok.Data;

import com.soa.navigator.helpers.validation.NullableNotBlank;

@Data
public class Location {
    @NotNull
    private Double x;

    @NotNull
    private Integer y;

    @NotNull
    private Float z;

   
    @NullableNotBlank
    private String name;
}

