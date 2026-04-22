package smart_campus.back_end.auth.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import smart_campus.back_end.auth.model.User;
import smart_campus.back_end.auth.repository.UserRepository;


import java.util.Collections;
import java.util.stream.Collectors;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String email = oAuth2User.getAttribute("email"); // normalize email
        String name = oAuth2User.getAttribute("name");


        // Save user if not exists
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User(name, email, Collections.singletonList("ROLE_USER"), "google");
            User saved = userRepository.save(newUser);

            return saved;
        });

        // Convert roles to Spring authorities
        var authorities = user.getRoles().stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        // Return a DefaultOAuth2User with proper authorities
        return new DefaultOAuth2User(authorities, oAuth2User.getAttributes(), "email");
    }
}
