import { log, send, receive, receiveImage } from './FunctionScript.js'

//连接服务器
let socket = io(
  'http://qingmy.natapp1.cc',
);
//保存用户选择的姓名和头像
let names, proto;
//选择头像
$(".imgbox ul img").on('click', function () {
  $(this)
    .addClass('now')
    .siblings()
    .removeClass('now')
})
//提示输入id
$(".login_button").on('click', function () {
  names = $(".main input").val();
  proto = $(".now").attr("src");
  if (names == "") {
    alert("先来个来个吊炸天的名字");
    return;
  }
  log(names, proto);
})
//点击按钮发送信息
$(".send_button").on('click', function () {
  send(names, $(".inputbox>input").val(), proto)
  $(".input").val("");
});
//点击发送图片
$('#file').on('change', function () {
  let file = this.files[0];
  //把文件发送到服务器
  let fr = new FileReader();
  if (file != null) {
    fr.readAsDataURL(file)
    fr.onload = function () {
      socket.emit('sendImage', JSON.stringify({
        names: names,
        proto: proto,
        img: fr.result
      }))
    }
  }
})
//接收图片
socket.on('receiveImage', (e) => {
  let msgs = JSON.parse(e);
  console.log(msgs);
  receiveImage(names, msgs);
})
//按下Enter按键发送信息
$("body").on('keypress', (e) => {
  if (e.key == 'Enter') {
    if ($('.login').attr('style') === 'display: none;') {
      send(names, $(".inputbox>input").val(), proto)
      $(".input").val("");
    }
  }
});
//接收信息
socket.on('receive', (e) => {
  let msgs = JSON.parse(e);
  receive(names, msgs);
})
$(".input").emoji({
  button:"#emoji",
  showTab: false,
  animation: 'slide',
  position: 'topLeft',
  icons: [{
    name: "QQ表情",
    path: "./eshengsky-jQuery-emoji-14683e9/dist/img/qq/",
    maxNum: 91,
    excludeNums: [41, 45, 54],
    file: ".gif"
  }]
});
