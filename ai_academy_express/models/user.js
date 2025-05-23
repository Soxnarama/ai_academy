const mongoose = require("mongoose");
const { Schema } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema(
  {
    name: {
      first: { type: String, trim: true },
      last: { type: String, trim: true },
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    zipCode: {
      type: Number,
      min: [10000, "Code postal trop court"],
      max: 99999,
    },
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    subscribedAccount: { type: Schema.Types.ObjectId, ref: "Subscriber" },
  },
  {
    timestamps: true,
  }
);

// Attribut virtuel pour le nom complet
userSchema.virtual("fullName").get(function () {
  return `${this.name.first} ${this.name.last}`;
});

// Hook pour connecter un abonné
userSchema.pre("save", function (next) {
  let user = this;
  if (user.subscribedAccount === undefined) {
    mongoose
      .model("Subscriber")
      .findOne({ email: user.email })
      .then((subscriber) => {
        user.subscribedAccount = subscriber;
        next();
      })
      .catch((error) => {
        console.log(`Erreur lors de la connexion avec l'abonné: ${error.message}`);
        next(error);
      });
  } else {
    next();
  }
});

// Intégration de passport-local-mongoose
userSchema.plugin(passportLocalMongoose, {
  usernameField: "email", // email comme identifiant
});

module.exports = mongoose.model("User", userSchema);
