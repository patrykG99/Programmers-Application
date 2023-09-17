package com.app.thesis.controller;

import com.app.thesis.DTO.ReportRequest;
import com.app.thesis.model.Report;
import com.app.thesis.service.ReportService;
import com.app.thesis.service.ReportServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @PostMapping("/report")
    public ResponseEntity<Report> saveNewReport(@RequestBody ReportRequest reportRequest, Principal principal) throws Exception {
        return ResponseEntity.ok().body(reportService.createNewReport(reportRequest,principal));
    }

    @GetMapping("/reports")
    public ResponseEntity<List<Report>> getReports(){
        return ResponseEntity.ok().body(reportService.getReports());
    }
}


