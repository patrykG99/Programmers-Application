package com.app.thesis.service;

import com.app.thesis.DTO.ReportRequest;
import com.app.thesis.model.Report;

import java.security.Principal;
import java.util.List;

public interface ReportService {
    public Report createNewReport(ReportRequest report, Principal principal) throws Exception;
    public List<Report> getReports();
}
