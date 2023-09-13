package com.app.thesis.repository;

import com.app.thesis.model.Report;
import com.app.thesis.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepo extends JpaRepository<Report, Long> {
}
