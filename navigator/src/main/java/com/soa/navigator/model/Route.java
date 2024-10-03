package com.soa.navigator.model;

import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import lombok.Data;

@Data
public class Route {
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

	@NotNull
	private Location from;

	@NotNull
	private Location to;

	@NotNull
	@DecimalMin(value = "2", message = "distance should be greater 1")
	private Integer distance;
}
