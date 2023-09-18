package com.app.thesis.controller;

import com.app.thesis.model.Project;
import com.app.thesis.model.Rating;
import com.app.thesis.model.User;
import com.app.thesis.repository.InviteRepo;
import com.app.thesis.repository.MessageRepo;
import com.app.thesis.repository.ProjectRepo;
import com.app.thesis.repository.RatingRepo;
import com.app.thesis.service.ProjectService;
import com.app.thesis.service.RatingService;
import com.app.thesis.service.UserService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;


import java.net.URI;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@CrossOrigin(origins = "*", maxAge = 3600)

@RestController
@RequestMapping("/api")
@AllArgsConstructor

public class ProjectController {

    private final UserService userService;
    private final ProjectService projectService;
    private final RatingService ratingService;
    private final ProjectRepo projectRepo;
    private final RatingRepo ratingRepo;
    private final InviteRepo inviteRepo;
    private final MessageRepo messageRepo;


    @GetMapping("/projects")
    public ResponseEntity<List<Project>> getProjects(){

        return ResponseEntity.ok().body(projectService.getProjects());
    }

    @GetMapping("/project/{id}")
    public ResponseEntity<Project> getProject(@PathVariable("id") Long id){

        return ResponseEntity.ok().body(projectService.getProject(id));
    }

    @GetMapping("/myprojects/{id}")
    public ResponseEntity<List<Project>> getProjectsByLoggedOwner(Principal principal,@PathVariable("id") Long userId) throws Exception {
    return ResponseEntity.ok().body(projectService.getProjectsByLoggedOwner(principal, userId));

    }
    @GetMapping("/projects/user/projects/{id}")
    public ResponseEntity<List<Project>> getProjectsByUser(@PathVariable("id") Long id){
        return ResponseEntity.ok().body(projectService.getProjectsByUser(id));
    }

    @GetMapping("/project/users/{id}")
    public ResponseEntity<List<User>> getProjectMembers(@PathVariable("id") Long id){
        return ResponseEntity.ok().body(projectService.getUsersFromProject(id));
    }

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
    @PostMapping("/projects/save")
    public ResponseEntity<Project> saveProject(@RequestBody Project project, Principal p){
        Set<User> membersList = project.getMembers();
        project.setOwner(userService.getUser(p.getName()));
        membersList.add(userService.getUser(p.getName()));
        project.setMembers(membersList);

        User user = userService.getUser(p.getName());
        Set<Project> userProjects = user.getProjectsIn();
        userProjects.add(project);


        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/projects/save").toUriString());
        return ResponseEntity.created(uri).body(projectService.saveProject(project));
    }
    @PutMapping("/project/end/{id}")
    public ResponseEntity<Project> endProject(@PathVariable("id") Long id){
        Project project = projectService.getProject(id);
        project.setFinished(true);
        project.getMembers().iterator().forEachRemaining(user -> user.setFinishedProjects(user.getFinishedProjects() + 1));
        System.out.println(project);
        projectRepo.save(project);
        return ResponseEntity.ok().build();

    }

    @PutMapping("/project/rateuser/{id}/{username}")
    public ResponseEntity<Rating> rateUser(@RequestBody Rating rating,@PathVariable("id") Long projectId, @PathVariable("username") String username, Principal p){

        return null;



    }
    @GetMapping("/projectsPage")
    public Page<Project> getItems(Pageable pageable) {
        // Create a new Pageable instance with the desired page size, page number, and sort order
        Pageable paging = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), pageable.getSort());
        // Use the JpaRepository's findAll() method to retrieve the data, passing in the Pageable instance
        Page<Project> items = projectRepo.findAll(paging);
        // Return the Page object, which will include the paginated data and metadata
        return items;
    }

    @PatchMapping("/project/info/{id}")
    public ResponseEntity<Project> updateInfo(@RequestBody Project projectDet, @PathVariable("id")Long id, Principal p ){
        Project project = projectService.getProject(id);
        project.setAdditionalInfo(projectDet.getAdditionalInfo());


        return ResponseEntity.ok(projectService.saveProject(project));
    }
    @PatchMapping("/project/desc/{id}")
    public ResponseEntity<Project> updateDesc(@PathVariable("id")Long projectId,@RequestBody UpdateDescriptionRequest request) throws Exception {
        return ResponseEntity.ok(projectService.updateDesc(projectId,request.getDescription()));
    }

    @Transactional
    @DeleteMapping("/project/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id, Principal p) {
        if(projectRepo.findById(id).get().getOwner().equals(userService.getUser(p.getName()))){
            messageRepo.deleteByProjectFrom(projectService.getProject(id));
            //ratingRepo.deleteByProject(projectService.getProject(id));
            inviteRepo.deleteAllByProjectId(id);
            projectRepo.deleteById(id);
            }
        return ResponseEntity.noContent().build();

    }
    @DeleteMapping("/project/mod/{id}")
    public ResponseEntity<Void> deleteProjectMod(@PathVariable Long id) throws Exception {
        projectService.deleteProjectMod(id);
        return ResponseEntity.noContent().build();
    }


}
@Data
class UserToProjectForm{
    private String username;
    private Long projectId;
}
@Data
class UpdateDescriptionRequest {
    private String description;


}


