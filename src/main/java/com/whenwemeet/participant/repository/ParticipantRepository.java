package com.whenwemeet.participant.repository;

import com.whenwemeet.participant.entity.Participant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParticipantRepository extends JpaRepository<Participant, Long> {

    long countByRoomId(Long roomId);
}