package com.app.thesis.service;

import com.app.thesis.model.Project;
import com.app.thesis.model.User;
import com.app.thesis.repository.ProjectRepo;
import com.app.thesis.repository.UserRepo;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@AllArgsConstructor
@Transactional
public class ProjectServiceImpl implements ProjectService{

    private final ProjectRepo projectRepo;
    private final UserRepo userRepo;
    @Override
    public List<Project> getProjects() {
        return projectRepo.findAll();
    }

    @Override
    public Project saveProject(Project project) {
        return projectRepo.save(project);
    }

    @Override
    public Project getProjectByOwner(String username) {
        return projectRepo.findByOwner(userRepo.findByUsername(username).get());
    }

    @Override
    public Project getProject(Long id) {
        return projectRepo.findById(id).get();
    }

    @Override
    public List<User> getUsersFromProject(Long id) {
        Project p = projectRepo.findById(id).get();
        return p.getMembers();
    }


    @Override
    public void addUserToProject(User user, Project project) {
        List<User> newUserArray = project.getMembers();
        newUserArray.add(user);
        project.setMembers(newUserArray);
    }
//
//    @Override
//    public void removeUserFromProject(String username, Long projectId) {
//        Project project = projectRepo.findById(projectId).get();
//        //User user = userRepo.findByUsername(username);
//        List<User> newUserArray = project.getMembers();
//        newUserArray.remove(user);
//        project.setMembers(newUserArray);
//    }
}