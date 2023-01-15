const express = require("express")
const websocket = require("nodejs-websocket")
const fs = require('fs')
//const db = require('./db.js') /* 未完成的部分 */
const tools = require('./tools.js')

//初始化变量
var addr = "127.0.0.1"
//默认地址为127.0.0.1
var port_express = 8919
//网页服务器端口
var port_ws = 9897
//websocket端口

var tool = new tools()
//初始化工具

//启动文本
console.log("SB Chat 启动中...")
tool.pass()

try {
    //尝试读取配置文件
    var f = fs.readFile("config/config.json"/* 读取配置文件 */,(err,data) => {
        //解析配置文件
        var json_cfg = tool.jsonto(data)
        //设置地址、端口
        addr = json_cfg.server[0].addr
        port_express = json_cfg.server[0].web_port
        port_ws = json_cfg.server[0].ws_port
        //输出配置
        console.log("根据配置," + "端口号:" + port_express + " WS端口号:" + port_ws + " 设置的地址:" + addr)
        tool.pass()
        //执行app_start
        app_start()
    })
}catch {
    //错误提示，不过并无大碍，一般是读取文件失败
    console.log("Error了 不过没关系，以按照默认配置启动")
    tool.pass()
    //启动
    app_start();
}


//初始化网页文件
const app = express()

//未来可能会更新的数据库，用于用户注册登录，注册部分以完成，登录仍需打磨，目前我做不出来，但你可以试试，我很支持，目前是匿名聊天
//app.use('/',db) /* 未完成部分 */

//引用静态文件
app.use('/',express.static('pages'))

//请求主页
app.get("/",(req,res) => {
    console.log("[GET]请求主页 / ")
    tool.pass()
    res.sendFile(__dirname + "/pages/index.html")
})

//程序后端部分，我太懒了，就不注释了
function app_start() {
    const wss = websocket.createServer((coon) => {
        console.log("[WS]有一个新连接")
        tool.pass()
        coon.on("text",(data) => {
            console.log("[message]"+data)
            coon.sendText(data)
        })
        coon.on("close", function (code, reason) {
            console.log("[WS]有一个连接取消了")
            tool.pass()
        })
        coon.on("error",() => {})	
    }).listen(port_ws)
    var server = app.listen(port_express,addr,() => {
        console.log("网页服务器已启动 位于端口号"+ port_express + "WS端口号" + port_ws + "设置的地址:" + addr)
        tool.pass()
        console.log("你的聊天服务器地址: ws://"+addr+":"+port_ws+" 这会在网页内用到")
        tool.pass()
    })
}

