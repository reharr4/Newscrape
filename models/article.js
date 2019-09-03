var mongoose = require("mongoose");

// svae reference to Schema constructor
var Schema = mongoose.Schema;

// create new userSchema object
var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    // note: {
    //     type: Schema.Types.ObjectId,
    //     ref: "Note"
    // }
});

// create model from schema above using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// export Article model
module.exports = Article;