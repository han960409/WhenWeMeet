package com.whenwemeet.participant.controller;

import com.whenwemeet.participant.dto.CreateParticipantRequest;
import com.whenwemeet.participant.service.ParticipantService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/rooms/{roomId}/participants")
public class ParticipantController {

    private final ParticipantService participantService;

    @PostMapping
    public Long createParticipant(
            @PathVariable Long roomId,
            @RequestBody CreateParticipantRequest request
    ) {
        return participantService.createParticipant(roomId, request);
    }
}