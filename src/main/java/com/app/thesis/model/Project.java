package com.app.thesis.model;


import com.app.thesis.service.ProjectService;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "projects")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "project_id")
    private Long id;
    private String name;

    @ManyToOne(targetEntity = User.class)
    private User owner;


    @OneToMany(mappedBy = "project")
    private Set<Rating> userRatings;

    @ManyToMany(fetch = FetchType.LAZY,
            cascade = {
                    CascadeType.PERSIST,
                    CascadeType.MERGE
            })
    @JoinTable(name = "project_members",
            joinColumns = { @JoinColumn(name = "project_id") },
            inverseJoinColumns = { @JoinColumn(name = "user_id") })
    private Set<User> members = new HashSet<>();

    private int maxUsers;

    private boolean finished = false;

    @OneToMany(cascade = CascadeType.ALL)
    private List<Message> message;

    private String description ;
    private String tech;

    @Column(columnDefinition = "TEXT")
    private String additionalInfo;

    public Project(String name, String description, int maxUsers, String tech){

        this.name = name;
        this.description = description;
        this.maxUsers = maxUsers;
        this.tech = tech;
    }
}
