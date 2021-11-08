const dataRouter = require("./data.router.js")
// const typeRouter = require("./type.router")
function routes(app) {
    app.use('/api', dataRouter);
   
}
module.exports = routes;