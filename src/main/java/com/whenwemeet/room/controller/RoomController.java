package com.whenwemeet.room.controller;

import com.whenwemeet.room.dto.CreateRoomRequest;
import com.whenwemeet.room.service.RoomService;
import lombok.RequiredArgsConstructor;
import com.whenwemeet.room.dto.RoomResponse;

import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService roomService;

    @PostMapping
    public Long createRoom(
           @Valid @RequestBody CreateRoomRequest request
    ) {
        return roomService.createRoom(request);
    }

    @GetMapping("/{roomId}")
    public RoomResponse getRoom(
            @PathVariable Long roomId
    ) {
        return roomService.getRoom(roomId);
    }

    @GetMapping("/invite/{inviteCode}")
    public RoomResponse getRoomByInviteCode(
            @PathVariable String inviteCode
    ) {
        return roomService.getRoomByInviteCode(inviteCode);
    }
}