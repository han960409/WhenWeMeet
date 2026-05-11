package com.whenwemeet.availability.service;

import com.whenwemeet.availability.dto.CreateAvailableDatesRequest;
import com.whenwemeet.availability.entity.AvailableDate;
import com.whenwemeet.availability.repository.AvailableDateRepository;
import com.whenwemeet.participant.entity.Participant;
import com.whenwemeet.participant.repository.ParticipantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AvailableDateService {

    private final AvailableDateRepository availableDateRepository;
    private final ParticipantRepository participantRepository;

    public Long saveAvailableDates(Long participantId, CreateAvailableDatesRequest request) {
        Participant participant = participantRepository.findById(participantId)
                .orElseThrow(() -> new IllegalArgumentException("참여자를 찾을 수 없습니다."));

        List<AvailableDate> availableDates = request.dates().stream()
                .map(date -> new AvailableDate(date, participant))
                .toList();

        availableDateRepository.saveAll(availableDates);

        return participantId;
    }
}