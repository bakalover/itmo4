package core.rest;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ValidationException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

import lombok.extern.slf4j.Slf4j;

@Provider
@Slf4j
public class ExceptionToStatus implements ExceptionMapper<Exception> {
    private final String InternalErrMsg = "Internal server error";

    @Override
    public Response toResponse(Exception e) {
        log.warn("Got exception: {}", e.getMessage());
        if (e instanceof ValidationException) {
            return Response.status(Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
        if (e instanceof EntityNotFoundException) {
            return Response.status(Status.NOT_FOUND).entity(e.getMessage()).build();
        }
        if (e instanceof EntityExistsException) {
            return Response.status(Status.CONFLICT).entity(e.getMessage()).build();
        }
        return Response.status(Status.INTERNAL_SERVER_ERROR).entity(InternalErrMsg).build();
    }
}
