package core.helpers;

import java.util.List;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.Arrays;

import java.lang.IllegalArgumentException;
import java.lang.ClassCastException;
import java.lang.reflect.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import core.model.Coordinates;
import core.model.Location;
import core.model.Route;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class Filter {

    private static final String example = "[coordinates.x=100,coordinates.y=200,from.x=300]";
    private static final List<Field> routeFields = Arrays.asList(Route.class.getDeclaredFields());
    private static final List<Field> locationFields = Arrays.asList(Location.class.getDeclaredFields());
    private static final List<Field> coordinateFields = Arrays.asList(Coordinates.class.getDeclaredFields());
    private static final List<String> secondLayerFields = List.of("from", "to", "coordinates");
    private static final Pattern pattern = Pattern
            .compile("\\[(?:\\s*(?P<key>[^=]+)\\s*=\\s*(?P<value>\\d+(?:\\.\\d+)?)\\s*(?:,\\s*)?)+]");

    public static List<Predicate<Route>> tryParse(String input)
            throws IllegalArgumentException {
        log.info("Got string to parse:{}", input);
        if (!pattern.matcher(input).matches()) {
            panic("");
        }
        var kvs = Arrays.asList(input.split(","));
        List<Predicate<Route>> resultFs = List.of();
        kvs.stream().forEach(entry -> {
            var kv = Arrays.asList(entry.split("="));
            var key = kv.get(0);
            var keyPath = Arrays.asList(key.split("."));
            var value = kv.get(1);
            resultFs.add(kvF(key, value));
        });
        return resultFs;
    }

    private static Predicate<Route> kvF(String key, String value) {
        switch (key) {
            case "id":
                return r -> r.getId() == Long.parseLong(value);
            case "":
                return r -> r.getId() == Long.parseLong(value);
            case "from.x":
                return r -> r.getFrom().getId() == Long.parseLong(value);
            case "id":
                return r -> r.getFrom().getId() == Long.parseLong(value);
            case "id":
                return r -> r.getId() == Long.parseLong(value);
            case "id":
                return r -> r.getId() == Long.parseLong(value);

            default:
                break;
        }
    }

    private static void panic(String with) throws IllegalArgumentException {
        throw new IllegalArgumentException("Invalid filter format!\n" + with + "\n" + "Example: " + example);
    }

    public static List<Route> apply(List<Route> input, List<Predicate<Route>> fs) {
        var resultStream = input.stream();
        fs.forEach(f -> resultStream.filter(f));
        var result = resultStream.collect(Collectors.toList());
        if (result.isEmpty()) {
            log.warn("No routes after filters remain");
        }
        return result;
    }

    public static List<Predicate<Route>> withoutFilters() {
        return List.of();
    }
}
