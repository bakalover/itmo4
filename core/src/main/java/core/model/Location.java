package core.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotNull;

import core.helpers.validation.NullableNotBlank;
import lombok.Data;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.HashSet;

@Entity
@Data
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
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

    @OneToMany(mappedBy = "from")
    @JsonIgnore
    private Set<Route> routesStartingHere = new HashSet<>();

    @OneToMany(mappedBy = "to")
    @JsonIgnore
    private Set<Route> routesEndingHere = new HashSet<>();

}
