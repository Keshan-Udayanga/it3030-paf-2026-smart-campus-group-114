package smart_campus.back_end.auth.service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;
import smart_campus.back_end.auth.model.User;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JWTService {

    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24; // 24h

    private final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(
            "smartcampusjwtsecretkeysmartcampus1234567890".getBytes() // must be at least 32 bytes
    );

    public String generateToken(User user){
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("role", user.getRoles())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SECRET_KEY)
                .compact();
    }

    public String extractEmail(String token){
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean isTokenValid(String token) {
        try {
            Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
