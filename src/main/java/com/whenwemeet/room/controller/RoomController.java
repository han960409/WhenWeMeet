package com.whenwemeet.room.controller;

import com.whenwemeet.room.dto.CreateRoomRequest;
import com.whenwemeet.room.service.RoomService;
import lombok.RequiredArgsConstructor;
import com.whenwemeet.room.dto.RoomResponse;
import com.whenwemeet.room.dto.UpdateRoomRequest;

import java.time.LocalDate;

import org.springframework.web.bind.annotation.*;
import com.whenwemeet.room.dto.UpdateRoomRequest;
import jakarta.validation.Valid;
import jakarta.servlet.http.HttpSession;
import java.time.LocalDate;
import jakarta.servlet.http.HttpSession;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService roomService;

    @PostMapping
    public Long createRoom(
            @Valid @RequestBody CreateRoomRequest request,
            HttpSession session
    ) {
        Long memberId = (Long) session.getAttribute("LOGIN_MEMBER_ID");

        if (memberId == null) {
            throw new IllegalArgumentException("로그인이 필요합니다.");
        }

        return roomService.createRoom(request, memberId);
    }

    @GetMapping("/{roomId}")
    public RoomResponse getRoom(
            @PathVariable Long roomId,
            HttpSession session
    ) {
        Long memberId = (Long) session.getAttribute("LOGIN_MEMBER_ID");

        if (memberId == null) {
            throw new IllegalArgumentException("로그인이 필요합니다.");
        }

        return roomService.getRoom(roomId, memberId);
    }

    @GetMapping("/invite/{inviteCode}")
    public RoomResponse getRoomByInviteCode(
            @PathVariable String inviteCode
    ) {
        return roomService.getRoomByInviteCode(inviteCode);
    }

    @PutMapping("/{roomId}")
    public RoomResponse updateRoom(
            @PathVariable Long roomId,
            @Valid @RequestBody UpdateRoomRequest request
    ) {
        return roomService.updateRoom(roomId, request);
    }

    @DeleteMapping("/{roomId}")
    public void deleteRoom(
            @PathVariable Long roomId,
            HttpSession session
    ) {
        Long memberId = (Long) session.getAttribute("LOGIN_MEMBER_ID");

        if (memberId == null) {
            throw new IllegalArgumentException("로그인이 필요합니다.");
        }

        roomService.deleteRoom(roomId, memberId);
    }

    @PostMapping("/{roomId}/confirm")
    public void confirmDate(
            @PathVariable Long roomId,
            @RequestParam String date,
            HttpSession session
    ) {
        Long memberId = (Long) session.getAttribute("LOGIN_MEMBER_ID");

        if (memberId == null) {
            throw new IllegalArgumentException("로그인이 필요합니다.");
        }

        roomService.confirmDate(
                roomId,
                memberId,
                LocalDate.parse(date)
        );
    }

}