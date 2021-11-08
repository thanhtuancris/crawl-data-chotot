const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const dotenv = require('dotenv');
const db = require('./config/connect.database');
const routes = require('./routes/index.router');
dotenv.config();
const host = "0.0.0.0";
const port = 8000;
let crawldata = require("./controller/data.controller")
app.use(bodyParser.urlencoded({
    extended: false 
}));
app.use(bodyParser.json());

db.connect()
routes(app);
app.get('*', function (req, res) {
    res.status(404).json({
        message: "Trang không tồn tại, vui lòng thử lại"
    });
    res.render("login")
})
app.post('*', function (req, res) {
    res.status(404).json({
        message: "Trang không tồn tại, vui lòng thử lại"
    });
})
app.listen(port, host, () => {
    console.log("Server running - port" + port);
});