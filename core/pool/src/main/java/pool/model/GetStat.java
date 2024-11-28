package pool.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.io.Serializable;
import java.util.List;
import lombok.Data;

@Data
public class GetStat implements Serializable {

    @JsonProperty("routes")
    List<Route> routes;

    Integer totalElements;
    Integer totalPages;
    Integer numberOfElements;
}
