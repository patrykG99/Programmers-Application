package com.app.thesis.service;

import com.app.thesis.model.Role;
import com.app.thesis.model.User;
import com.app.thesis.model.UserDescriptionOnly;
import com.app.thesis.repository.RoleRepo;
import com.app.thesis.repository.UserRepo;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService{
    private final UserRepo userRepository;
    private final RoleRepo roleRepository;

    private final PasswordEncoder passwordEncoder;

    @Override
    public User saveUser(User user){
        //user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Override
    public Role saveRole(Role role) {
        return roleRepository.save(role);
    }


    @Override
    public User getUser(String username) {
        return userRepository.findByUsername(username).get();
    }
    @Override
    public User getUser(Long id) {
        return userRepository.findById(id).get();
    }


    @Override
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    @Override
    public List<User> getRecommendedUsers(String tech) {




        return userRepository.findRecommended(tech);
    }



//    @Override
//    public void addRoleToUser(String username, String roleName) {
//        User user = userRepository.findByUsername(username);
//        Role role = roleRepository.findByName(roleName);
//        user.getRoles().add(role);
//
//    }

//    @Override
//    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//        User user = userRepository.findByUsername(username);
//        if(user == null){
//            throw new UsernameNotFoundException("not found");
//        }else{
//
//        }
//
//        Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
//        user.getRoles().forEach(role -> authorities.add(new SimpleGrantedAuthority(role.getName())));
//        return new org.springframework.security.core.userdetails.User(user.getUsername(),user.getPassword(),authorities);
//    }



}
