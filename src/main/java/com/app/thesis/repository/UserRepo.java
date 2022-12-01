package com.app.thesis.repository;

import com.app.thesis.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepo extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);

    User getUserByProjectsOwnedId(Long id);

    List<User> findAllByProjectsInId(Long id);

    //@Query("SELECT u, COUNT() FROM User u inner join u.projectsIn p WHERE p.tech = ?1")
    @Query("SELECT u FROM User u inner join u.projectsIn p WHERE p.tech = ?1 GROUP BY u.id ORDER BY COUNT(u.id) DESC")
    List<User> findRecommended(String tech);
}
