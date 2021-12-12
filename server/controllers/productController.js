import { Products } from "../models/productModel.js";
import cloudinary from 'cloudinary';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const productController = {
    getProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const product = await Products.findById(id);
            if (!product) return res.status(404).json({ success: false, message: "Product not found" });
            res.status(200).json({ success: true, product });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getProducts: async (req, res) => {
        try {
            let { page } = req.query;
            page = page === undefined ? 1 : page;
            const LIMIT = 8;
            const startIndex = ((Number(page) - 1) * LIMIT);
            const total = await Products.countDocuments();
            const products = await Products.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

            res.status(200).json({
                success: true,
                products,
                numberOfPages: Math.ceil(total / LIMIT), currentPage: page,
                productsCount: total,
                resultPerPage: LIMIT
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getProductsBySearch: async (req, res) => {
        try {
            const { page, search } = req.query;
            const LIMIT = 8;
            const startIndex = ((Number(page) - 1) * LIMIT);
            const searchQuery = new RegExp(search, 'i');
            const products = await Products.find({ name: searchQuery }).find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
            const productsCount = await Products.countDocuments({ name: searchQuery });
            res.status(200).json({
                success: true,
                products,
                productsCount,
                numberOfPages: Math.ceil(productsCount / LIMIT),
                currentPage: page,
                resultPerPage: LIMIT
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getProductsByFilter: async (req, res) => {
        try {
            const { price, category, ratings, page } = req.query;
            const maxPrice = Number(price?.lte), minPrice = Number(price?.gte);

            const LIMIT = 8;
            const startIndex = ((Number(page) - 1) * LIMIT);
            let products, productsCount;
            if (category) {
                products = await Products.find({
                    $and: [
                        { price: { $lte: maxPrice || 1000000000, $gte: minPrice || 0 } },
                        { category },
                        { ratings: { $gte: Number(ratings) || 0 } },
                    ]
                }).sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

                productsCount = await Products.countDocuments({
                    $and: [
                        { price: { $lte: maxPrice || 1000000000, $gte: minPrice || 0 } },
                        { category },
                        { ratings: { $gte: Number(ratings) || 0 } },
                    ]
                });

            }
            else {
                products = await Products.find({
                    $and: [
                        { price: { $lte: maxPrice || 1000000000, $gte: minPrice || 0 } },
                        { ratings: { $gte: Number(ratings) || 0 } },
                    ]
                }).sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

                productsCount = await Products.countDocuments({
                    $and: [
                        { price: { $lte: maxPrice || 1000000000, $gte: minPrice || 0 } },
                        { ratings: { $gte: Number(ratings) || 0 } },
                    ]
                });
            }


            res.status(200).json({
                success: true,
                products,
                productsCount,
                numberOfPages: Math.ceil(productsCount / LIMIT),
                currentPage: page,
                resultPerPage: LIMIT
            });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    createProduct: async (req, res) => {
        try {

            let images = [];
            if (typeof req.body.images === 'string') {
                images.push(req.body.images);
            }
            else {
                images = req.body.images;
            }

            const imagesLink = [];
            for (let i = 0; i < images.length; i++) {
                const result = await cloudinary.v2.uploader.upload(images[i], {
                    folder: "products",
                });
                imagesLink.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                })
            }
            req.body.images = imagesLink;
            req.body.user = req.user._id;
            const product = req.body;
            const newProduct = await Products.create(product);

            res.status(200).json({ success: true, product: newProduct });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    updateProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const productData = req.body;
            const product = await Products.findById(id);
            if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

            let images = [];
            if (typeof req.body.images === 'string') {
                images.push(req.body.images);
            }
            else {
                images = req.body.images;
            }

            if (images !== undefined) {
                for (let i = 0; i < product.images.length; i++) {
                    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
                }

                const imagesLink = [];

                for (let i = 0; i < images.length; i++) {
                    const result = await cloudinary.v2.uploader.upload(images[i], {
                        folder: "products",
                    });
                    imagesLink.push({
                        public_id: result.public_id,
                        url: result.secure_url,
                    })
                }

                req.body.images = imagesLink;
            }

            product = await Products.findByIdAndUpdate(id, productData, { new: true });
            res.status(200).json({ success: true, product });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    deleteProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const product = await Products.findById(id);
            if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

            for (let i = 0; i < product.images.length; i++) {
                await cloudinary.v2.uploader.destroy(product.images[i].public_id);
            }

            await product.remove();
            res.status(200).json({ success: true, message: 'Product Deleted Successfully!!' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    productReview: async (req, res) => {
        try {
            const { rating, comment, productId } = req.body;
            const newReview = {
                user: req.user._id,
                name: req.user.name,
                rating: Number(rating),
                comment,
            };
            const product = await Products.findById(productId);

            if (!product) return res.status(404).json({ message: `Product with id ${req.params.id} not found` });

            const isReviewed = product.reviews.find(review => review.user.toString() === req.user._id.toString());

            if (isReviewed) {
                product.reviews.forEach((review) => {
                    if (review.user.toString() === req.user._id.toString()) {
                        review.rating = rating ? Number(rating) : review.rating;
                        review.comment = comment ? comment : review.comment;
                    }
                })
            }
            else {
                product.reviews.push(newReview);
                product.numOfReviews = product.reviews.length;
            }

            let avg = 0;
            product.reviews.forEach(review => {
                avg += review.rating;
            });
            product.ratings = avg / product.reviews.length;

            await product.save({ validateBeforeSave: false });

            res.status(200).json({ success: true, message: 'Review added successfully.' });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    productAllReviews: async (req, res) => {
        try {
            console.log("Inside controller" + req.query.id);
            const id = mongoose.Types.ObjectId(req.query.id);
            const product = await Products.findById(id);

            console.log(product);

            if (!product) return res.status(404).json({ message: 'Product not found' });

            console.log(product.reviews);

            res.status(200).json({ success: true, reviews: product.reviews });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    deleteReview: async (req, res) => {
        try {
            const product = await Products.findById(req.query.productId);

            if (!product) return res.status(404).json({ message: 'Product not found' });

            const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id);

            let avg = 0;
            reviews.forEach(review => {
                avg += review.rating;
            });

            let ratings = 0;

            if (reviews.length === 0) {
                ratings = 0;
            } else {
                ratings = avg / reviews.length;
            }

            product.ratings = ratings;
            product.reviews = reviews;
            product.numOfReviews = reviews.length;

            await product.save({ validateBeforeSave: false });

            res.status(200).json({ success: true, message: 'Review deleted successfully.' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getAdminProducts: async (req, res) => {
        try {
            const products = await Products.find();
            res.status(200).json({ success: true, products });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}