package smart_campus.back_end.auth.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.hierarchicalroles.RoleHierarchy;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import smart_campus.back_end.auth.exception.UnauthorizedDomainException;
import smart_campus.back_end.auth.service.CustomOAuth2UserService;
import smart_campus.back_end.auth.service.JWTAuthenticationFilter;
import smart_campus.back_end.auth.service.OAuth2SuccessHandler;

import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private CustomOAuth2UserService customOAuth2UserService;

    @Autowired
    private OAuth2SuccessHandler oAuth2SuccessHandler;

    @Autowired
    private JWTAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)throws Exception{
        http
                .cors(cors -> {})
                .csrf(csrf -> csrf.disable())
                .formLogin(form -> form.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(
                                "/api/v1/auth/**",
                                "/oauth2/**",
                                "/login/oauth2/**"
                        ).permitAll()
                        .requestMatchers("/api/v1/notifications/**").hasRole("USER")
                        .requestMatchers("/api/v1/users/**").hasRole("ADMIN")
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        .anyRequest().authenticated() // all other endpoints require auth

                        // PUBLIC GET RESOURCES
                        .requestMatchers("/api/resources").permitAll()

                        // BOOKING ACCESS (IMPORTANT FIX)
                        .requestMatchers("/api/bookings/**")
                        .hasAnyRole("ADMIN", "RESOURCE_MANAGER")

                        // OTHER MODULES
                        .requestMatchers("/api/resources/**")
                        .hasAnyRole("ADMIN", "RESOURCE_MANAGER")

                        .requestMatchers("/api/v1/notifications/**")
                        .hasAnyRole("ADMIN", "USER", "RESOURCE_MANAGER")

                        .requestMatchers("/api/v1/users/**")
                        .hasRole("ADMIN")

                        .requestMatchers("/admin/**")
                        .hasRole("ADMIN")

                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserService) // connect your MongoDB user service
                        )
                        .successHandler(oAuth2SuccessHandler)
                        .failureHandler((request, response, exception) -> {
                            String redirectUrl = "http://localhost:3000/login?error=access_denied";

                            if (exception instanceof UnauthorizedDomainException) {
                                redirectUrl = "http://localhost:3000/login?error=invalid_domain";
                            }

                            response.sendRedirect(redirectUrl);
                        })
                );
        http.addFilterBefore(jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // ---------------- CORS FIX ----------------
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000")); // React app
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*")); // allow Authorization header
        configuration.setAllowCredentials(true); // if cookies are used
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    // ---------------- ROLE HIERARCHY ----------------
    @Bean
    public RoleHierarchy roleHierarchy(){
        return RoleHierarchyImpl.fromHierarchy("ROLE_ADMIN > ROLE_RESOURCE_MANAGER \n ROLE_RESOURCE_MANAGER > ROLE_TECHNICIAN \n ROLE_TECHNICIAN > ROLE_USER");
    }
}