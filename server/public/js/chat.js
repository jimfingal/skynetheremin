$(document).ready(function() {
    var messages = [];
    var socket = io.connect('http://localhost:3000');
    var field = $("input.field");
    var sendButton = $("input.send");
    var content = document.getElementById("content");
 
    socket.on('message', function (data) {
        if(data.message) {
            messages.push(data);
            var html = '';
            for(var i=0; i<messages.length; i++) {
                html += messages[i].message + '<br />';
            }
            content.innerHTML = html;
        } else {
            console.log("There is a problem:", data);
        }
    });
 
    sendButton.click(function() {

        var text = field.val();
        socket.emit('send', { message: text });
    });
});
