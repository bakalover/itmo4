package com.soa.navigator.helpers.validation;

public enum Order {
    NAME("name"),
    DISTANCE("distance"),
    ID("id"),
    CREATION_TIME("creation_time"),
    FROM_X("from_x"),
    FROM_Y("from_y"),
    FROM_NAME("from_name"),
    TO_X("to_x"),
    TO_Y("to_y"),
    TO_NAME("to_name"),
    COORDINATES_X("coordinates_x"),
    COORDINATES_Y("coordinates_y");

    final public String name;
    Order(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}

