$(document).ready(function() {

    Math.clamp = function(a, b, c) {
        return Math.max(b, Math.min(c, a));
    };


    var messages = [];
    var socket = io.connect('http://localhost:3000');
    var field = $("input.field");
    var sendButton = $("input.send");
    var content = document.getElementById("content");

    var setColor = function(data) {

        var yHex = Math.clamp((Math.floor((data.y / 400) * 256)), 0, 255);
        var xHex = Math.clamp((Math.floor(Math.abs(data.x / 400) * 256)), 0, 255);
        var zHex = Math.clamp((Math.floor(Math.abs(data.z / 400) * 256)), 0, 255);

        var bgint = zHex + (xHex * 16^3) + (yHex * 16^5);

        var bgcolor = "#" + bgint.toString(16);

        // console.log(bgcolor);
        // $('body').css('background-color', bgcolor);
        
        return bgcolor;
    };
 
    socket.on('send', function (data) {
        if(data.x && data.y && data.z) {

            // setColor(data);

            $('div#content').prepend("<div>X: " + data.x + " Y: " + data.y + " Z: " + data.z + "</div>");
        } else {
            console.log("There is a problem:", data);
        }
    });
 
    sendButton.click(function() {
        var text = field.val();
        socket.emit('send', { message: text });
    });
});
