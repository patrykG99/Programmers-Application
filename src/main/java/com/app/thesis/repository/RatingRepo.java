package com.app.thesis.repository;

import com.app.thesis.model.Project;
import com.app.thesis.model.Rating;
import com.app.thesis.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RatingRepo extends JpaRepository<Rating, Long> {
    Rating findByProjectAndUserAndRatingUser(Project project, User user, User ratingUser);
    List<Rating> findByProject(Project project);
    List<Rating> findByUser(User user);

    List<Rating> findByRatingUserAndProject(User user, Project project);

    void deleteByProject(Project project);

    @Query("SELECT AVG(e.score) FROM Rating e WHERE e.user.id = ?1")
   // @Query("SELECT u FROM User u inner join u.projectsIn p WHERE p.tech = ?1 GROUP BY u.id ORDER BY COUNT(u.id) DESC")
    float getUserAverageRating(Long id);
}
