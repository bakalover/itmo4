package com.soa.navigatorspring.validation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = NullNotBlankValidator.class)
public @interface NullableNotBlank {
    String message() default "Field must not be blank if provided";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}