package com.app.thesis.service;

import com.app.thesis.model.Message;
import com.app.thesis.model.Project;

import java.util.List;

public interface MessageService {
    Message saveMessage(Message message);

    List<Message> getAllByProjectFrom(Project project);
}
