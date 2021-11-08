const mongoose = require("mongoose")

const bikeSchemaa = new mongoose.Schema({
    tennguoiban: String,
	image: String,
	title: String,
	loaixe: String,
	gia: Number,
	date: String,
	diadiem: String,
	mota: String,
	hangxe: String,
	// dongxe: String,
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

module.exports = mongoose.model("bike_test", bikeSchemaa)