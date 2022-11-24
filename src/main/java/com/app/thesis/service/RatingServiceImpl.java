package com.app.thesis.service;

import com.app.thesis.model.Project;
import com.app.thesis.model.Rating;
import com.app.thesis.model.User;
import com.app.thesis.repository.RatingRepo;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@AllArgsConstructor
@Transactional
public class RatingServiceImpl implements RatingService{

    private final RatingRepo ratingRepo;

    @Override
    public Rating saveRating(Rating rating) {
        return ratingRepo.save(rating);
    }

    @Override
    public List<Rating> getProjectRatings(Project project) {
        return ratingRepo.findByProject(project);
    }

    @Override
    public List<Rating> getRatingsByUser(User user) {
        return ratingRepo.findByUser(user);
    }


}
