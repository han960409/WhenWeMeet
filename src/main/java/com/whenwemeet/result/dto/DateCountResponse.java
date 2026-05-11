package com.whenwemeet.result.dto;

import java.time.LocalDate;

public record DateCountResponse(
        LocalDate date,
        Long count
) {
}