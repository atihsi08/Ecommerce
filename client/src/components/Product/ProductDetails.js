import React, { useState, useEffect } from 'react';
import Carousel from 'react-material-ui-carousel';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getProductDetails } from '../../actions/productActions.js';
import ReviewCard from './ReviewCard.js';
import Loading from '../Layout/Loading/Loading.js';
import { useAlert } from 'react-alert';
import MetaData from '../MetaData.js';
import { newReview, clearErrors } from '../../actions/productActions.js';
import { NEW_REVIEW_RESET } from '../../constants/productConstants.js';
import { addItemsToCart } from '../../actions/cartActions.js';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Rating } from '@mui/material';
import './ProductDetails.css';

function ProductDetails() {

    const alert = useAlert();
    const dispatch = useDispatch();
    const { product, loading, error } = useSelector(state => state.productDetails);
    const { success, error: reviewError } = useSelector(state => state.newReview);
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0);
    const [open, setOpen] = useState(false);

    const submitReviewToggle = () => {
        open ? setOpen(false) : setOpen(true);
    }

    const options = {
        size: "large",
        value: product.ratings,
        readOnly: true,
        precision: 0.5
    }

    const decreaseQuantity = () => {
        if (quantity === 1)
            return;
        setQuantity(prevQuantity => prevQuantity - 1);
    }

    const increaseQuantity = () => {
        if (quantity === product.stock) {
            alert.success("Available stock is " + product.stock);
            return;
        }
        setQuantity(prevQuantity => prevQuantity + 1);
    }

    const addToCartHandler = () => {
        dispatch(addItemsToCart(id, quantity));
        alert.success("Item added to cart");
    }

    const reviewSubmitHandler = () => {
        const myForm = new FormData();
        myForm.set("rating", rating);
        myForm.set("comment", comment);
        myForm.set("productId", id);
        dispatch(newReview(myForm));
        setOpen(false);
    }

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (reviewError) {
            alert.error(reviewError);
            dispatch(clearErrors());
        }

        if (success) {
            alert.success("Review Submitted Successfully!");
            dispatch({ type: NEW_REVIEW_RESET });
        }

        dispatch(getProductDetails(id));
    }, [dispatch, id, error, alert, success, reviewError]);

    return (
        <>
            {
                loading ? <Loading /> :
                    <>
                        <MetaData title={`${product.name} -- ECOMMERCE`} />
                        <div className="ProductDetails">
                            <div>
                                <Carousel>
                                    {
                                        product.images && product.images.map((item, i) => (
                                            <img
                                                className="CarouselImage"
                                                src={item.url}
                                                key={i}
                                                alt={`${i} Slide`}
                                            />
                                        ))
                                    }
                                </Carousel>
                            </div>


                            <div>
                                <div className="detailsBlock-1">
                                    <h2>{product.name}</h2>
                                    <p>Product # {product._id}</p>
                                </div>

                                <div className="detailsBlock-2">
                                    <Rating {...options} />
                                    <span className="detailsBlock-2-span">({product.numOfReviews} Reviews)</span>
                                </div>

                                <div className="detailsBlock-3">
                                    <h1>{`Rs. ${product.price}`}</h1>
                                    <div className="detailsBlock-3-1">
                                        <div className="detailsBlock-3-1-1">
                                            <button onClick={decreaseQuantity}>-</button>
                                            <input readOnly value={quantity} type="number" />
                                            <button onClick={increaseQuantity}>+</button>
                                        </div>
                                        <button disabled={product.stock < 1 ? true : false} onClick={addToCartHandler}>Add to Cart</button>
                                    </div>
                                    <p>
                                        Status:
                                        <b className={product.stock < 1 ? "redColor" : "greenColor"}>
                                            {product.stock < 1 ? " OutOfStock" : " InStock"}
                                        </b>
                                    </p>
                                </div>

                                <div className="detailsBlock-4">
                                    Description: <p>{product.description}</p>
                                </div>

                                <button className="submitReview" onClick={submitReviewToggle}>
                                    Submit Review
                                </button>
                            </div>
                        </div>

                        <h3 className="reviewsHeading">REVIEWS</h3>

                        <Dialog
                            aria-labelledby="simple-dialog-title"
                            open={open}
                            onClose={submitReviewToggle}
                        >
                            <DialogTitle>Submit Review</DialogTitle>
                            <DialogContent className="submitDialog">
                                <Rating
                                    onChange={e => setRating(e.target.value)}
                                    value={rating}
                                    size="large"
                                />
                                <textarea
                                    className="submitDialogTextArea"
                                    cols="30"
                                    rows="5"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={submitReviewToggle} color="error">Cancel</Button>
                                <Button onClick={reviewSubmitHandler} color="primary">Submit</Button>
                            </DialogActions>

                        </Dialog>

                        {
                            product.reviews && product.reviews[0] ? (
                                <div className="reviews">
                                    {
                                        product.reviews &&
                                        product.reviews.map((review) => <ReviewCard review={review} />)
                                    }
                                </div>
                            ) : (
                                <p className="noReviews">No Reviews</p>
                            )
                        }
                    </>
            }

        </>
    )
}

export default ProductDetails
