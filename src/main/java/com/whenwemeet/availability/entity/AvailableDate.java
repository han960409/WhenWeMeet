package com.whenwemeet.availability.entity;

import com.whenwemeet.participant.entity.Participant;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Getter
@NoArgsConstructor
public class AvailableDate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate availableDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "participant_id")
    private Participant participant;

    public AvailableDate(LocalDate availableDate, Participant participant) {
        this.availableDate = availableDate;
        this.participant = participant;
    }
}