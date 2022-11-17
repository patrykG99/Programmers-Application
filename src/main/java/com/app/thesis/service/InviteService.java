package com.app.thesis.service;

import com.app.thesis.model.Invite;
import com.app.thesis.model.User;

import java.util.List;

public interface InviteService {
    Invite saveInvite(Invite invite);

    List<Invite> getInvites();
    List<Invite> getInvitesByUser(User user);
    Invite getInvite(Long id);

    void deleteInvite(Long id);
}
