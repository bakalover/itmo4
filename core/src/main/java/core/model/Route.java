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

import lombok.Data;

@Entity
@Table(name = "routes")
@Data
public class Route {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@NotNull(message = "name is null")
	@NotBlank(message = "name is blank")
	private String name;

	@NotNull(message = "coordinates is null")
	@OneToOne(cascade = CascadeType.ALL)
	private Coordinates coordinates;

	private String creationDate;

	@PrePersist
	protected void onCreate() {
		creationDate = new Date().toString();
	}

	@NotNull(message = "from location is null")
	@ManyToOne(cascade = CascadeType.PERSIST)
	@JoinColumn(name = "from_id")
	private Location from;

	@ManyToOne(cascade = CascadeType.PERSIST)
	@JoinColumn(name = "to_id")
	private Location to;

	@NotNull(message = "distance is null")
	@DecimalMin(value = "1", message = "distance should be greater 1")
	private Integer distance;
}
