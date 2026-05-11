package com.whenwemeet.availability.dto;

import java.time.LocalDate;
import java.util.List;

public record CreateAvailableDatesRequest(
        List<LocalDate> dates
) {
}