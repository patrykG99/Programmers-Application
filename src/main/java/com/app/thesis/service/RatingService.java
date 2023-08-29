package com.app.thesis.service;

import com.app.thesis.model.Project;
import com.app.thesis.model.Rating;
import com.app.thesis.model.RatingRequest;
import com.app.thesis.model.User;

import java.security.Principal;
import java.util.List;
import java.util.Set;

public interface RatingService {

    Rating saveRating(RatingRequest rating, Principal principal) throws Exception;
    Set<Rating> getUserRating(Long userId) throws Exception;

    Set<Rating> getProjectRatings(Long projectId) throws Exception;

    Float getuserAverageRating(Long userId) throws Exception;

}
