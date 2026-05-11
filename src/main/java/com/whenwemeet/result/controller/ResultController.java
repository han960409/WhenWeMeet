package com.whenwemeet.result.controller;

import com.whenwemeet.result.dto.DateCountResponse;
import com.whenwemeet.result.service.ResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/rooms/{roomId}/result")
public class ResultController {

    private final ResultService resultService;

    @GetMapping
    public List<DateCountResponse> getResult(
            @PathVariable Long roomId
    ) {
        return resultService.getResult(roomId);
    }

    @GetMapping("/common")
    public List<LocalDate> getCommonAvailableDates(
            @PathVariable Long roomId
    ) {
        return resultService.getCommonAvailableDates(roomId);
    }
}