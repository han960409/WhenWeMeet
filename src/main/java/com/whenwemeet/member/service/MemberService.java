package com.whenwemeet.member.service;

import com.whenwemeet.availability.repository.AvailableDateRepository;
import com.whenwemeet.mail.MailService;
import com.whenwemeet.member.dto.EmailVerificationCodeRequest;
import com.whenwemeet.member.dto.EmailVerificationVerifyRequest;
import com.whenwemeet.member.dto.FindLoginIdRequest;
import com.whenwemeet.member.dto.LoginRequest;
import com.whenwemeet.member.dto.MemberResponse;
import com.whenwemeet.member.dto.PasswordResetCodeRequest;
import com.whenwemeet.member.dto.PasswordResetConfirmRequest;
import com.whenwemeet.member.dto.PasswordResetVerifyRequest;
import com.whenwemeet.member.dto.SignupRequest;
import com.whenwemeet.member.entity.Member;
import com.whenwemeet.member.repository.MemberRepository;
import com.whenwemeet.participant.entity.Participant;
import com.whenwemeet.participant.repository.ParticipantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.whenwemeet.member.dto.EmailVerificationCodeRequest;
import com.whenwemeet.member.dto.EmailVerificationVerifyRequest;
import com.whenwemeet.room.entity.Room;
import com.whenwemeet.room.repository.RoomRepository;
import org.springframework.security.crypto.password.PasswordEncoder;


import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final ParticipantRepository participantRepository;
    private final AvailableDateRepository availableDateRepository;
    private final MailService mailService;
    private final PasswordEncoder passwordEncoder;

    private final Map<String, String> passwordResetCodes =
            new ConcurrentHashMap<>();

    private final Map<String, String> signupEmailCodes =
            new ConcurrentHashMap<>();

    private final Map<String, Boolean> verifiedSignupEmails =
            new ConcurrentHashMap<>();

    private final RoomRepository roomRepository;

    public MemberResponse signup(SignupRequest request) {

        

        if (memberRepository.existsByLoginId(request.loginId())) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
        }

        if (memberRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        Member member = new Member(
                request.loginId(),
                passwordEncoder.encode(request.password()),
                request.name(),
                request.email()
        );

        Member savedMember = memberRepository.save(member);


        return MemberResponse.from(savedMember);
    }

    public MemberResponse login(LoginRequest request) {

        Member member = memberRepository.findByLoginId(
                        request.loginId()
                )
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "아이디 또는 비밀번호가 올바르지 않습니다."
                        )
                );

        if (!passwordEncoder.matches(request.password(), member.getPassword())) {
                throw new IllegalArgumentException("아이디 또는 비밀번호가 올바르지 않습니다.");
                }

        return MemberResponse.from(member);
    }

    public MemberResponse getMember(Long memberId) {

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "회원을 찾을 수 없습니다."
                        )
                );

        return MemberResponse.from(member);
    }

    @Transactional
    public void deleteMe(Long memberId) {

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "회원을 찾을 수 없습니다."
                        )
                );

        List<Participant> participants =
                participantRepository.findByMember_Id(memberId);

        List<Room> rooms =
                roomRepository.findByOwner_Id(memberId);

        for (Room room : rooms) {
            roomRepository.delete(room);
}
        
        for (Participant participant : participants) {

            availableDateRepository.deleteByParticipantId(
                    participant.getId()
            );

            participantRepository.delete(participant);
        }

        memberRepository.delete(member);
    }

    public void sendPasswordResetCode(
            PasswordResetCodeRequest request
    ) {

        Member member =
                memberRepository.findByLoginIdAndEmail(
                        request.loginId(),
                        request.email()
                ).orElseThrow(() ->
                        new IllegalArgumentException(
                                "아이디와 이메일이 일치하는 계정을 찾을 수 없습니다."
                        )
                );

        if (!"LOCAL".equals(member.getProvider())) {
            throw new IllegalArgumentException(
                    "소셜 로그인 계정은 비밀번호 재설정을 사용할 수 없습니다."
            );
        }

        String code = String.format(
                "%06d",
                new Random().nextInt(1_000_000)
        );

        String key =
                request.loginId() + ":" + request.email();

        passwordResetCodes.put(key, code);

        mailService.sendPasswordResetCode(
                request.email(),
                code
        );
    }

    public void verifyPasswordResetCode(
            PasswordResetVerifyRequest request
    ) {

        String key =
                request.loginId() + ":" + request.email();

        String savedCode =
                passwordResetCodes.get(key);

        if (savedCode == null ||
                !savedCode.equals(request.code())) {

            throw new IllegalArgumentException(
                    "인증코드가 올바르지 않습니다."
            );
        }
    }

    @Transactional
    public void resetPassword(
            PasswordResetConfirmRequest request
    ) {

        String key =
                request.loginId() + ":" + request.email();

        String savedCode =
                passwordResetCodes.get(key);

        if (savedCode == null ||
                !savedCode.equals(request.code())) {

            throw new IllegalArgumentException(
                    "인증코드가 올바르지 않습니다."
            );
        }

        Member member =
                memberRepository.findByLoginIdAndEmail(
                        request.loginId(),
                        request.email()
                ).orElseThrow(() ->
                        new IllegalArgumentException(
                                "아이디와 이메일이 일치하는 계정을 찾을 수 없습니다."
                        )
                );

        if (!"LOCAL".equals(member.getProvider())) {
            throw new IllegalArgumentException(
                    "소셜 로그인 계정은 비밀번호 재설정을 사용할 수 없습니다."
            );
        }

        member.changePassword(request.newPassword());

        passwordResetCodes.remove(key);
    }

    public void sendLoginIdToEmail(
            FindLoginIdRequest request
    ) {

        Member member =
                memberRepository.findByEmailAndName(
                        request.email(),
                        request.name()
                ).orElseThrow(() ->
                        new IllegalArgumentException(
                                "일치하는 회원 정보를 찾을 수 없습니다."
                        )
                );

        if (!"LOCAL".equals(member.getProvider())) {
            throw new IllegalArgumentException(
                    "소셜 로그인 계정은 아이디 찾기를 사용할 수 없습니다."
            );
        }

        mailService.sendLoginId(
                request.email(),
                member.getLoginId()
        );
    }

    public void sendSignupEmailCode(EmailVerificationCodeRequest request) {
        if (memberRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        String code = String.format(
                "%06d",
                new Random().nextInt(1_000_000)
        );

        signupEmailCodes.put(request.email(), code);
        verifiedSignupEmails.remove(request.email());

        mailService.sendSignupVerificationCode(request.email(), code);
    }

    public void verifySignupEmailCode(EmailVerificationVerifyRequest request) {
        String savedCode = signupEmailCodes.get(request.email());

        if (savedCode == null || !savedCode.equals(request.code())) {
            throw new IllegalArgumentException("인증코드가 올바르지 않습니다.");
        }

        verifiedSignupEmails.put(request.email(), true);
        signupEmailCodes.remove(request.email());
    }
}