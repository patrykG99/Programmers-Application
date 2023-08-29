package com.app.thesis.service;

import com.app.thesis.model.Project;
import com.app.thesis.model.User;
import com.app.thesis.repository.ProjectRepo;
import com.app.thesis.repository.UserRepo;
import com.app.thesis.security.services.UserDetailsImpl;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.security.Principal;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
    public List<Project> getProjectsByLoggedOwner(Principal principal, Long userId) throws Exception {
        UserDetailsImpl userDetails = (UserDetailsImpl) ((Authentication) principal).getPrincipal();
        User userExcluded = userRepo.findById(userId).orElseThrow(()-> new Exception("User not found"));
        return projectRepo.findAllByOwnerAndNotMember(userRepo.findById(userDetails.getId()).orElseThrow(()-> new Exception("User not found")),userExcluded);
    }



    @Override
    public Project getProject(Long id) {
        return projectRepo.findById(id).get();
    }

    @Override
    public List<User> getUsersFromProject(Long id) {
         return userRepo.findAllByProjectsInId(id);

    }


    @Override
    public Project addUserToProject(User user, Long projectId) {
        Project project = projectRepo.getReferenceById(projectId);

        Set<User> newMembers = project.getMembers();
        newMembers.add(user);
        project.setMembers(newMembers);
        return projectRepo.save(project);

    }

    @Override
    public List<Project> getProjectsByUser(Long id) {
        return projectRepo.findAllByMembersId(id);
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