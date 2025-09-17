package com.beachup.beachup_app.service;

import com.beachup.beachup_app.entity.Team;
import com.beachup.beachup_app.repository.TeamRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class TeamService {

    private final TeamRepository teamRepository;

    public TeamService(TeamRepository teamRepository) {
        this.teamRepository = teamRepository;
    }

    public List<Team> findAll() {
        return teamRepository.findAll();
    }

    public Team findById(UUID id) {
        return teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Time não encontrado"));
    }

    public Team save(Team team) {
        return teamRepository.save(team);
    }

    public Team update(UUID id, Team teamData) {
        Team team = findById(id);
        team.setName(teamData.getName());
        team.setDescription(teamData.getDescription());
        team.setLevel(teamData.getLevel());
        return teamRepository.save(team);
    }

    public void delete(UUID id) {
        teamRepository.deleteById(id);
    }
}