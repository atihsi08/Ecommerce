import axios from 'axios';
import { ALL_PRODUCT_REQUEST, ALL_PRODUCT_SUCCESS, ALL_PRODUCT_FAIL, CLEAR_ERRORS, PRODUCT_DETAILS_SUCCESS, PRODUCT_DETAILS_FAIL, PRODUCT_DETAILS_REQUEST, NEW_REVIEW_FAIL, NEW_REVIEW_REQUEST, NEW_REVIEW_SUCCESS, ADMIN_PRODUCT_REQUEST, ADMIN_PRODUCT_FAIL, ADMIN_PRODUCT_SUCCESS, NEW_PRODUCT_REQUEST, NEW_PRODUCT_SUCCESS, NEW_PRODUCT_FAIL, DELETE_PRODUCT_SUCCESS, DELETE_PRODUCT_FAIL, DELETE_PRODUCT_REQUEST, UPDATE_PRODUCT_REQUEST, UPDATE_PRODUCT_SUCCESS, UPDATE_PRODUCT_FAIL, ALL_REVIEW_REQUEST, ALL_REVIEW_SUCCESS, ALL_REVIEW_FAIL, DELETE_REVIEW_FAIL, DELETE_REVIEW_REQUEST, DELETE_REVIEW_SUCCESS } from '../constants/productConstants.js';

export const getProducts = (currentPage = 1) => async (dispatch) => {
    try {
        dispatch({ type: ALL_PRODUCT_REQUEST });
        const { data } = await axios.get(`/products?page=${currentPage}`);
        dispatch({ type: ALL_PRODUCT_SUCCESS, payload: data })
    } catch (error) {
        dispatch({ type: ALL_PRODUCT_FAIL, payload: error.response.data.message });
    }
}

export const getProductsBySearch = (keyword = "", currentPage = 1) => async (dispatch) => {
    try {
        dispatch({ type: ALL_PRODUCT_REQUEST });
        const { data } = await axios.get(`/products/search?search=${keyword}&page=${currentPage}`);
        dispatch({ type: ALL_PRODUCT_SUCCESS, payload: data })
    } catch (error) {
        dispatch({ type: ALL_PRODUCT_FAIL, payload: error.response.data.message });
    }
}

export const getProductsByFilter = (price = [0, 25000], currentPage = 1, category, rating = 0) => async (dispatch) => {
    try {
        dispatch({ type: ALL_PRODUCT_REQUEST });
        const { data } = await axios.get(`/products/filter?price[gte]=${price[0]}&price[lte]=${price[1]}&page=${currentPage}&category=${category}&ratings=${rating}`);
        dispatch({ type: ALL_PRODUCT_SUCCESS, payload: data })
    } catch (error) {
        dispatch({ type: ALL_PRODUCT_FAIL, payload: error.response.data.message });
    }
}

export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
}

export const getProductDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_DETAILS_REQUEST });
        const { data } = await axios.get(`/products/${id}`);
        dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data.product });
    } catch (error) {
        dispatch({ type: PRODUCT_DETAILS_FAIL, payload: error.response.data.message })
    }
}

export const newReview = (reviewData) => async (dispatch) => {
    try {
        dispatch({ type: NEW_REVIEW_REQUEST });
        const config = { headers: { 'Content-Type': 'application/json' } };
        const { data } = await axios.put('/products/review', reviewData, config);
        dispatch({ type: NEW_REVIEW_SUCCESS, payload: data.success });
    } catch (error) {
        dispatch({ type: NEW_REVIEW_FAIL, payload: error.response.data.message });
    }
}

export const getAdminProducts = () => async (dispatch) => {
    try {
        dispatch({ type: ADMIN_PRODUCT_REQUEST });
        const { data } = await axios.get('/products/admin/products');
        dispatch({ type: ADMIN_PRODUCT_SUCCESS, payload: data.products });
    } catch (error) {
        dispatch({ type: ADMIN_PRODUCT_FAIL, payload: error.response.data.message });
    }
}

export const createProduct = (productData) => async (dispatch) => {
    try {
        dispatch({ type: NEW_PRODUCT_REQUEST });
        const config = { headers: { 'Content-Type': 'application/json' } };
        const { data } = await axios.post('/products/admin', productData, config);
        dispatch({ type: NEW_PRODUCT_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: NEW_PRODUCT_FAIL, payload: error.response.data.message })
    }
}

export const deleteProduct = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_PRODUCT_REQUEST });
        const { data } = await axios.delete(`/products/admin/${id}`);
        dispatch({ type: DELETE_PRODUCT_SUCCESS, payload: data.success });
    } catch (error) {
        dispatch({ type: DELETE_PRODUCT_FAIL, payload: error.response.data.message });
    }
}

export const updateProduct = (id, productData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_PRODUCT_REQUEST });
        const config = { headers: { 'Content-Type': 'application/json' } };
        const { data } = await axios.put(`/products/admin/${id}`, productData, config);
        dispatch({ type: UPDATE_PRODUCT_SUCCESS, payload: data.success });
    } catch (error) {
        dispatch({ type: UPDATE_PRODUCT_FAIL, payload: error.response.data.message });
    }
}

export const getAllReviews = (id) => async (dispatch) => {
    try {
        dispatch({ type: ALL_REVIEW_REQUEST });
        console.log(id)
        const { data } = await axios.get(`/products/reviews?id=${id}`);
        dispatch({ type: ALL_REVIEW_SUCCESS, payload: data.reviews })
    } catch (error) {
        dispatch({ type: ALL_REVIEW_FAIL, payload: error.response.data.message });
    }
}

export const deleteReviews = (productId, reviewId) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_REVIEW_REQUEST });
        const { data } = await axios.delete(`/products/review?productId=${productId}&id=${reviewId}`);
        dispatch({ type: DELETE_REVIEW_SUCCESS, payload: data.success });
    } catch (error) {
        dispatch({ type: DELETE_REVIEW_FAIL, payload: error.response.data.message });
    }
}