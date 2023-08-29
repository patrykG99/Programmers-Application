package com.app.thesis.repository;

import com.app.thesis.model.Project;
import com.app.thesis.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProjectRepo extends JpaRepository<Project, Long> {
    Project findByOwner(User user);
    List<Project> findAllByOwner(User user);
    List<Project> findAllByMembersId(Long id);

    @Query("SELECT p FROM Project p WHERE p.owner = :owner AND :excludedMember NOT MEMBER OF p.members")
    List<Project> findAllByOwnerAndNotMember(@Param("owner") User owner, @Param("excludedMember") User excludedMember);
}
