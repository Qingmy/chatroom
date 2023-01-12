const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)

let count = 0;
let userlist=[];
let time='';
server.listen(80, () => {
    console.log('服务器启动成功')
})

app.use(require('express').static('public'))

app.get('/', function (req, res) {
    res.redirect('index.html')
})

io.on('connection', socket => {  
    count++;
    socket.on('send', function (e) {
        let msginfo = JSON.parse(e);
        if(time===''){
            time=msginfo.time;
        }else{
            if(((msginfo.time-new Date(time))>=(1000*60*1))){
                msginfo.type='time';
            }
        }
        io.emit('receive',
            JSON.stringify(msginfo)
        )
        time=msginfo.time;
    })
    socket.on('sendImage',function(e){
        io.emit('receiveImage',e)
    })
    socket.on('log', function (e) {
        let loginfo = JSON.parse(e);
        if(userlist.includes(loginfo.msg)){
            socket.emit('Existing-user',1)
        }else{
            userlist.push(loginfo.msg)
            socket.emit('Existing-user',0) 
            socket.username=loginfo.msg
            console.log(userlist)
        }
    })
    socket.on('disconnect', ()=> {
        let idx=userlist.findIndex(item => item===socket.username)
        if (idx !== -1) {
          userlist.splice(idx,1)
          console.log(userlist) 
        }
      });
      
})