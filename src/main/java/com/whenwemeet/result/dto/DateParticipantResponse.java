package com.whenwemeet.result.dto;

import java.time.LocalDate;
import java.util.List;

public record DateParticipantResponse(
        LocalDate date,
        List<ParticipantInfoResponse> participants
) {
}