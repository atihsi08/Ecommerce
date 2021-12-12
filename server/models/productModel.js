import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter product name..."],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Please enter product's description..."],
    },
    price: {
        type: Number,
        required: [true, "Please enter product's price..."],
        maxLength: [8, "Price cannot exceed 8 characters"],
    },
    stock: {
        type: Number,
        required: true,
        maxlength: [4, "Stock cannot exceed 4 characters"],
        default: 1,
    },
    images: [
        {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            }
        }
    ],
    ratings: {
        type: Number,
        default: 0,
    },
    category: {
        type: String,
        required: [true, "Please enter product's category..."],
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'Users',
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
                required: true,
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
});

export const Products = mongoose.model('Product', productSchema);