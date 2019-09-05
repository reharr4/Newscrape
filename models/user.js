var mongoose = require("mongoose");

// save reference to the Schema constructor
var Schema = mongoose.Schema;

// using the Schema constructor, create a new UserSchema object
var UserSchema = new Schema ({
    name: {
        type: String,
        unique: true
    },
    notes: [
        {
            type: Schema.Types.ObjectId,
            ref: "Note"
        }
    ]
});

// create model for above Schema with mongoose
var User = mongoose.model("User", UserSchema);

// export the User model
module.exports = User;