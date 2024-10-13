package core.helpers;

import java.util.List;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.Arrays;
import java.lang.IllegalArgumentException;
import java.lang.reflect.*;
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
            .compile("\\[([a-zA-Z0-9_.]+=[^,\\]]+(?:,[a-zA-Z0-9_.]+=[^,\\]]+)*)\\]");

    private static Object convertValue(String value, Class<?> targetType) {
        if (targetType == String.class) {
            return value;
        } else if (targetType == int.class || targetType == Integer.class) {
            return Integer.parseInt(value);
        } else if (targetType == long.class || targetType == Long.class) {
            return Long.parseLong(value);
        } else if (targetType == float.class || targetType == Float.class) {
            return Float.parseFloat(value);
        } else if (targetType == double.class || targetType == Double.class) {
            return Double.parseDouble(value);
        } else if (targetType == boolean.class || targetType == Boolean.class) {
            return Boolean.parseBoolean(value);
        } else {
            throw new IllegalArgumentException("Unsupported field type: " + targetType);
        }
    }

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
            resultFs.add(kvF(keyPath, value));
        });
        return resultFs;
    }

    private static Predicate<Route> kvF(List<String> keyPath, String value) {
        return root -> {
            Object current = root;
            Field field;
            Boolean result = false;
            try {
                // Traverse path
                for (int i = 0; i < keyPath.size() - 1; i++) {
                    field = current.getClass().getDeclaredField(keyPath.get(i));
                    field.setAccessible(true);
                    current = field.get(current);
                }
                Field lastField = current.getClass().getDeclaredField(keyPath.get(keyPath.size() - 1));
                lastField.setAccessible(true);
                if (secondLayerFields.contains(lastField.getName())) {
                    panic("Detected not complete path! Target value should be primitive!");
                }
                Class<?> fieldType = lastField.getType();
                Object convertedValue = convertValue(value, fieldType);
                result = lastField.get(current).equals(convertedValue);
            } catch (NoSuchFieldException | IllegalAccessException e) {
                panic(e.getMessage());
            }

            return result;
        };
    }

    private static void panic(String with) throws IllegalArgumentException {
        throw new IllegalArgumentException("Invalid filter format!\n" + with + "\n" + "Example: " + example);
    }

    public static List<Route> apply(List<Route> input, List<Predicate<Route>> fs) {
        var resultStream = input.stream();
        for (Predicate<Route> f : fs) {
            resultStream = resultStream.filter(f);
        }
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
