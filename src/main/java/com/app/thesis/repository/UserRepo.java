package com.app.thesis.repository;

import com.app.thesis.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepo extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);

    User getUserByProjectsOwnedId(Long id);

    List<User> findAllByProjectsInId(Long id);
}
