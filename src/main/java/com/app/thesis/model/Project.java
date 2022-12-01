package com.app.thesis.model;


import com.app.thesis.service.ProjectService;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @ManyToOne(targetEntity = User.class)
    private User owner;

    @ManyToMany(fetch = FetchType.LAZY,
            cascade = {
                    CascadeType.PERSIST,
                    CascadeType.MERGE
            })
    @JoinTable(name = "project_members",
            joinColumns = { @JoinColumn(name = "project_id") },
            inverseJoinColumns = { @JoinColumn(name = "user_id") })
    private List<User> members = new ArrayList<>();

    private int maxUsers;

    private boolean finished = false;

    @OneToMany
    private List<Message> message;

    private String description ;
    private String tech;

    public Project(String name, String description, int maxUsers, String tech){

        this.name = name;
        this.description = description;
        this.maxUsers = maxUsers;
        this.tech = tech;
    }
}
