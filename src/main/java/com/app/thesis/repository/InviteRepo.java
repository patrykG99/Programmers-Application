package com.app.thesis.repository;

import com.app.thesis.model.Invite;
import com.app.thesis.model.Project;
import com.app.thesis.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InviteRepo extends JpaRepository<Invite, Long> {

    List<Invite> findByUser(User user);

    List<Invite> findByProjectIdAndType(Long id, String type);
}
