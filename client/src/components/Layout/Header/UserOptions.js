import React, { useState } from 'react';
import './Header.css';
import { SpeedDial, SpeedDialAction, Backdrop } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../actions/userActions.js';

function UserOptions({ user }) {

    const navigate = useNavigate();
    const { cartItems } = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const alert = useAlert();
    const [open, setOpen] = useState(false);


    const dashboard = () => navigate("/admin/dashboard");

    const orders = () => navigate("/orders");

    const account = () => navigate("/account");

    const logoutUser = () => {
        dispatch(logout());
        alert.success("Logout Successfully");
    }

    const cart = () => navigate("/Cart");

    const options = [
        { icon: <ListAltIcon />, name: "Orders", func: orders },
        { icon: <ShoppingCartIcon style={{ color: cartItems.length > 0 ? "tomato" : "unset" }} />, name: `Cart(${cartItems.length})`, func: cart },
        { icon: <PersonIcon />, name: "Profile", func: account },
        { icon: <ExitToAppIcon />, name: "Logout", func: logoutUser },
    ]

    if (user.role === "admin") {
        options.unshift({ icon: <DashboardIcon />, name: "Dashboard", func: dashboard })
    }
    return (
        <>
            <Backdrop open={open} style={{ zIndex: '10' }} />
            <SpeedDial
                ariaLabel="SpeedDial Tooltip example"
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
                style={{ zIndex: '11' }}
                direction="down"
                className="speedDial"
                icon={<img
                    className="speedDialIcon"
                    src={user.avatar.url ? user.avatar.url : "/Profile.png"}
                    alt="Profile"
                />}
            >

                {
                    options.map(option => (
                        <SpeedDialAction
                            key={option.name}
                            icon={option.icon}
                            tooltipTitle={option.name}
                            onClick={option.func}
                            tooltipOpen={window.innerWidth <= 600 ? true : false}
                        />)
                    )
                }
            </SpeedDial>
        </>
    )
}

export default UserOptions
