package core.model;

import javax.validation.constraints.NotNull;

import core.helpers.validation.NullableNotBlank;
import lombok.Data;

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

