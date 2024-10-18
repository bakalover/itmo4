package core.model;

import java.util.Date;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Positive(message = "Id should be positive integer!")
	private Long id;

	@NotNull
	@NotBlank
	private String name;

	@NotNull
	@OneToOne(cascade = CascadeType.ALL)
	private Coordinates coordinates;

	@NotNull
	private String creationDate;

	@PrePersist
	protected void onCreate() {
		creationDate = new Date().toString();
	}

	@NotNull
	@ManyToOne(cascade = CascadeType.PERSIST)
	@JoinColumn(name = "from_id")
	private Location from;

	@NotNull
	@ManyToOne(cascade = CascadeType.PERSIST)
	@JoinColumn(name = "to_id")
	private Location to;

	@NotNull
	@DecimalMin(value = "1", message = "distance should be greater 1")
	private Integer distance;
}
