package com.app.thesis.service;

import com.app.thesis.model.Invite;
import com.app.thesis.model.Project;
import com.app.thesis.model.User;

import java.security.Principal;
import java.util.List;

public interface InviteService {
    Invite saveInvite(Invite invite, Principal p, Long id);

    List<Invite> getInvites();
    List<Invite> getInvitesByUser(User user);
    List<Invite> getInvitesByUserAndType(String type, Principal p);


    Invite getInvite(Long id);

    List<Invite> getInvitesByProjectAndType(Long id, String type);

    void deleteInvite(Long id);

    List<Invite> getInvitesByProject(Long id);
    void acceptInvite(Long id, Principal p);
}
