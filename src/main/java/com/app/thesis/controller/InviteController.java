package com.app.thesis.controller;


import com.app.thesis.model.Invite;
import com.app.thesis.model.Project;
import com.app.thesis.model.User;
import com.app.thesis.service.InviteService;
import com.app.thesis.service.ProjectService;
import com.app.thesis.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.security.Principal;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)

@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class InviteController {

    private InviteService inviteService;
    private UserService userService;
    private ProjectService projectService;

    @GetMapping("/invites")
    public ResponseEntity<List<Invite>> getInvites(){
        return ResponseEntity.ok().body(inviteService.getInvites());
    }

    @PostMapping("/invites/save/{id}")
    public ResponseEntity<Invite> saveInvite(@RequestBody Invite invite, Principal p, @PathVariable("id") Long projectId){
        User user = userService.getUser(p.getName());
        Project project = projectService.getProject(projectId);
        invite.setProjectId(projectId);
        User invitedUser = userService.getUser(invite.getInvitedUsername());
        invite.setUser(userService.getUser(invite.getInvitedUsername()));
        invite.setProjectName(project.getName());
        System.out.println(invite);
        if(project.getMembers().contains(user) && !project.getMembers().contains(invitedUser)){
            System.out.println("dziala");
            URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/invites/save/{id}").toUriString());
            return ResponseEntity.created(uri).body(inviteService.saveInvite(invite));
        }
        return ResponseEntity.badRequest().body(invite);

    }
    @GetMapping("/myinvites")
    public ResponseEntity<List<Invite>> getUserInvites(Principal p){
        User user = userService.getUser(p.getName());
        return ResponseEntity.ok().body(inviteService.getInvitesByUser(user));
    }

    @DeleteMapping("/invites/accept/{id}")
    public ResponseEntity<Invite> acceptInvite(@PathVariable("id") Long inviteId, Principal p){
        Invite invite = inviteService.getInvite(inviteId);
        User user = userService.getUser(invite.getInvitedUsername());
        User userLogged = userService.getUser(p.getName());
        if(user.equals(userLogged)) {

            Project project = projectService.getProject(invite.getProjectId());
            projectService.addUserToProject(userLogged,project);
            inviteService.deleteInvite(inviteId);

            return ResponseEntity.noContent().build();

        }
        return ResponseEntity.noContent().build();


    }

}
