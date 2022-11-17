package com.app.thesis.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(targetEntity = Project.class)
    private Project project;
    @ManyToOne(targetEntity = User.class)
    private User user;

    @ManyToOne(targetEntity = User.class)
    private User ratingUser;

    private float score;

    public Rating(Project project, User user,User ratingUser, float score){


        this.score = score;

    }
}
