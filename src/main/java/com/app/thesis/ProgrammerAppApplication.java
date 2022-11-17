package com.app.thesis;



import com.app.thesis.model.ERole;
import com.app.thesis.model.Project;
import com.app.thesis.model.Role;
import com.app.thesis.model.User;
import com.app.thesis.security.RsaKeyProperties;


import com.app.thesis.service.ProjectService;
import com.app.thesis.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.parameters.P;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.security.Principal;
import java.util.ArrayList;


@EnableConfigurationProperties(RsaKeyProperties.class)
@SpringBootApplication
public class ProgrammerAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProgrammerAppApplication.class, args);
	}
	@Bean
	CommandLineRunner run(UserService userService, ProjectService projectService) {
		return args -> {
//
//			final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
////			userService.saveRole(new Role(null, "ROLE_USER"));
//			userService.saveRole(new Role(ERole.ROLE_USER));
//			userService.saveRole(new Role(ERole.ROLE_ADMIN));
//			userService.saveRole(new Role(ERole.ROLE_MODERATOR));
//			userService.saveUser(new User(null,"Patryk","1234",new ArrayList<>(),new ArrayList<>(),new ArrayList<>() ));
//			userService.saveUser(new User(null,"Admin","1234",new ArrayList<>(),new ArrayList<>(),new ArrayList<>() ));
//			userService.addRoleToUser("Patryk", "ROLE_USER");
//			userService.addRoleToUser("Admin", "ROLE_ADMIN");
//			projectService.saveProject(new Project(null,"ProjectTest", userService.getUser("Patryk"),new ArrayList<>()));
//
		};
	}

}
