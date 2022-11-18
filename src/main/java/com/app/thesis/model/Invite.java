package com.app.thesis.model;

import lombok.*;

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

    private String type;

    public Invite(String invitedUsername, String type){
        this.invitedUsername = invitedUsername;
        this.type = type;
    }


}
