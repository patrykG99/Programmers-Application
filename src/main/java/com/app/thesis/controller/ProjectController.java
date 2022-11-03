package com.app.thesis.controller;

import com.app.thesis.model.Project;
import com.app.thesis.model.User;
import com.app.thesis.service.ProjectService;
import com.app.thesis.service.UserService;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;


import java.net.URI;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
@AllArgsConstructor

public class ProjectController {

    private final UserService userService;
    private final ProjectService projectService;

    @GetMapping("/projects")
    public ResponseEntity<List<Project>> getProjects(){

        return ResponseEntity.ok().body(projectService.getProjects());
    }

    @GetMapping("/projects/{username}")
    public ResponseEntity<Project> getProjectByOwner(@PathVariable("username") String username){

        return ResponseEntity.ok().body(projectService.getProjectByOwner(username));
    }
//
//    @PostMapping("/projects/addUser")
//    public ResponseEntity<Project> addUserToProject(@RequestBody UserToProjectForm form){
//        projectService.addUserToProject(form.getUsername(), form.getProjectId());
//        return ResponseEntity.ok().build();
//    }
//
//    @PostMapping("/projects/removeUser")
//    public ResponseEntity<Project> removeUseFromProject(@RequestBody UserToProjectForm form){
//        projectService.removeUserFromProject(form.getUsername(), form.getProjectId());
//        return ResponseEntity.ok().build();
//    }
//
//    @PostMapping("/projects/save")
//    public ResponseEntity<Project> saveProject(@RequestBody Project project, Principal p){
//        List<User> membersList = project.getMembers();
//        project.setOwner(userService.getUser(p.getName()));
//        membersList.add(userService.getUser(p.getName()));
//        project.setMembers(membersList);
//
//        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/projects/save").toUriString());
//        return ResponseEntity.created(uri).body(projectService.saveProject(project));
//
//
//    }

}
@Data
class UserToProjectForm{
    private String username;
    private Long projectId;
}
