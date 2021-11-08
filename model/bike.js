const mongoose = require("mongoose")

const bikeSchema = new mongoose.Schema({
    tennguoiban: String,
	image: String,
	title: String,
	loaixe: String,
	gia: Number,
	date: Date,
	diadiem: String,
	province: String,
	mota: String,
	hangxe: String,
	namdangky: String,
	sokm: Number,
	sodt: String,
	dungtichxe: String,
	trangthai: Number,
	ghichu: String,
	loaiCH: String,
    isdelete: Boolean,
    date_import: Date,
})

module.exports = mongoose.model("bike", bikeSchema)