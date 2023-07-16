package com.app.thesis.controller;


import com.app.thesis.model.Rating;
import com.app.thesis.service.ProjectService;
import com.app.thesis.service.RatingService;
import com.app.thesis.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)

@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @GetMapping("/ratings/projectReviews/{id}")
    public ResponseEntity<List<Rating>> getRatingsFromProjects(@PathVariable("id") Long id){
        return ResponseEntity.ok().body(ratingService.getProjectRatings(id));
    }

    @GetMapping("/ratings/user/{id}")
    public ResponseEntity<List<Rating>> getRatingsByUser(@PathVariable("id") Long id){
        return ResponseEntity.ok().body(ratingService.getRatingsByUser(id));
    }

    @GetMapping("/ratings/user/projects/{id}")
    public ResponseEntity<List<Rating>> getRatingsByRatingUserAndProject(@PathVariable("id") Long projectId, Principal p){
        return ResponseEntity.ok().body(ratingService.getRatingsByUserAndProjects(p, projectId));
    }
}
