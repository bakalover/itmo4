package core.model;

import lombok.Data;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class GetStat {
    @JsonProperty("routes")
    List<Route> routes;
    Integer totalElements;
    Integer totalPages;
    Integer numberOfElements;
}
