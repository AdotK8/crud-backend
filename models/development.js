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
      maxlength: 350,
      minlength: 100,
    },
    copy2: {
      type: String,
      maxlength: 350,
      minlength: 100,
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
      type: [String],
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
    completion: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      validate: {
        validator: function (v) {
          return typeof v === "number" || v === "completed";
        },
        message: (props) => `${props.value} is not a valid completion value!`,
      },
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
