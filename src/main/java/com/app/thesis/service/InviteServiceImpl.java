package com.app.thesis.service;

import com.app.thesis.model.Invite;
import com.app.thesis.model.Project;
import com.app.thesis.model.User;
import com.app.thesis.repository.InviteRepo;
import com.app.thesis.repository.ProjectRepo;
import com.app.thesis.repository.UserRepo;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.transaction.Transactional;
import java.net.URI;
import java.security.Principal;
import java.util.List;

@Service
@AllArgsConstructor
@Transactional
public class InviteServiceImpl implements InviteService{

    private InviteRepo inviteRepo;
    private UserService userService;
    private ProjectService projectService;
    private UserRepo userRepo;
    private ProjectRepo projectRepo;

    @Override
    public Invite saveInvite(Invite invite, Principal p, Long projectId) {
        User user = userService.getUser(p.getName());
        Project project = projectService.getProject(projectId);

        User invitedUser = userService.getUser(invite.getInvitedUsername());
        if(project.getOwner().equals(user) && !project.getMembers().contains(invitedUser) && invite.getType().equals("Invite")){
            System.out.println("dziala");
            invite.setProjectId(projectId);
            invite.setUser(userService.getUser(invite.getInvitedUsername()));
            invite.setProjectName(project.getName());
            URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/invites/save/{id}").toUriString());
            return (inviteRepo.save(invite));
        }
        else if(!project.getMembers().contains(invitedUser) && invite.getType().equals("Request")){
            invite.setProjectId(projectId);
            invite.setUser(userService.getUser(invite.getInvitedUsername()));
            invite.setProjectName(project.getName());
            URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/invites/save/{id}").toUriString());
            return (inviteRepo.save(invite));
        }
        //return ResponseEntity.badRequest().body(invite);
        return null;
    }

    @Override
    public List<Invite> getInvites(){
        return inviteRepo.findAll();
    }

    @Override
    public List<Invite> getInvitesByUser(User user) {
        return inviteRepo.findByUser(user);
    }

    @Override
    public List<Invite> getInvitesByUserAndType(String type, Principal p) {
        Long id = userService.getUser(p.getName()).getId();
        return inviteRepo.findByUserIdAndType(id,type);
    }

    @Override
    public Invite getInvite(Long id) {
        return inviteRepo.findById(id).get();
    }

    @Override
    public List<Invite> getInvitesByProjectAndType(Long id, String type) {
        return inviteRepo.findByProjectIdAndType(id, type);
    }

    @Override
    public void deleteInvite(Long id) {
        inviteRepo.deleteById(id);
    }

    @Override
    public List<Invite> getInvitesByProject(Long id) {
        return inviteRepo.findByProjectId(id);
    }

    @Override
    public void acceptInvite(Long id, Principal p) {

        Invite invite = inviteRepo.getReferenceById(id);
        User loggedUser = userRepo.findByUsername(p.getName()).get();

        if(invite.getType().equals("Invite") && invite.getInvitedUsername().equals(p.getName())){
            projectService.addUserToProject(loggedUser, invite.getProjectId());
        }

    }
}
