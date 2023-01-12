
//引入socket.io
let socket = io(
    'http://qingmy.natapp1.cc',
);
//登录
function log(names, proto) {
    socket.emit('log',
        JSON.stringify({
            msg: names,
            proto: proto
        })
    )
    socket.on('Existing-user', (e) => {
        console.log('!')
        if (e === 0) {
            $(".login").hide()
            $(".content").show()
        } else {
            $('.tips p').html('该用户名已经存在了哦')
        }
    })
}
//发送信息
function send(names, msg, proto) {
    socket.emit('send',
        JSON.stringify({
            names: names,
            msg: msg,
            proto: proto,
            time: new Date().getTime()
        })
    );
}
//接收信息
function receive(names, msgs) {
    if (msgs.type != null) {
        $(".Chatbox")
            .append($("<div>")
                .addClass("timebox")
                .html(new Date().toLocaleTimeString())
            )
    }
    if (names == msgs.names) {
        $(".Chatbox")
            .append($("<div>")
                .addClass("mymsgbox").append($("<img>").addClass("photo").attr("src", msgs.proto))
                .append($("<div>").addClass("msg").html(msgs.msg).css('background-color', '#95ec69')))
    } else {
        $(".Chatbox")
            .append($("<div>")
                .addClass("othermsgbox").append($("<img>").addClass("photo").attr("src", msgs.proto))
                .append($("<div>").addClass("msg").html(msgs.msg)))
    }
    $('.Chatbox').scrollTop($('.Chatbox')[0].scrollHeight);
}
//接收图片信息
function receiveImage(names,msgs){
    if (names == msgs.names) {
        $(".Chatbox")
            .append($("<div>")
                .addClass("myimagebox").append($("<img>").addClass("photo").attr("src", msgs.proto))
                .append($("<img>").addClass("img").attr("src",msgs.img).css('background-color', '#95ec69').css('max-width','100px').css('max-height','100px')))
    } else {
        $(".Chatbox")
            .append($("<div>")
                .addClass("otherimagebox").append($("<img>").addClass("photo").attr("src", msgs.proto))
                .append($("<img>").addClass("img").attr("src",msgs.img)))
    }
    //等待图片加载完成
    $('.Chatbox img:last').on('load',function(){
        $('.Chatbox').scrollTop($('.Chatbox')[0].scrollHeight);
    })
}

export { log, send, receive,receiveImage};