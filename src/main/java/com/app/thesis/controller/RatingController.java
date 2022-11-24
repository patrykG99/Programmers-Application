package com.app.thesis.controller;


import com.app.thesis.model.Rating;
import com.app.thesis.service.ProjectService;
import com.app.thesis.service.RatingService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)

@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class RatingController {

    private final RatingService ratingService;
    private final ProjectService projectService;


    @GetMapping("/ratings/projectReviews/{id}")
    public ResponseEntity<List<Rating>> getRatingsFromProjects(@PathVariable("id") Long id){
        return ResponseEntity.ok().body(ratingService.getProjectRatings(projectService.getProject(id)));
    }
}
