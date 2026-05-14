package com.whenwemeet.result.service;

import com.whenwemeet.availability.entity.AvailableDate;
import com.whenwemeet.availability.repository.AvailableDateRepository;
import com.whenwemeet.participant.repository.ParticipantRepository;
import com.whenwemeet.result.dto.DateParticipantResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.whenwemeet.room.dto.UpdateRoomRequest;
import org.springframework.transaction.annotation.Transactional;
import com.whenwemeet.result.dto.ParticipantInfoResponse;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResultService {

    private final AvailableDateRepository availableDateRepository;
    private final ParticipantRepository participantRepository;

        public List<DateParticipantResponse> getResult(Long roomId) {
        List<AvailableDate> availableDates =
                availableDateRepository.findByParticipantRoomId(roomId);

        Map<LocalDate, List<ParticipantInfoResponse>> grouped = availableDates.stream()
                .collect(Collectors.groupingBy(
                        AvailableDate::getAvailableDate,
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                list -> list.stream()
                                        .map(availableDate -> new ParticipantInfoResponse(
                                                availableDate.getParticipant().getId(),
                                                availableDate.getParticipant().getName(),
                                                availableDate.getParticipant().getMember().getLoginId()
                                        ))
                                        .toList()
                        )
                ));

        return grouped.entrySet().stream()
                .map(entry -> new DateParticipantResponse(
                        entry.getKey(),
                        entry.getValue()
                ))
                .toList();
        }



    public List<LocalDate> getCommonAvailableDates(Long roomId) {
        long participantCount = participantRepository.countByRoomId(roomId);

        List<AvailableDate> availableDates =
                availableDateRepository.findByParticipantRoomId(roomId);

        Map<LocalDate, Long> countMap = availableDates.stream()
                .collect(Collectors.groupingBy(
                        AvailableDate::getAvailableDate,
                        Collectors.counting()
                ));

        return countMap.entrySet().stream()
                .filter(entry -> entry.getValue() == participantCount)
                .map(Map.Entry::getKey)
                .toList();
    }

    
}