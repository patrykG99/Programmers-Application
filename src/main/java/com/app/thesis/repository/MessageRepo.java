package com.app.thesis.repository;

import com.app.thesis.model.Message;
import com.app.thesis.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepo extends JpaRepository<Message, Long> {
    List<Message> findAllByProjectFrom(Project project);

    void deleteByProjectFrom(Project project);
}
