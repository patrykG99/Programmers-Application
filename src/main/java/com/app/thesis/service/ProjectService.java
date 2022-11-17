package com.app.thesis.service;

import com.app.thesis.model.Project;
import com.app.thesis.model.User;

import java.util.List;

public interface ProjectService {

    List<Project> getProjects();
    Project saveProject(Project project);
    Project getProjectByOwner(String username);
    Project getProject(Long id);

    List<User> getUsersFromProject(Long id);
    void addUserToProject(User user, Project project);
//    void removeUserFromProject(String username, Long projectId);


}
