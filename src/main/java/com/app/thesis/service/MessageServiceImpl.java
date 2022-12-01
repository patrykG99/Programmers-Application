package com.app.thesis.service;

import com.app.thesis.model.Message;
import com.app.thesis.model.Project;
import com.app.thesis.repository.MessageRepo;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@AllArgsConstructor
@Transactional
public class MessageServiceImpl implements MessageService{

    private MessageRepo messageRepo;

    @Override
    public Message saveMessage(Message message) {
        return messageRepo.save(message);
    }

    @Override
    public List<Message> getAllByProjectFrom(Project project) {
        return messageRepo.findAllByProjectFrom(project);
    }
}
