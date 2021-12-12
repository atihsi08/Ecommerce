import React, { useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useSelector, useDispatch } from 'react-redux';
import Loading from '../Layout/Loading/Loading.js';
import { Link } from 'react-router-dom';
import { useAlert } from 'react-alert';
import MetaData from '../MetaData.js';
import { Typography } from '@mui/material';
import { clearErrors, myOrders } from '../../actions/orderActions.js';
import LaunchIcon from '@mui/icons-material/Launch';
import './MyOrders.css';

function MyOrders() {

    const dispatch = useDispatch();
    const alert = useAlert();
    const { orders, loading, error } = useSelector(state => state.myOrders);
    const { user } = useSelector(state => state.user);

    const columns = [
        { field: "id", headerName: "Order ID", minWidth: 300, flex: 1 },

        {
            field: "status",
            headerName: "Status",
            minWidth: 150,
            flex: 0.5,
            cellClassName: (params) => {
                return params.getValue(params.id, "status") === "Delivered"
                    ? "greenColor"
                    : "redColor";
            },
        },
        {
            field: "itemsQty",
            headerName: "Items Qty",
            type: "number",
            minWidth: 150,
            flex: 0.3,
        },

        {
            field: "amount",
            headerName: "Amount",
            type: "number",
            minWidth: 270,
            flex: 0.5,
        },

        {
            field: "actions",
            flex: 0.3,
            headerName: "Actions",
            minWidth: 150,
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <Link to={`/order/${params.getValue(params.id, "id")}`}>
                        <LaunchIcon />
                    </Link>
                );
            },
        },
    ];
    const rows = [];

    orders &&
        orders.forEach((item) => {
            rows.push({
                itemsQty: item.orderItems.length,
                id: item._id,
                status: item.orderStatus,
                amount: item.totalPrice,
            });
        });

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        dispatch(myOrders());
    }, [alert, error, dispatch])
    return (
        <>
            <MetaData title={`${user.name} - Orders`} />

            {loading ? (
                <Loading />
            ) : (
                <div className="myOrdersPage">
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        disableSelectionOnClick
                        className="myOrdersTable"
                        autoHeight
                    />

                    <Typography id="myOrdersHeading">{user.name}'s Orders</Typography>
                </div>
            )}
        </>
    )
}

export default MyOrders
