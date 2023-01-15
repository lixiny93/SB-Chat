//[WARN]请注意，此JS仅用于测试，未完成正式开发！
//此文件不做注释！

const sqlite3 = require('sqlite3')
const express = require('express')
const fs = require('fs')
const path = require('path')
const { randomInt } = require('crypto')
const tools = require('./tools.js')

var router = express.Router()
var tool = new tools()

var db = new sqlite3.Database(path.join(__dirname,'config/users.db'),(err) => {
    if(err) {
        console.log("[数据库]数据库错误,检查数据库users.db是否存在")
        tool.pass()
    }else {
        console.log("[数据库]数据库连接成功")
        tool.pass()
    }
})

//需要请求参数 user pwd
router.get('/user/reg',(req,res) => {
    console.log("[GET]/user/reg 请求参数:")
    tool.pass()

    var req_json = tool.objto(req.query)
    req_json = tool.jsonto(req_json)
    console.log(req_json)
    tool.pass()
    if(req_json.user == "" | req_json.pwd == "" ) {
        res.send("用户名或密码为空")
    }else if(req_json.user == undefined | req_json.pwd == undefined) {
        res.send("所需参数为空！")
    }else if(req_json.user != undefined | req_json.pwd != undefined){
        var id = randomInt(100000,1000000000)
        console.log("为用户随机出来的id是:" + id)
        tool.pass()
        db.run(`INSERT INTO USERS VALUES(?,?,?,"USER")`,id,req_json.user,req_json.pwd)
        db.all(`SELECT * FROM USERS WHERE ID = ?;`,id,(err,rows) => {
            console.log("[数据库]数据库返回的结果:" + tool.objto(rows))
            tool.pass()
            res.send("完成:" + tool.objto(rows) + "<br><h1>请谨记id与密码!</h1>")
        })
    }
    
})


//需要请求参数 id pwd
router.get('/user/login',(req,res) => {
    console.log("[GET]/user/login 请求参数:")
    tool.pass()

    var req_json = tool.objto(req.query)
    req_json = tool.jsonto(req_json)

    console.log(req_json)
    tool.pass()

    if(req_json.id == "" | req_json.pwd == "" ) {
        res.send("ID或密码为空")
    }else if(req_json.id == undefined | req_json.pwd == undefined) {
        res.send("所需参数为空")
    }else if(req_json.id != "" | req_json.pwd != "") {
        db.all(`SELECT ID, PWD FROM USERS WHERE ID = ?`,req_json.id,(err,rows) => {
            var ret = tool.objto(rows)
            ret = tool.jsonto(ret)
            console.log("[数据库]数据库返回参数:"+ret[0].PWD)
            tool.pass()
            if(ret[0].PWD == req_json.pwd) {
                res.send("登录成功!ID:" + req_json.id)
            }
        })

    }
    
})


module.exports = router