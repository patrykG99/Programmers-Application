package com.app.thesis.service;

import com.app.thesis.model.Project;
import com.app.thesis.model.Rating;
import com.app.thesis.model.User;
import com.app.thesis.repository.ProjectRepo;
import com.app.thesis.repository.RatingRepo;
import com.app.thesis.repository.UserRepo;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.security.Principal;
import java.util.List;

@Service
@AllArgsConstructor
@Transactional
public class RatingServiceImpl implements RatingService{

    private final RatingRepo ratingRepo;
    private final ProjectRepo projectRepo;
    private final UserRepo userRepo;

    @Override
    public Rating saveRating(Rating rating) {
        return ratingRepo.save(rating);
    }

    @Override
    public List<Rating> getProjectRatings(Long id) {

        return ratingRepo.findByProject(projectRepo.getReferenceById(id));
    }

    @Override
    public List<Rating> getRatingsByUser(Long id) {

        return ratingRepo.findByUser(userRepo.getReferenceById(id));
    }

    @Override
    public List<Rating> getRatingsByUserAndProjects(Principal p, Long projectId) {
        return ratingRepo.findByRatingUserAndProject((User) p, projectRepo.getReferenceById(projectId));
    }

    @Override
    public Float getAverageRatingByUser(Long id) {
        return ratingRepo.getUserAverageRating(id);
    }


}
