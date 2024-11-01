package core.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import core.helpers.validation.NullableNotBlank;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Set;
import lombok.Data;

@Entity
@Data
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull(message = "location.x not provided")
    private Double x;

    @NotNull(message = "location.y not provided")
    private Integer y;

    @NotNull(message = "location.z not provided")
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
