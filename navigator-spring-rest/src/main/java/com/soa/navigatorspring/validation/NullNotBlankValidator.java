package com.soa.navigatorspring.validation;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class NullNotBlankValidator implements ConstraintValidator<NullableNotBlank, String> {

    @Override
    public void initialize(NullableNotBlank constraintAnnotation) {
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return true; 
        }
        return !value.trim().isEmpty(); 
    }
}