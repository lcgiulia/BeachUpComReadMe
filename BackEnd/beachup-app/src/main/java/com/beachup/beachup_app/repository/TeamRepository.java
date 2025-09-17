package com.beachup.beachup_app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.beachup.beachup_app.entity.Team;

import java.util.UUID;

public interface TeamRepository extends JpaRepository<Team, UUID> {
}