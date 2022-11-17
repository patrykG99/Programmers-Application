package com.app.thesis.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data

public class Invite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private Long projectId;

    @ManyToOne(targetEntity = User.class)
    private User user;

    private String projectName;
    private String invitedUsername;

    public Invite(String invitedUsername){
        this.invitedUsername = invitedUsername;
    }


}
