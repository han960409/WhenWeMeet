package com.whenwemeet.room.service;

import com.whenwemeet.room.dto.CreateRoomRequest;
import com.whenwemeet.room.entity.Room;
import com.whenwemeet.room.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.whenwemeet.room.dto.RoomResponse;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;

    public Long createRoom(CreateRoomRequest request) {

        Room room = new Room(
                request.title(),
                request.description(),
                request.startDate(),
                request.endDate()
        );

        Room savedRoom = roomRepository.save(room);

        return savedRoom.getId();
    }

    public RoomResponse getRoom(Long roomId) {
    Room room = roomRepository.findById(roomId)
            .orElseThrow(() -> new IllegalArgumentException("일정방을 찾을 수 없습니다."));

    return RoomResponse.from(room);
    }

    public RoomResponse getRoomByInviteCode(String inviteCode) {
        Room room = roomRepository.findByInviteCode(inviteCode)
                .orElseThrow(() -> new IllegalArgumentException("일정방을 찾을 수 없습니다."));

        return RoomResponse.from(room);
    }
}
