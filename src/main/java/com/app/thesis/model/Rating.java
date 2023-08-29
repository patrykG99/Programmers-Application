package com.app.thesis.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.*;

import javax.persistence.*;


@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Rating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rating_id")
    private Long id;

    @OneToOne
    @JoinColumn(name = "rated_user_id", nullable = false)
    private User ratedUser;


    @OneToOne
    @JoinColumn(name = "rating_user_id", nullable = false)
    private User userRating;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "project_id")
    private Project project;

    private String comment;
    private float rating;

    public Rating(User ratedUser, User userRating, Project project, String comment, float rating) {
        this.ratedUser = ratedUser;
        this.userRating = userRating;
        this.project = project;
        this.comment = comment;
        this.rating = rating;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getRatedUser() {
        return ratedUser;
    }

    public void setRatedUser(User ratedUser) {
        this.ratedUser = ratedUser;
    }

    public User getUserRating() {
        return userRating;
    }

    public void setUserRating(User userRating) {
        this.userRating = userRating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public float getRating() {
        return rating;
    }

    public void setRating(float rating) {
        this.rating = rating;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }
}
