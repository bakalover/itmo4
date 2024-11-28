package com.soa.navigatorspring.model;

import lombok.Data;

import java.util.List;

@Data
public class GetStat {
    List<Route> routes;
    Integer totalElements;
    Integer totalPages;
    Integer numberOfElements;
}
