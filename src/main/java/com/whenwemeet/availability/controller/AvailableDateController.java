package com.whenwemeet.availability.controller;

import com.whenwemeet.availability.dto.CreateAvailableDatesRequest;
import com.whenwemeet.availability.service.AvailableDateService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/participants/{participantId}/available-dates")
public class AvailableDateController {

    private final AvailableDateService availableDateService;

    @PostMapping
    public Long saveAvailableDates(
            @PathVariable Long participantId,
            @RequestBody CreateAvailableDatesRequest request
    ) {
        return availableDateService.saveAvailableDates(participantId, request);
    }
}