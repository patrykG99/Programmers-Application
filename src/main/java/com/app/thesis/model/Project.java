package com.app.thesis.model;


import com.app.thesis.service.ProjectService;
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

    @ManyToMany(targetEntity = User.class, fetch = FetchType.EAGER)
    private List<User> members = new ArrayList<>();

    public Project(String name){
        this.name = name;
    }
}
