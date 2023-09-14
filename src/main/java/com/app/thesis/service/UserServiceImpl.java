package com.app.thesis.service;

import com.app.thesis.model.ERole;
import com.app.thesis.model.Role;
import com.app.thesis.model.User;
import com.app.thesis.model.UserDescriptionOnly;
import com.app.thesis.repository.RoleRepo;
import com.app.thesis.repository.UserRepo;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.*;
import java.util.stream.Collectors;

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
        return userRepository.findAll().stream().
                filter(user -> user.getRoles().stream()
                        .noneMatch(role->role.getName().equals(ERole.ROLE_MODERATOR) || role.getName().equals(ERole.ROLE_ADMIN)))
                .toList();
    }

    @Override
    public List<User> getRecommendedUsers(String tech) {
        return userRepository.findRecommended(tech);
    }

    @Override
    public User updateDesc(User userDet, Long id, Principal p) {
        User user = userRepository.getReferenceById(id);
        user.setDescription(userDet.getDescription());
        user.setPassword(user.getPassword());
        return userRepository.save(user);
    }

    public String getUserImage(Long userId){
        User user = userRepository.getReferenceById(userId);
        return user.getUserProfilePicturePath();
    }

    @Override
    public void uploadAvatar(Long userId, MultipartFile file) {
        try {
            String path = System.getProperty("user.dir") +"/uploads/" + userId;
            File dest = new File(path);

            file.transferTo(dest);
            User user = userRepository.findById(userId).orElseThrow(() -> new UsernameNotFoundException("nie znaleziono użytkownika"));
            user.setUserProfilePicturePath(path);
            userRepository.save(user);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }


    }


    @Override
    public void addRoleToUser(String username, String roleName) throws Exception {
        User user = userRepository.findByUsername(username).orElseThrow(()-> new Exception("User not found"));
        Role role = roleRepository.findByName(ERole.valueOf(roleName.toUpperCase())).orElseThrow(()-> new Exception("role not found"));
        user.getRoles().add(role);

    }

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
