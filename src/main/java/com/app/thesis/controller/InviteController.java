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

    @GetMapping("/invites")
    public ResponseEntity<List<Invite>> getInvites(){
        return ResponseEntity.ok().body(inviteService.getInvites());
    }

    @GetMapping("/invites/{id}")
    public ResponseEntity<List<Invite>> getRequests(@PathVariable("id") Long id){
        return ResponseEntity.ok().body(inviteService.getInvitesByProjectAndType(id, "Request"));
    }

    @PostMapping("/invites/save/{id}")
    public ResponseEntity<Invite> saveInvite(@RequestBody Invite invite, Principal p, @PathVariable("id") Long projectId){

        return ResponseEntity.ok(inviteService.saveInvite(invite, p, projectId));

    }
    @GetMapping("/myinvites")
    public ResponseEntity<List<Invite>> getUserInvites(Principal p){

        return ResponseEntity.ok().body(inviteService.getInvitesByUserAndType("Invite",p));

    }

    @GetMapping("/projectinvites/{id}")
    public ResponseEntity<List<Invite>> getProjectInvites(@PathVariable("id") Long id){

        return ResponseEntity.ok().body(inviteService.getInvitesByProject(id));

    }

    @DeleteMapping("/invites/accept/{id}")
    public ResponseEntity<Invite> acceptInvite(@PathVariable("id") Long inviteId, Principal p){


        inviteService.acceptInvite(inviteId,p);
        return ResponseEntity.ok().build();

    }
    @DeleteMapping("/invites/refuse/{id}")
    public ResponseEntity<Invite> refuseInvite(@PathVariable("id") Long inviteId, Principal p){
        inviteService.deleteInvite(inviteId);
        return ResponseEntity.ok().build();
    }



}