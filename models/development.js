const mongoose = require("mongoose");

const developmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    landingPage: {
      type: Boolean,
      required: true,
    },
    copy1: {
      type: String,
      maxlength: 350,
      default: "",
    },
    copy2: {
      type: String,
      maxlength: 350,
      default: "",
    },
    features: {
      type: [String],
    },
    amenities: {
      type: [String],
    },
    nearestStation: {
      type: String,
      default: "",
      required: true,
    },
    nearestStationDistance: {
      type: Number,
      default: 0,
      required: true,
    },
    images: {
      type: [String],
    },

    brochures: {
      type: [String],
      required: true,
    },

    priceLists: [
      {
        url: {
          type: String,
          required: true,
        },
      },
    ],

    priceListsLastUpdated: {
      type: Date,
      default: Date.now,
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
      zeroBed: {
        available: {
          type: Boolean,
          required: true,
        },
        priceFrom: {
          type: Number,
          required: true,
          default: 0,
        },
      },

      oneBed: {
        available: {
          type: Boolean,
          required: true,
        },
        priceFrom: {
          type: Number,
          required: true,
          default: 0,
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

      lastUpdated: {
        type: Date,
        default: Date.now,
      },
    },
    postcode: {
      type: String,
      required: true,
    },
    developer: {
      type: String,
      required: true,
    },
    cardinalLocation: {
      type: String,
      required: true,
    },

    area: {
      type: String,
      default: "N/A",
    },
    fee: {
      type: Number,
      required: true,
      min: 0,
    },
    contactEmail: {
      type: String,
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
      required: true,
    },

    completionQuarter: {
      default: "N/A",
      type: String,
    },
    completionYear: {
      required: true,
      type: String,
    },

    createdAt: {
      type: Date,
      immutable: true,
      default: Date.now(),
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Development", developmentSchema);
