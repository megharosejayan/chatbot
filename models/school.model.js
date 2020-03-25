const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let SchoolSchema = new Schema({
    name: String,
    staff: [{ type: Schema.Types.ObjectId, ref: "User" }],
    admin: { type: Schema.Types.ObjectId, ref: "User" },
})

module.exports = mongoose.model("School", SchoolSchema);