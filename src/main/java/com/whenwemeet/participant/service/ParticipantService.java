package com.whenwemeet.participant.service;

import com.whenwemeet.availability.repository.AvailableDateRepository;
import com.whenwemeet.member.entity.Member;
import com.whenwemeet.member.repository.MemberRepository;
import com.whenwemeet.participant.dto.ParticipantResponse;
import com.whenwemeet.participant.entity.Participant;
import com.whenwemeet.participant.repository.ParticipantRepository;
import com.whenwemeet.room.entity.Room;
import com.whenwemeet.room.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ParticipantService {

    private final ParticipantRepository participantRepository;
    private final RoomRepository roomRepository;
    private final MemberRepository memberRepository;
    private final AvailableDateRepository availableDateRepository;

    @Transactional
    public Long joinRoom(Long roomId, Long memberId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("일정방을 찾을 수 없습니다."));

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

        return participantRepository.findByRoomIdAndMemberId(roomId, memberId)
                .map(Participant::getId)
                .orElseGet(() -> {
                    Participant participant = new Participant(
                            member.getName(),
                            room,
                            member
                    );

                    Participant savedParticipant = participantRepository.save(participant);

                    return savedParticipant.getId();
                });
    }

    public Long getMyParticipantId(Long roomId, Long memberId) {
        Participant participant = participantRepository.findByRoomIdAndMemberId(roomId, memberId)
                .orElseThrow(() -> new IllegalArgumentException("아직 참여하지 않았습니다."));

        return participant.getId();
    }

    @Transactional
    public void deleteParticipant(Long participantId) {
        Participant participant = participantRepository.findById(participantId)
                .orElseThrow(() -> new IllegalArgumentException("참여자를 찾을 수 없습니다."));

        availableDateRepository.deleteByParticipantId(participantId);
        participantRepository.delete(participant);
    }

    public List<ParticipantResponse> getRoomParticipants(Long roomId) {
    return participantRepository.findByRoom_Id(roomId)
            .stream()
            .map(participant -> new ParticipantResponse(
                    participant.getId(),
                    participant.getName(),
                    participant.getMember().getLoginId(),
                    participant.getRoom().isOwner(participant.getMember().getId())
            ))
            .toList();
}

        @Transactional
        public void leaveRoom(Long roomId, Long memberId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("일정방을 찾을 수 없습니다."));

        if (room.isOwner(memberId)) {
                throw new IllegalArgumentException("방장은 방에서 나갈 수 없습니다. 방 삭제를 이용해주세요.");
        }

        Participant participant = participantRepository.findByRoomIdAndMemberId(roomId, memberId)
                .orElseThrow(() -> new IllegalArgumentException("참여 중인 방이 아닙니다."));

        availableDateRepository.deleteByParticipantId(participant.getId());

        participantRepository.delete(participant);
        }
}