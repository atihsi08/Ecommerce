import React, { useEffect } from 'react'
import { CgMouse } from 'react-icons/all';
import './home.css';
import ProductCard from './ProductCard.js';
import MetaData from '../MetaData.js';
import { useSelector, useDispatch } from 'react-redux';
import { getProducts } from '../../actions/productActions.js';
import { clearErrors } from '../../actions/productActions.js';
import Loading from '../Layout/Loading/Loading';
import { useAlert } from 'react-alert';

function Home() {

    const dispatch = useDispatch();
    const alert = useAlert();

    const { products, loading, error } = useSelector(state => state.products);

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        dispatch(getProducts());
    }, [dispatch, error, alert])

    return (
        <>
            {
                loading ? <Loading /> :
                    <>
                        <MetaData title="ECOMMERCE" />
                        <div className="banner">
                            <p>Welcome to Ecommerce</p>
                            <h1>FIND AMAZING PRODUCTS BELOW</h1>

                            <a href="#container">
                                <button>
                                    Scroll <CgMouse />
                                </button>
                            </a>
                        </div>

                        <h2 className="homeHeading">Featured Product</h2>

                        <div className="container" id="container">
                            {
                                products && products.map(product => (
                                    <ProductCard product={product} key={product._id} />
                                ))}
                        </div>
                    </>
            }
        </>
    )
}

export default Home
