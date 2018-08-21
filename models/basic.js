const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const basicSchema = new Schema({
  // title: { type: String, required: true },
  // author: { type: String, required: true },
  // synopsis: String,
  // date: { type: Date, default: Date.now }
  usa_state: { type: String, required: true },
  usa_city: String
});

const Basic = mongoose.model("Basic", basicSchema);

module.exports = Basic;
