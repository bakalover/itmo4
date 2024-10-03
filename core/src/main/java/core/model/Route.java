package core.model;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import lombok.Data;

@Entity
@Table(name = "routes")
@Data
public class Route {
	@Id
	@NotNull
	@Positive(message = "Id should be positive integer!")
	private Long id;

	@NotNull
	@NotBlank
	private String name;

	@NotNull
	@OneToOne
	private Coordinates coordinates;

	@NotNull
	private String creationDate;

	@PrePersist
	protected void onCreate() {
		creationDate = new Date().toString();
	}

	@NotNull
	@OneToOne
	private Location from;

	@NotNull
	@OneToOne
	private Location to;

	@NotNull
	@DecimalMin(value = "1", message = "distance should be greater 1")
	private Integer distance;
}
