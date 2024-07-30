const mongoose = require("mongoose");

const developmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    landingPage: {
      type: Boolean,
      required: true,
    },
    copy1: {
      type: String,
    },
    copy2: {
      type: String,
    },
    features: {
      type: [String],
    },
    amenities: {
      type: [String],
    },
    nearestStation: {
      type: String,
    },
    nearestStationDistance: {
      type: Number,
    },
    images: {
      image1: {
        type: String,
      },
      image2: {
        type: String,
      },
    },
    zone: {
      type: Number,
      required: true,
    },
    parking: {
      type: Boolean,
      required: true,
    },
    availability: {
      oneBed: {
        available: {
          type: Boolean,
          required: true,
        },
        priceFrom: {
          type: Number,
          required: true,
        },
      },
      twoBed: {
        available: {
          type: Boolean,
          required: true,
        },
        priceFrom: {
          type: Number,
          required: true,
        },
      },
      threeBed: {
        available: {
          type: Boolean,
          required: true,
        },
        priceFrom: {
          type: Number,
          required: true,
        },
      },
      fourPlusBed: {
        available: {
          type: Boolean,
          required: true,
        },
        priceFrom: {
          type: Number,
          required: true,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Development", developmentSchema);
