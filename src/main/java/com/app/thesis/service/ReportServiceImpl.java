package com.app.thesis.service;

import com.app.thesis.DTO.ReportRequest;
import com.app.thesis.model.Project;
import com.app.thesis.model.Report;
import com.app.thesis.model.User;
import com.app.thesis.repository.ProjectRepo;
import com.app.thesis.repository.ReportRepo;
import com.app.thesis.repository.UserRepo;
import com.app.thesis.security.services.UserDetailsImpl;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.security.Principal;
import java.util.List;

@Service
@AllArgsConstructor
@Transactional
public class ReportServiceImpl implements ReportService{

    @Autowired
    ReportRepo reportRepo;
    @Autowired
    UserRepo userRepo;
    @Autowired
    ProjectRepo projectRepo;

    @Override
    public Report createNewReport(ReportRequest report, Principal principal) throws Exception {
        UserDetailsImpl userDetails = (UserDetailsImpl) ((Authentication) principal).getPrincipal();
        User user = userRepo.findById(userDetails.getId()).orElseThrow(()-> new Exception("User Not Found"));
        Project project = projectRepo.findById(report.getProjectId()).orElseThrow(()-> new Exception("Project Not Found"));

        return reportRepo.save(new Report(project, report.getReason(), user));

    }

    @Override
    public List<Report> getReports() {
        return reportRepo.findAll();
    }
}
