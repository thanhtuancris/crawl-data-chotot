const mongoose = require("mongoose")

const notiSchema = new mongoose.Schema({
    token: String,
    arr_city: Array,
})

module.exports = mongoose.model("noti", notiSchema)