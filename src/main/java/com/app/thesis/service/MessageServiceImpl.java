package com.app.thesis.service;

import com.app.thesis.model.Message;
import com.app.thesis.model.Project;
import com.app.thesis.model.Status;
import com.app.thesis.repository.MessageRepo;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Collections;
import java.util.List;

@Service
@AllArgsConstructor
@Transactional
public class MessageServiceImpl implements MessageService{

    private MessageRepo messageRepo;

    @Override
    public Message saveMessage(Message message) {

        if(message.getStatus().equals(Status.MESSAGE)) {
            return messageRepo.save(message);
        }
        return null;
    }

    @Override
    public List<Message> getAllByProjectFrom(Project project) {
        List<Message> messages = messageRepo.findAllByProjectFrom(project);
        Collections.reverse(messages);
        return messages;
    }
}
