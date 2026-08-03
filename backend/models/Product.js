import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    discountPrice: {
      type: Number,
      default: 0,
    },

    image: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    inStock: {
      type: Boolean,
      default: true,
    },

    stock: {
      type: Number,
      default: 0,
    },

    upiId: {
      type: String,
      default: "your-vpa@upi",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Product", productSchema);
