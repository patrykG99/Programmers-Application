package com.app.thesis.repository;

import com.app.thesis.model.Project;
import com.app.thesis.model.Rating;
import com.app.thesis.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Set;

public interface RatingRepo extends JpaRepository<Rating, Long> {

    Set<Rating> findAllByRatedUser(User user);

    Rating findAllByRatedUserAndProjectAndUserRating(User ratedUser,Project project, User userRating);

    @Query("SELECT AVG(e.rating) FROM Rating e WHERE e.ratedUser.id = ?1")
    Float getUserAverageRating(Long userId);

    void deleteByProject(Project project);

}
