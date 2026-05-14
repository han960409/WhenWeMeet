package com.whenwemeet.participant.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ParticipantResponse {

    private Long id;
    private String name;
    private String loginId;
    private boolean owner;
}

