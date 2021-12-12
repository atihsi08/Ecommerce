import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute({ isAdmin }) {

    const { isAuthenticated, loading, user } = useSelector(state => state.user);

    return (
        <Fragment>
            {
                (loading === false && isAuthenticated === false) || (loading === false && (isAdmin === true && user.role !== 'admin')) ? <Navigate to="/login" /> : <Outlet />
            }
        </Fragment>
    )
}

export default ProtectedRoute