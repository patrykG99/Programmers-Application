package com.app.thesis.service;

import com.app.thesis.model.Role;
import com.app.thesis.model.User;

import java.util.List;

public interface UserService {
    User saveUser(User user);
    Role saveRole(Role role);
    //void addRoleToUser(String user, String role);
    User getUser(String username);
    List<User> getUsers();


}
