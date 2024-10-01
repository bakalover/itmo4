package core.model;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import lombok.Data;

@Entity
@Table(name = "routes")
@Data
public class Route {
	@Id
	@NotNull
	@Positive(message ="Id should be positive integer!")
	private Long id;

	@NotNull
	@NotBlank
	private String name;

	@NotNull
	private Coordinates coordinates;

	@NotNull
	private String creationDate;

	@PrePersist
    protected void onCreate() {
        creationDate = new Date().toString();
    }

	@NotNull
	private Location from;

	@NotNull
	private Location to;

	@NotNull
	@DecimalMin(value = "1", message = "distance should be greater 1")
	private Integer distance;
}
