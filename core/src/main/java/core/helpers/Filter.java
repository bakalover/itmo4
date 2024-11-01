package core.helpers;

import core.model.Route;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.function.Predicate;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class Filter {

    private static final String example =
        "coordinates.x_gt_100,coordinates.y_eq_200,from.x_lt_55.7566668]\nAwailable filters: _eq_, _gt_, _lt_";
    private static final List<String> secondLayerFields = List.of(
        "from",
        "to",
        "coordinates"
    );
    // v1 - "([a-zA-Z0-9_.]+:[^,\\]]+(?:,[a-zA-Z0-9_.]+:[^,\\]]+)*)"
    // v2 - ([a-zA-Z0-9_.]+(_eq_|_gt_|_lt_)[^,\]]+(?:,[a-zA-Z0-9_.]+(_eq_|_gt_|_lt_)[^,\]]+)*)
    private static final Pattern pattern = Pattern.compile(
        "([a-zA-Z0-9_.]+(_eq_|_gt_|_lt_)[^,\\]]+(?:,[a-zA-Z0-9_.]+(_eq_|_gt_|_lt_)[^,\\]]+)*)"
    );

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
            throw new IllegalArgumentException(
                "Unsupported field type: " + targetType
            );
        }
    }

    public static List<Predicate<Route>> tryParseFilters(String input)
        throws IllegalArgumentException {
        log.info("Got filter to parse:{}", input);
        if (!pattern.matcher(input).matches()) {
            panic("");
        }
        var kvs = Arrays.asList(input.split(","));
        log.info("{}", kvs);
        List<Predicate<Route>> resultFs = new ArrayList<>();
        kvs
            .stream()
            .forEach(entry -> {
                List<String> kv = null;
                Integer selector = 1;
                if (entry.contains("_gt_")) {
                    kv = Arrays.asList(entry.split("_gt_"));
                    selector = 2;
                } else if (entry.contains("_lt_")) {
                    kv = Arrays.asList(entry.split("_lt_"));
                    selector = 3;
                } else if (entry.contains("_eq_")) {
                    kv = Arrays.asList(entry.split("_eq_"));
                }
                log.info("kv to parse: {}", kv);
                log.info("selector:{}", selector);
                var key = kv.get(0);
                log.info("key: {}", key);
                var keyPath = Arrays.asList(key.split("\\."));
                log.info("keyPath: {}", keyPath);
                var value = kv.get(1);
                log.info("value: {}", value);
                resultFs.add(filterF(keyPath, value, selector));
            });
        return resultFs;
    }

    public static List<Comparator<Route>> tryParseSort(String input)
        throws IllegalArgumentException {
        log.info("Got sort criteria to parse:{}", input);
        var sorts = Arrays.asList(input.split(","));
        log.info("sorts: {}", sorts);
        List<Comparator<Route>> resultFs = new ArrayList<>();
        sorts
            .stream()
            .forEach(key -> {
                var keyPath = Arrays.asList(key.split("\\."));
                log.info("keyPath: {}", keyPath);
                resultFs.add(sortF(keyPath));
            });
        return resultFs;
    }

    private static Predicate<Route> filterF(
        List<String> keyPath,
        String value,
        Integer selector
    ) {
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
                    if (current == null) { // Nullable fields with corrent path not included by default
                        return false;
                    }
                }
                Field lastField = current
                    .getClass()
                    .getDeclaredField(keyPath.get(keyPath.size() - 1));
                lastField.setAccessible(true);
                if (secondLayerFields.contains(lastField.getName())) {
                    panic(
                        "Detected not complete path! Target value should be primitive!"
                    );
                }
                Class<?> fieldType = lastField.getType();
                Object convertedValue = convertValue(value, fieldType);

                switch (selector) {
                    case 1:
                        result = lastField.get(current).equals(convertedValue);
                        break;
                    case 2:
                        result =
                            ((Comparable) lastField.get(current)).compareTo(
                                    convertedValue
                                ) ==
                            1;
                        break;
                    case 3:
                        result =
                            ((Comparable) convertedValue).compareTo(
                                    lastField.get(current)
                                ) ==
                            1;
                        break;
                }
            } catch (NoSuchFieldException | IllegalAccessException e) {
                panic(e.getMessage());
            } catch (NumberFormatException e) {
                panic("Invalid type for key: " + keyPath.toString());
            }

            return result;
        };
    }

    private static Comparator<Route> sortF(List<String> keyPath) {
        return (r1, r2) -> {
            Object current1 = r1;
            Object current2 = r2;
            Field field1;
            Field field2;
            int result = 0;
            try {
                // Traverse path
                for (int i = 0; i < keyPath.size() - 1; i++) {
                    field1 = current1
                        .getClass()
                        .getDeclaredField(keyPath.get(i));
                    field1.setAccessible(true);
                    current1 = field1.get(current1);

                    field2 = current2
                        .getClass()
                        .getDeclaredField(keyPath.get(i));
                    field2.setAccessible(true);
                    current2 = field2.get(current2);
                }
                Field lastField1 = current1
                    .getClass()
                    .getDeclaredField(keyPath.get(keyPath.size() - 1));
                lastField1.setAccessible(true);
                Field lastField2 = current2
                    .getClass()
                    .getDeclaredField(keyPath.get(keyPath.size() - 1));
                lastField2.setAccessible(true);
                if (secondLayerFields.contains(lastField1.getName())) {
                    panic(
                        "Detected incomplete path! Target value should be primitive!"
                    );
                }

                // Black magik
                result = ((Comparable) lastField1.get(current1)).compareTo(
                        lastField2.get(current2)
                    );
            } catch (NoSuchFieldException | IllegalAccessException e) {
                panic(
                    "Cannot access such field for sorting: " +
                    keyPath.toString()
                );
            } catch (NumberFormatException e) {
                panic("Invalid type for key: " + keyPath.toString());
            }

            return result;
        };
    }

    // page > 0, size > 0
    public static List<Route> cut(List<Route> input, int page, int size) {
        var result = new ArrayList<Route>();
        var toSkip = (page - 1) * size;
        var start = toSkip; // First element has index -=1
        for (int i = start; i < Math.min(start + size, input.size()); i++) {
            result.add(input.get(i));
        }
        return result;
    }

    private static void panic(String with) throws IllegalArgumentException {
        throw new IllegalArgumentException(
            "Invalid request!\n" + with + "\n" + "Example: " + example
        );
    }

    public static List<Route> applyFilters(
        List<Route> input,
        List<Predicate<Route>> fs
    ) {
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

    public static List<Route> applySorts(
        List<Route> input,
        List<Comparator<Route>> fs
    ) {
        var resultStream = input.stream();
        for (Comparator<Route> f : fs) {
            resultStream = resultStream.sorted(f);
        }
        return resultStream.collect(Collectors.toList());
    }

    public static List<Predicate<Route>> withoutFilters() {
        return List.of();
    }
}
