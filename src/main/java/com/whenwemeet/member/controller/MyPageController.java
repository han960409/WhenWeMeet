package com.whenwemeet.member.controller;

import com.whenwemeet.room.dto.RoomResponse;
import com.whenwemeet.room.service.RoomService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/mypage")
public class MyPageController {

    private final RoomService roomService;

    @GetMapping("/rooms/owned")
    public List<RoomResponse> getOwnedRooms(HttpSession session) {
        Long memberId = (Long) session.getAttribute("LOGIN_MEMBER_ID");

        if (memberId == null) {
            throw new IllegalArgumentException("로그인이 필요합니다.");
        }

        return roomService.getOwnedRooms(memberId);
    }

    @GetMapping("/rooms/joined")
    public List<RoomResponse> getJoinedRooms(HttpSession session) {
        Long memberId = (Long) session.getAttribute("LOGIN_MEMBER_ID");

        if (memberId == null) {
            throw new IllegalArgumentException("로그인이 필요합니다.");
        }

        return roomService.getJoinedRooms(memberId);
    }
}