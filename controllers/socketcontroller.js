module.exports = function(io) {
    var that = {};

    that.getSocket = function(req, res) {
        let socketio = req.app.get('socketio')
        socketio.emit("FromAPI", "Hello world")
        console.log(socketio)
        res.send("done");
    };
    return that
};
