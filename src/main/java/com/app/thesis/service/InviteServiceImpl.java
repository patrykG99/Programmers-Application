package com.app.thesis.service;

import com.app.thesis.model.Invite;
import com.app.thesis.model.Project;
import com.app.thesis.model.User;
import com.app.thesis.repository.InviteRepo;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@AllArgsConstructor
@Transactional
public class InviteServiceImpl implements InviteService{

    private InviteRepo inviteRepo;

    @Override
    public Invite saveInvite(Invite invite) {
        return inviteRepo.save(invite);
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
    public List<Invite> getInvitesByUserAndType(Long id, String type) {
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

}
