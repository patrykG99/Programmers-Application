package com.app.thesis.model;

import lombok.*;

import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String senderName;
    private String receiverName;

    @Column(columnDefinition = "TEXT")
    private String message;
    private String date;
    private Status status;

    @ManyToOne
    private Project projectFrom;



}
