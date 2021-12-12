import React from 'react';
import CartItemCard from './CartItemCard.js';
import { Link, useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { useSelector, useDispatch } from 'react-redux';
import { addItemsToCart, removeItemsFromCart } from '../../actions/cartActions.js';
import './Cart.css';

function Cart() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems } = useSelector(state => state.cart);

    const increaseQuantity = (id, quantity, stock) => {
        const newQuantity = quantity + 1;
        if (stock <= quantity) return;
        dispatch(addItemsToCart(id, newQuantity))
    }

    const decreaseQuantity = (id, quantity) => {
        const newQuantity = quantity - 1;
        if (quantity === 1) return;
        dispatch(addItemsToCart(id, newQuantity))
    }

    const deleteItemsFromCart = (id) => {
        dispatch(removeItemsFromCart(id));
    }

    const checkoutHandler = () => {
        navigate('/login?redirect=shipping');
    }

    return (
        <>
            {
                cartItems.length === 0 ? (
                    <div className="emptyCart">
                        <RemoveShoppingCartIcon />
                        <Typography>No Product in your cart</Typography>
                        <Link to="/products">View Products</Link>
                    </div>
                ) : <>
                    <div className="cartPage">
                        <div className="cartHeader">
                            <p>Product</p>
                            <p>Quantity</p>
                            <p>Subtotal</p>
                        </div>

                        {
                            cartItems && cartItems.map(item => (
                                <div className="cartContainer">
                                    <CartItemCard item={item} deleteCartItems={deleteItemsFromCart} key={item.product} />
                                    <div className="cartInput">
                                        <button onClick={() => decreaseQuantity(item.product, item.quantity)}>-</button>
                                        <input type="number" value={item.quantity} readOnly />
                                        <button onClick={() => increaseQuantity(item.product, item.quantity, item.stock)}>+</button>
                                    </div>
                                    <p className="cartSubtotal">{`$${item.price * item.quantity}`}</p>
                                </div>
                            ))
                        }

                        <div className="cartGrossProfit">
                            <div></div>
                            <div className="cartGrossProfitBox">
                                <p>Gross Total</p>
                                <p>{`$${cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0)}`}</p>
                            </div>
                            <div></div>
                            <div className="checkOutBtn">
                                <button onClick={checkoutHandler}>Check Out</button>
                            </div>
                        </div>

                    </div>
                </>
            }
        </>
    )
}

export default Cart
