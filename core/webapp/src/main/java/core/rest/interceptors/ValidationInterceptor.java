package core.rest.interceptors;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import lombok.extern.slf4j.Slf4j;

// ExceptionInterceptor is not sufficient to catch this type of exceptions
@Provider
@Slf4j
public class ValidationInterceptor
    implements ExceptionMapper<ConstraintViolationException> {

    @Override
    public Response toResponse(ConstraintViolationException e) {
        log.warn("Validation violation!");
        ConstraintViolation cv = (ConstraintViolation) e
            .getConstraintViolations()
            .toArray()[0];
        return Response.status(Response.Status.BAD_REQUEST)
            .entity(cv.getMessage())
            .build();
    }
}
