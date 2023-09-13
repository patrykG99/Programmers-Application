package com.app.thesis.DTO;

public class ReportRequest {
    private Long projectId;
    private String reason;

    public ReportRequest(Long projectId, String reason) {
        this.projectId = projectId;
        this.reason = reason;
    }

    public Long getProjectId() {
        return projectId;
    }

    public String getReason() {
        return reason;
    }
}
