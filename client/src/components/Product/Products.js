import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearErrors, getProductsBySearch, getProducts, getProductsByFilter } from '../../actions/productActions.js';
import Loading from '../Layout/Loading/Loading.js';
import ProductCard from '../Home/ProductCard.js';
import { useParams } from 'react-router-dom';
import { useAlert } from 'react-alert';
import Pagination from 'react-js-pagination';
import MetaData from '../MetaData.js';
import { Slider, Typography } from '@mui/material';
import "./Products.css";

const categories = [
    "Laptop",
    "Footwear",
    "Bottom",
    "Tops",
    "Attire",
    "Camera",
    "SmartPhones",
]

function Products() {

    const dispatch = useDispatch();
    const { products, loading, error, productsCount, resultPerPage } = useSelector(state => state.products);
    const alert = useAlert();
    const { keyword } = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([0, 25000]);
    const [category, setCategory] = useState('');
    const [rating, setRating] = useState(0);

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        if (keyword)
            dispatch(getProductsBySearch(keyword, currentPage));
        else if (category || price || rating)
            dispatch(getProductsByFilter(price, currentPage, category, rating));
        else
            dispatch(getProducts(currentPage));
    }, [dispatch, alert, error, keyword, currentPage, price, category, rating]);

    const setCurrentPageNo = (e) => {
        setCurrentPage(e);
    }

    const priceHandler = (e, newPrice) => {
        setPrice(newPrice);
    }

    return (
        <>
            {
                loading ? <Loading /> : (
                    <>
                        <MetaData title="PRODUCTS -- ECOMMERCE" />
                        <h2 className="productsHeading">Products</h2>
                        <div className="products">
                            {products && products.map(product => <ProductCard key={product._id} product={product} />)}
                        </div>

                        <div className="filterBox">
                            <Typography>Price</Typography>
                            <Slider
                                value={price}
                                onChange={priceHandler}
                                valueLabelDisplay="auto"
                                aria-labelledby="range-slider"
                                min={0}
                                max={25000}
                            />

                            <Typography>Categories</Typography>
                            <ul className="categoryBox">
                                {
                                    categories.map(category => (
                                        <li
                                            className="category-link"
                                            key={category}
                                            onClick={() => setCategory(category)}
                                        >{category}</li>
                                    ))
                                }
                            </ul>

                            <fieldset>
                                <Typography component="legend">Ratings Above</Typography>
                                <Slider
                                    value={rating}
                                    onChange={(e, newRating) => setRating(newRating)}
                                    aria-labelledby="continuous-slider"
                                    valueLabelDisplay="auto"
                                    min={0}
                                    max={5}
                                />
                            </fieldset>
                        </div>

                        {
                            resultPerPage < productsCount && (
                                <div className="paginationBox">
                                    <Pagination
                                        activePage={currentPage}
                                        itemsCountPerPage={resultPerPage}
                                        totalItemsCount={productsCount}
                                        onChange={setCurrentPageNo}
                                        nextPageText="Next"
                                        prevPageText="Prev"
                                        firstPageText="1st"
                                        lastPageText="Last"
                                        itemClass="page-item"
                                        linkClass="page-link"
                                        activeClass="pageItemActive"
                                        activeLinkClass="pageLinkActive"
                                    />
                                </div>
                            )
                        }
                    </>
                )
            }
        </>
    )
}

export default Products
