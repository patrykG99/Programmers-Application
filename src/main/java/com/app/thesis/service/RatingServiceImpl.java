package com.app.thesis.service;

import com.app.thesis.model.Rating;
import com.app.thesis.repository.RatingRepo;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
@AllArgsConstructor
@Transactional
public class RatingServiceImpl implements RatingService{

    private final RatingRepo ratingRepo;

    @Override
    public Rating saveRating(Rating rating) {
        return ratingRepo.save(rating);
    }
}
