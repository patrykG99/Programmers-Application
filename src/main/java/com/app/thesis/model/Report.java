package com.app.thesis.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;
import org.apache.commons.lang3.builder.ToStringExclude;

import javax.persistence.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



    private String reason;


    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @ToStringExclude
    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;


    public Report(Project project,String reason,User user){
        this.project = project;
        this.reason = reason;
        this.user = user;
    }
}
