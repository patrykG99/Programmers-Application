package com.app.thesis.service;

import com.app.thesis.model.Project;
import com.app.thesis.model.User;
import org.springframework.security.core.parameters.P;

import java.security.Principal;
import java.util.List;

public interface ProjectService {

    List<Project> getProjects();
    Project saveProject(Project project);
    List<Project> getProjectsByLoggedOwner(Principal principal, Long userId) throws Exception;
    Project getProject(Long id);

    List<User> getUsersFromProject(Long id);
    Project addUserToProject(User user, Long projectId);

    List<Project> getProjectsByUser(Long id);

    Project updateDesc(Long projectId, String newDesc) throws Exception;


}
