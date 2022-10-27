package com.app.thesis;

import com.app.thesis.model.Role;
import com.app.thesis.model.User;
import com.app.thesis.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.ArrayList;

@SpringBootApplication
public class ProgrammerAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProgrammerAppApplication.class, args);
	}
//	@Bean
//	CommandLineRunner run(UserService userService) {
//		return args -> {
//			//final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
//			userService.saveRole(new Role(null, "ROLE_USER"));
//			userService.saveRole(new Role(null, "ROLE_ADMIN"));
//
//			userService.saveUser(new User(null, "Patryk","1234", new ArrayList<>()));
//			userService.saveUser(new User(null, "Admin", "1234", new ArrayList<>()));
//			//userService.setUser(new User(null,"Admin","1234", new ArrayList<>()));
//			userService.addRoleToUser("Patryk", "ROLE_USER");
//			userService.addRoleToUser("Admin", "ROLE_ADMIN");
//			//userService.addRoleToUser("Admin", "ROLE_ADMIN");
////			projectService.saveProject(new Project(null, "ProjectTest", 5, userService.getUser(1L), new ArrayList<>()));
////			projectService.addUserToProject(1L, "Admin");
//
//		};
//	}

}
