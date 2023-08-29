package com.app.thesis.model;

public class RatingRequest {

    private String username;
    private String comment;
    private float score;
    private Long projectId;

    public RatingRequest(String username, String comment, float score, Long projectId) {
        this.username = username;
        this.comment = comment;
        this.score = score;
        this.projectId = projectId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public float getScore() {
        return score;
    }

    public void setScore(float score) {
        this.score = score;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }
}
