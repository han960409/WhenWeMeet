package com.whenwemeet.result.service;

import com.whenwemeet.availability.entity.AvailableDate;
import com.whenwemeet.availability.repository.AvailableDateRepository;
import com.whenwemeet.participant.repository.ParticipantRepository;
import com.whenwemeet.result.dto.DateCountResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ResultService {

    private final AvailableDateRepository availableDateRepository;
    private final ParticipantRepository participantRepository;

    public List<DateCountResponse> getResult(Long roomId) {

        List<AvailableDate> availableDates =
                availableDateRepository.findByParticipantRoomId(roomId);

        Map<LocalDate, Long> countMap = availableDates.stream()
                .collect(
                        java.util.stream.Collectors.groupingBy(
                                AvailableDate::getAvailableDate,
                                java.util.stream.Collectors.counting()
                        )
                );

        return countMap.entrySet().stream()
                .map(entry ->
                        new DateCountResponse(
                                entry.getKey(),
                                entry.getValue()
                        )
                )
                .toList();
    }

    public List<LocalDate> getCommonAvailableDates(Long roomId) {

        long participantCount = participantRepository.countByRoomId(roomId);

        List<AvailableDate> availableDates =
                availableDateRepository.findByParticipantRoomId(roomId);

        Map<LocalDate, Long> countMap = availableDates.stream()
                .collect(
                        java.util.stream.Collectors.groupingBy(
                                AvailableDate::getAvailableDate,
                                java.util.stream.Collectors.counting()
                        )
                );

        return countMap.entrySet().stream()
                .filter(entry -> entry.getValue() == participantCount)
                .map(Map.Entry::getKey)
                .toList();
    }
}