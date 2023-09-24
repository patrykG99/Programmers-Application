package com.app.thesis.service;

import com.app.thesis.model.Project;
import com.app.thesis.model.Rating;
import com.app.thesis.model.RatingRequest;
import com.app.thesis.model.User;
import com.app.thesis.repository.ProjectRepo;
import com.app.thesis.repository.RatingRepo;
import com.app.thesis.repository.UserRepo;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.security.Principal;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Service
@AllArgsConstructor
@Transactional
public class RatingServiceImpl implements RatingService{

    private UserRepo userRepo;
    private RatingRepo ratingRepo;
    private ProjectRepo projectRepo;


    @Override
    public Rating saveRating(RatingRequest rating, Principal principal) throws Exception {

        User loggedUser = userRepo.findByUsername(principal.getName()).orElseThrow(()-> new Exception("User not found"));
        System.out.println(rating.getComment());
        Rating rating2 = ratingRepo.findAllByRatedUserAndProjectAndUserRating(userRepo.findByUsername(rating.getUsername()).get(),projectRepo.findById(rating.getProjectId()).get(),loggedUser);
        if(rating2 != null){
            rating2.setRating(rating.getScore());
        }
        else{
            rating2 = new Rating(userRepo.findByUsername(rating.getUsername()).get(),loggedUser,projectRepo.getReferenceById(rating.getProjectId()), rating.getComment(), rating.getScore());

        }


        return ratingRepo.save(rating2);

    }

    @Override
    public Set<Rating> getUserRating(Long userId) throws Exception {
        User user = userRepo.findById(userId).orElseThrow(() -> new Exception("User not found"));
        return ratingRepo.findAllByRatedUser(user);
    }

    @Override
    public Set<Rating> getProjectRatings(Long projectId) throws Exception {
        Project project = projectRepo.findById(projectId).orElseThrow(() -> new Exception("Project not found"));
        return project.getUserRatings();
    }

    @Override
    public Float getuserAverageRating(Long userId) throws Exception {
        Float rating = ratingRepo.getUserAverageRating(userId);
        return Objects.requireNonNullElse(rating, 0f);

    }


}
