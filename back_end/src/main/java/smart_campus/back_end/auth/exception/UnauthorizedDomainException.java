package smart_campus.back_end.auth.exception;

import org.springframework.security.core.AuthenticationException;

public class UnauthorizedDomainException extends AuthenticationException {
    public UnauthorizedDomainException(String msg) {
        super(msg);
    }
}
