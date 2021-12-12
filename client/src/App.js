import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Layout/Header/Header';
import Footer from './components/Layout/Footer/Footer';
import WebFont from 'webfontloader';
import Home from './components/Home/Home';
import './App.css';
import ProductDetails from './components/Product/ProductDetails';
import Products from './components/Product/Products.js';
import Search from './components/Product/Search.js';
import Auth from './components/User/Auth';
import { loadUser } from './actions/userActions.js';
import { store } from './store.js';
import UserOptions from './components/Layout/Header/UserOptions.js';
import { useSelector } from 'react-redux';
import Profile from './components/User/Profile.js';
import ProtectedRoute from './components/Route/ProtectedRoute.js';
import UpdateProfile from './components/User/UpdateProfile.js';
import UpdatePassword from './components/User/UpdatePassword';
import ForgotPassword from './components/User/ForgotPassword';
import ResetPassword from './components/User/ResetPassword';
import Cart from './components/Cart/Cart.js';
import Shipping from './components/Cart/Shipping.js';
import ConfirmOrder from './components/Cart/ConfirmOrder.js';
import axios from 'axios';
import PaymentHelper from './components/Cart/PaymentHelper.js';
import OrderSuccess from './components/Cart/OrderSuccess';
import MyOrders from './components/Order/MyOrders.js';
import OrderDetails from './components/Order/OrderDetails.js';
import Dashboard from './components/Admin/Dashboard';
import ProductList from './components/Admin/ProductList';
import NewProduct from './components/Admin/NewProduct';
import UpdateProduct from './components/Admin/UpdateProduct';
import OrderList from './components/Admin/OrderList';
import ProcessOrder from './components/Admin/ProcessOrder';
import UsersList from './components/Admin/UsersList';
import UpdateUser from './components/Admin/UpdateUser';
import ProductReviews from './components/Admin/ProductReviews';
import NotFound from './components/Layout/NotFound/NotFound';

function App() {

    const { isAuthenticated, user } = useSelector(state => state.user);
    const [stripeApiKey, setStripeApiKey] = useState('');

    const getStripeApiKey = async () => {
        const { data } = await axios.get('/payments/stripeApiKey');
        setStripeApiKey(data.stripeApiKey);
    }

    useEffect(() => {
        WebFont.load({
            google: {
                families: ['Roboto', 'Droid Sans', 'Chilanka']
            }
        })

        store.dispatch(loadUser());

        getStripeApiKey()
    }, []);

    // window.addEventListener("contextmenu", (e) => e.preventDefault());

    return (
        <Router>
            <Header />
            {isAuthenticated && <UserOptions user={user} />}
            <Routes>

                <Route exact path="/" element={<Home />} />
                <Route exact path="/productDetails/:id" element={<ProductDetails />} />
                <Route exact path="/products" element={<Products />} />
                <Route exact path="/products/:keyword" element={<Products />} />
                <Route exact path="/search" element={<Search />} />
                <Route exact path="/login" element={<Auth />} />
                <Route exact path="/account" element={<ProtectedRoute />} >
                    <Route exact path="/account" element={<Profile />} />
                </Route>
                <Route exact path="/me/update" element={<ProtectedRoute />} >
                    <Route exact path="/me/update" element={<UpdateProfile />} />
                </Route>
                <Route exact path="/password/update" element={<ProtectedRoute />} >
                    <Route exact path="/password/update" element={<UpdatePassword />} />
                </Route>
                <Route exact path="/password/forgot" element={<ForgotPassword />} />
                <Route exact path="/password/reset/:token" element={<ResetPassword />} />
                <Route exact path="/Cart" element={<Cart />} />
                <Route exact path="/login/shipping" element={<ProtectedRoute />} >
                    <Route exact path="/login/shipping" element={<Shipping />} />
                </Route>
                <Route exact path="/order/confirm" element={<ConfirmOrder />} />

                <Route exact path="/success" element={<ProtectedRoute />} >
                    <Route exact path="/success" element={<OrderSuccess />} />
                </Route>
                <Route exact path="/orders" element={<ProtectedRoute />} >
                    <Route exact path="/orders" element={<MyOrders />} />
                </Route>
                <Route exact path="/order/:id" element={<ProtectedRoute />} >
                    <Route exact path="/order/:id" element={<OrderDetails />} />
                </Route>
                <Route exact path="/admin/dashboard" element={<ProtectedRoute isAdmin={true} />}>
                    <Route exact path="/admin/dashboard" element={<Dashboard />} />
                </Route>
                <Route exact path="/admin/products" element={<ProtectedRoute isAdmin={true} />}>
                    <Route exact path="/admin/products" element={<ProductList />} />
                </Route>
                <Route exact path="/admin/product" element={<ProtectedRoute isAdmin={true} />}>
                    <Route exact path="/admin/product" element={<NewProduct />} />
                </Route>
                <Route exact path="/admin/product/:id" element={<ProtectedRoute isAdmin={true} />}>
                    <Route exact path="/admin/product/:id" element={<UpdateProduct />} />
                </Route>
                <Route exact path="/admin/orders" element={<ProtectedRoute isAdmin={true} />}>
                    <Route exact path="/admin/orders" element={<OrderList />} />
                </Route>
                <Route exact path="/admin/order/:id" element={<ProtectedRoute isAdmin={true} />}>
                    <Route exact path="/admin/order/:id" element={<ProcessOrder />} />
                </Route>
                <Route exact path="/admin/user/:id" element={<ProtectedRoute isAdmin={true} />}>
                    <Route exact path="/admin/user/:id" element={<UpdateUser />} />
                </Route>
                <Route exact path="/admin/users" element={<ProtectedRoute isAdmin={true} />}>
                    <Route exact path="/admin/users" element={<UsersList />} />
                </Route>
                <Route exact path="/admin/reviews" element={<ProtectedRoute isAdmin={true} />}>
                    <Route exact path="/admin/reviews" element={<ProductReviews />} />
                </Route>
                {
                    stripeApiKey && <Route exact path="/process/payment" element={<ProtectedRoute />} >
                        <Route exact path="/process/payment/" element={<PaymentHelper stripeApiKey={stripeApiKey} />} />
                    </Route>
                }
                <Route element={window.location.pathname === "/process/payment" ? null : <NotFound />} />

            </Routes>

            <Footer />
        </Router>
    )
}

export default App
