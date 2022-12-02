package com.app.thesis.controller;


import com.app.thesis.model.Role;
import com.app.thesis.model.User;
import com.app.thesis.model.UserDescriptionOnly;
import com.app.thesis.repository.UserRepo;
import com.app.thesis.service.UserService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.security.Principal;
import java.util.List;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {
    @Autowired
    private final UserService userService;
    @Autowired
    private final UserRepo userRepo;



    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsers(){
        return ResponseEntity.ok().body(userService.getUsers());
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUser(@PathVariable("id") Long id){
        return ResponseEntity.ok().body(userService.getUser(id));
    }

    @PostMapping("/user/save")
    public ResponseEntity<User> saveUser(@RequestBody User user){
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/user/save").toUriString());
        return ResponseEntity.created(uri).body(userService.saveUser(user));
    }

    @PostMapping("/role/save")
    public ResponseEntity<Role> saveRole(@RequestBody Role role){
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/role/save").toUriString());
        return ResponseEntity.created(uri).body(userService.saveRole(role));
    }

    @GetMapping("/users/recommended/{tech}")
    public ResponseEntity<List<User>> recommendedUsers(@PathVariable String tech){


        System.out.println((userService.getRecommendedUsers(tech)));
        return ResponseEntity.ok().body(userService.getRecommendedUsers(tech));

    }

    @PatchMapping("/users/description/{id}")
    public ResponseEntity<User> updateDescription(@RequestBody User userDet, @PathVariable("id")Long id, Principal p ){
        User user = userService.getUser(id);
        user.setDescription(userDet.getDescription());
        user.setPassword(user.getPassword());
        System.out.println(user.getPassword());
        return ResponseEntity.ok(userService.saveUser(user));
    }


//    @PostMapping("/role/addtouser")
//    public ResponseEntity<?> addRoleToUser(@RequestBody RoleToUserForm form){
//        userService.addRoleToUser(form.getUsername(), form.getRoleName());
//        return ResponseEntity.ok().build();
//    }
}
@Data
class RoleToUserForm{
    private String username;
    private String roleName;
}


