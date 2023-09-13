package com.app.thesis.service;

import com.app.thesis.DTO.ReportRequest;
import com.app.thesis.model.Report;

import java.security.Principal;

public interface ReportService {
    public Report createNewReport(ReportRequest report, Principal principal) throws Exception;
}
