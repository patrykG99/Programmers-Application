package com.app.thesis.repository;

import com.app.thesis.model.Project;
import com.app.thesis.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepo extends JpaRepository<Project, Long> {
    Project findByOwner(User user);
    List<Project> findAllByOwner(User user);
}
