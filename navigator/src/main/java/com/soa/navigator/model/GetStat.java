package com.soa.navigator.model;
import java.util.List;

import lombok.Data;

@Data
public class GetStat {
    List<Route> routes;
    Integer totalElements;
    Integer totalPages;
    Integer numberOfElements;
}
