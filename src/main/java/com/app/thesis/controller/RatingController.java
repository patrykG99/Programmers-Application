package com.app.thesis.controller;


import com.app.thesis.model.Rating;
import com.app.thesis.model.RatingRequest;
import com.app.thesis.service.InviteService;
import com.app.thesis.service.ProjectService;
import com.app.thesis.service.RatingService;
import com.app.thesis.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Set;

@CrossOrigin(origins = "*", maxAge = 3600)

@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class RatingController {

    private RatingService ratingService;

    @PutMapping("/rating/save")
    ResponseEntity<Rating> rateUser(@RequestBody RatingRequest rating, Principal principal) throws Exception {
        return ResponseEntity.ok().body(ratingService.saveRating(rating, principal));

    }

    @GetMapping("/rating/{id}")
    ResponseEntity<Set<Rating>> getUserRatings(@PathVariable("id") Long userId) throws Exception {
        return ResponseEntity.ok().body(ratingService.getUserRating(userId));
    }

    @GetMapping("/rating/project/{id}")
    ResponseEntity<Set<Rating>> getProjectRatings(@PathVariable("id") Long projectId) throws Exception {
        return ResponseEntity.ok().body(ratingService.getProjectRatings(projectId));
    }

    @GetMapping("/rating/avg/{id}")
    ResponseEntity<Float> getuserAverageRating(@PathVariable("id") Long userId) throws Exception {
        return  ResponseEntity.ok().body(ratingService.getuserAverageRating(userId));
    }

}
