package com.app.thesis.repository;

import com.app.thesis.model.ERole;
import com.app.thesis.model.Role;
import com.app.thesis.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepo extends JpaRepository<Role, Long> {
    Optional<Role> findByName(ERole name);
}
