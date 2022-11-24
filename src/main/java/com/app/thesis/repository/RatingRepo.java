package com.app.thesis.repository;

import com.app.thesis.model.Project;
import com.app.thesis.model.Rating;
import com.app.thesis.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RatingRepo extends JpaRepository<Rating, Long> {
    Rating findByProjectAndUserAndRatingUser(Project project, User user, User ratingUser);
    List<Rating> findByProject(Project project);
}
