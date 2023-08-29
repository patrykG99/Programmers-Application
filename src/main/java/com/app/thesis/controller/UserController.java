package com.app.thesis.controller;


import com.app.thesis.model.Role;
import com.app.thesis.model.User;
import com.app.thesis.model.UserDescriptionOnly;
import com.app.thesis.repository.UserRepo;
import com.app.thesis.service.UserService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.security.Principal;
import java.util.List;


@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {
    @Autowired
    private final UserService userService;
    private final UserRepo userRepository;


    @GetMapping("/users/{userId}/avatar")
    public ResponseEntity<byte[]> getAvatar(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UsernameNotFoundException("nie znaleziono użytkownika"));
        String path = user.getUserProfilePicturePath();
        File file = new File(path);
        try {
            byte[] fileContent = Files.readAllBytes(file.toPath());
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);
            return new ResponseEntity<>(fileContent, headers, HttpStatus.OK);
        } catch (IOException e) {
            throw new RuntimeException("Błąd podczas odczytywania pliku", e);
        }
    }

    @PostMapping("/user/{id}/avatar")
    public ResponseEntity<?> uploadAvatar(@PathVariable("id") Long userId, @RequestParam("file") MultipartFile file){
        userService.uploadAvatar(userId, file);


        return new ResponseEntity<>(HttpStatus.OK);
    }

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
    @GetMapping("/user/picture/{id}")
    public String getUserProfilePicture(@PathVariable("id") Long userId){
        return userService.getUserImage(userId);
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
        return ResponseEntity.ok(userService.updateDesc(userDet, id, p));
//        User user = userService.getUser(id);
//        user.setDescription(userDet.getDescription());
//        user.setPassword(user.getPassword());
//        System.out.println(user.getPassword());
//        return ResponseEntity.ok(userService.saveUser(user));
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


