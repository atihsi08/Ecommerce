import { Orders } from '../models/orderModel.js';
import { Products } from '../models/productModel.js';

export const orderController = {
    createOrder: async (req, res) => {
        try {
            const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;
            const order = await Orders.create({
                shippingInfo,
                orderItems,
                paymentInfo,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
                paidAt: Date.now(),
                user: req.user._id,
            });

            res.status(200).json({ success: true, order });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getSingleOrder: async (req, res) => {
        try {
            const order = await Orders.findById(req.params.id).populate("user", "name email");

            if (!order) return res.status(404).json({ message: "Order not found." });

            res.status(200).json({ success: true, order });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    loggedUserOrders: async (req, res) => {
        try {
            const orders = await Orders.find({ user: req.user._id });

            res.status(200).json({ success: true, orders });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getAllOrders: async (req, res) => {
        try {
            const orders = await Orders.find();

            if (orders.length === 0) return res.status(404).json({ message: "No orders have been placed." });

            const totalAmount = orders.reduce((prev, curr) => prev + curr.totalPrice, 0);

            res.status(200).json({ success: true, orders, totalAmount });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    updateOrderStatus: async (req, res) => {
        try {
            const order = await Orders.findById(req.params.id);

            if (!order) return res.status(404).json({ message: "Order not found." });

            if (order.orderStatus === "Delivered") return res.status(400).json({ message: "Order has been already delivered." });

            if (req.body.status === "Shipped") {
                order.orderItems.forEach(async (orderItem) => {
                    updateStockQuantity(orderItem.product, orderItem.quantity);
                })
            }


            order.orderStatus = req.body.status;

            if (req.body.status === "Delivered") {
                order.deliveredAt = Date.now();
            }
            await order.save({ validateBeforeSave: false });

            res.status(200).json({ success: true, order });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    deleteOrder: async (req, res) => {
        try {
            const order = await Orders.findById(req.params.id);

            if (!order) return res.status(404).json({ message: "Order not found." });

            await order.remove();

            res.status(200).json({ success: true, message: "Order deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
}

const updateStockQuantity = async (productId, quantity) => {
    const product = await Products.findById(productId);

    product.stock -= quantity;

    await product.save({ validateBeforeSave: false });
}