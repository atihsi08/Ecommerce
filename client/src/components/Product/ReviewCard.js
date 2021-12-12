import React from 'react';
import { Rating } from '@mui/material';
import profilePng from '../../images/Profile.png';

function ReviewCard({ review }) {

    const options = {
        value: review.rating,
        readOnly: true,
    }

    return (
        <div className="reviewCard">
            <img src={profilePng} alt="User" />
            <p>{review.name}</p>
            <Rating {...options} />
            <span>{review.comment}</span>
        </div>
    )
}

export default ReviewCard
