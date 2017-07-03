/**
 * Created by Administrator on 2017/7/3.
 */
var express = require("express");
var app = express();
var session = require("express-session")
var router = require("./controller/controller.js")
app.set("view engine","ejs");

app.use(express.static("./public"));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))


app.listen(3000)


app.get("/",router.showIndex);


app.get("/register",router.showRegister)
app.get("/login",router.showLogin)


app.post("/doRegister",router.doRegister)
app.post("/doLogin", router.doLogin)

//退出
app.get("/loginOut", router.loginOut)

app.post("/doPunish", router.doPunish)
app.post("/doPunishComment", router.doPunishComment)