package core.rest;

import jakarta.json.bind.JsonbException;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.NoResultException;
import jakarta.validation.ValidationException;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.NotSupportedException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

import lombok.extern.slf4j.Slf4j;

@Provider
@Slf4j
public class ExceptionToStatus implements ExceptionMapper<Exception> {
    private final String internalErrMsg = "Internal server error";

    @Override
    public Response toResponse(Exception e) {

        // All my exception got wrapped inside jakarta EJB Exception
        var flatten = e.getCause();
        if (flatten == null) { // If request does not reach bean, produces exception is not wrapped
            flatten = e;
        }
        log.warn("Got exception: {}", flatten.toString());

        if (flatten instanceof ValidationException
                || flatten instanceof IllegalArgumentException
                || flatten instanceof ClassCastException) {
            return Response.status(Status.BAD_REQUEST).entity(flatten.getMessage()).build();
        }
        if (flatten instanceof NotSupportedException || flatten instanceof JsonbException) {
            return Response.status(Status.BAD_REQUEST).entity("Invalid payload format").build();
        }
        if (flatten instanceof NotFoundException) {
            return Response.status(Status.BAD_REQUEST).entity("Specified path does not exist!").build();
        }
        if (flatten instanceof EntityNotFoundException
                || flatten instanceof NoResultException) {
            return Response.status(Status.NOT_FOUND).entity(flatten.getMessage()).build();
        }
        if (flatten instanceof EntityExistsException) {
            return Response.status(Status.CONFLICT).entity(flatten.getMessage()).build();
        }
        return Response.status(Status.INTERNAL_SERVER_ERROR).entity(internalErrMsg).build();
    }
}
