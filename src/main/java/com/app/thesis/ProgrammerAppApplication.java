package com.app.thesis;



import com.app.thesis.security.RsaKeyProperties;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;



@EnableConfigurationProperties(RsaKeyProperties.class)
@SpringBootApplication
public class ProgrammerAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProgrammerAppApplication.class, args);
	}
//	@Bean
//	CommandLineRunner run(UserService userService) {
//		return args -> {
//			final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
//			userService.saveRole(new Role(null, "ROLE_USER"));
//			userService.saveRole(new Role(null, "ROLE_ADMIN"));
//
//			userService.saveUser(new User(null,"Patryk","1234",new ArrayList<>()));
//			userService.saveUser(new User(null,"Admin","1234",new ArrayList<>()));
//
//
//
//			userService.addRoleToUser("Patryk", "ROLE_USER");
//			userService.addRoleToUser("Admin", "ROLE_ADMIN");
//
//
//
//
//
//
//
//		};
//	}

}
