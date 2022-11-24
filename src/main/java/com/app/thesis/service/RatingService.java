package com.app.thesis.service;

import com.app.thesis.model.Project;
import com.app.thesis.model.Rating;
import com.app.thesis.model.User;

import java.util.List;

public interface RatingService {
    Rating saveRating(Rating rating);

    List<Rating> getProjectRatings(Project project);

}
