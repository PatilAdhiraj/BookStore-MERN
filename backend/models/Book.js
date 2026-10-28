const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    isbn: {
      type: String,
      required: true,
      unique: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    year: {
      type: Number,
    },

    price: {
      type: Number,
      required: true,
    },

    publisher: {
      type: String,
      required: true,
    },

    author: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Book", bookSchema);