package com.whenwemeet.room.dto;

import com.whenwemeet.room.entity.Room;

import java.time.LocalDate;

public record RoomResponse(
        Long id,
        String title,
        String description,
        LocalDate startDate,
        LocalDate endDate,
        String inviteCode
) {
    public static RoomResponse from(Room room) {
        return new RoomResponse(
                room.getId(),
                room.getTitle(),
                room.getDescription(),
                room.getStartDate(),
                room.getEndDate(),
                room.getInviteCode()
        );
    }
}