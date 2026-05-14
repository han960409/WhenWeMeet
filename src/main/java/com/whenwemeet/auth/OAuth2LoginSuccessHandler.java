package com.whenwemeet.auth;

import com.whenwemeet.member.entity.Member;
import com.whenwemeet.member.repository.MemberRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final MemberRepository memberRepository;

        @Value("${app.frontend-url}")
        private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {

        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();

        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");

        Member member = memberRepository.findByLoginId(email)
                .orElseGet(() -> memberRepository.save(
                        new Member(email, "SOCIAL_LOGIN", name, "GOOGLE")
                ));

        request.getSession().setAttribute("LOGIN_MEMBER_ID", member.getId());

        response.sendRedirect(frontendUrl);
    }
}