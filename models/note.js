var mongoose = require ("mongoose");

// save reference to Schema constructor
var Schema = mongoose.Schema;

// create new NoteSchema object
var NoteSchema = new Schema({
    title: String,
    body: String
});

var Note = mongoose.model("Note", NoteSchema);

// export Note model
module.exports = Note;