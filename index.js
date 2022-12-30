const express = require("express")
const websocket = require("nodejs-websocket")
const fs = require('fs')

var addr = "127.0.0.1"
var port_express = 8919
var port_ws = 9897



try {
    var f = fs.readFile("config/config.json",(err,data) => {
        var json_cfg = JSON.parse(data)
        addr = json_cfg.server[0].addr
        port_express = json_cfg.server[0].web_port
        port_ws = json_cfg.server[0].ws_port
        console.log("根据配置," + "端口号:" + port_express + " WS端口号:" + port_ws + " 设置的地址:" + addr)
        console.log("=======")
        app_start()
    })
}catch {
    console.log("Error 不过没关系，以按照默认配置启动")
}

console.log("SB Chat 启动中...")

const app = express()


app.use('/',express.static('pages'))

app.get("/",(req,res) => {
    res.sendFile(__dirname + "/pages/index.html")
})

function app_start() {
    const wss = websocket.createServer((coon) => {
        console.log("[WS]有一个新连接")
        coon.on("text",(data) => {
            console.log("[message]"+data)
            coon.sendText(data)
        })
        coon.on("close", function (code, reason) {
            console.log("[WS]有一个连接取消了")
        })
        coon.on("error",() => {
        })	
    }).listen(port_ws)
    var server = app.listen(port_express,addr,() => {
        console.log("网页服务器已启动 位于端口号"+ port_express + "WS端口号" + port_ws + "设置的地址:" + addr)
    })
}
