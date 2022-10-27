package com.app.thesis.repository;

import com.app.thesis.model.Role;
import com.app.thesis.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepo extends JpaRepository<Role, Long> {
    Role findByName(String name);
}
