package com.app.thesis.service;


import com.app.thesis.model.Role;
import com.app.thesis.model.User;
import com.app.thesis.model.UserDescriptionOnly;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;
import java.util.Map;

public interface UserService {
    User saveUser(User user);
    Role saveRole(Role role);
    //void addRoleToUser(String user, String role);
    User getUser(String username);
    User getUser(Long id);
    List<User> getUsers();
    List<User> getRecommendedUsers(String tech);
    User updateDesc(User userDet, Long id, Principal p);


    String getUserImage(Long userId);

    void uploadAvatar(Long userId, MultipartFile file);
}
