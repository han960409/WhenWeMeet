package com.whenwemeet.availability.repository;

import com.whenwemeet.availability.entity.AvailableDate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AvailableDateRepository extends JpaRepository<AvailableDate, Long> {

    List<AvailableDate> findByParticipantRoomId(Long roomId);
}