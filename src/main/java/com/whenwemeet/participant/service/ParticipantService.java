package com.whenwemeet.participant.service;

import com.whenwemeet.participant.dto.CreateParticipantRequest;
import com.whenwemeet.participant.entity.Participant;
import com.whenwemeet.participant.repository.ParticipantRepository;
import com.whenwemeet.room.entity.Room;
import com.whenwemeet.room.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ParticipantService {

    private final ParticipantRepository participantRepository;
    private final RoomRepository roomRepository;

    public Long createParticipant(Long roomId, CreateParticipantRequest request) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("일정방을 찾을 수 없습니다."));

        Participant participant = new Participant(request.name(), room);

        Participant savedParticipant = participantRepository.save(participant);

        return savedParticipant.getId();
    }
}