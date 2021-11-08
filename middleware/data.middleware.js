module.exports = {
    update: function(req, res, next) {
        if(!req.body.id){
            res.status(400).json({
                statuscode: 400,
                message: "ID không được để trống!"
            });
            return;
        }
        next();
    }
}