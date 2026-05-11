package com.whenwemeet.global.exception;

public record ErrorResponse(
        int status,
        String message
) {
}