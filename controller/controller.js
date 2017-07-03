/**
 * Created by Administrator on 2017/7/3.
 */
var formidable = require('formidable');
var ObjectID = require('mongodb').ObjectID
var operaDb = require("../model/operaDb.js");
var md5 = require("../model/md5.js");        //使用封装好的MD5加密函数

//首页
exports.showIndex = function (req, res, next) {

    operaDb.finddb("comment",function (err, result) {
        if(err){
            return;
        }

        operaDb.finddb("discuss", function (err, dis) {

            res.render("index",{
                "username":req.session.username,
                "isLogin":req.session.isLogin,
                "comment":result,
                "discuss":dis,
                "active":"index"
            })
        })


    })


}

//注册页面
exports.showRegister = function (req, res, next) {
    res.render("register",{
        "username":req.session.username,
        "isLogin":req.session.isLogin,
        "active":"register"
    })
}

//登录
exports.showLogin = function (req, res) {
    res.render("login",{
        "username":req.session.username,
        "isLogin":req.session.isLogin,
        "active":"login"
    })
}

//退出
exports.loginOut = function (req, res) {
    delete req.session.username;
    delete req.session.isLogin ;
    res.redirect("/")
}

//注册
exports.doRegister = function (req, res, next) {
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields) {
       var username = fields.username;
       var password = fields.password;
       password = md5(md5(password) + "ciyel");

       operaDb.finddb("user", {"usename":username}, function (err, result) {
           var checkMsg = {
               "success":false,
               "message":""
           };
           if(err){
               checkMsg.message = err;
               res.send(checkMsg)
               return
           }

           if(result.length !== 0){
               checkMsg.message = "该用户名已被注册";
               res.send(checkMsg)

               return
           }else{

               req.session.username = username;
               req.session.isLogin = true;
               operaDb.insertOne("user",{
                       "usename":username,
                       "password":password
                   },function (err, result) {

                       if(err){

                           checkMsg.message = err;
                           return
                       }else{
                           checkMsg.success = true;
                           res.send(checkMsg)
                       }
               })

           }

       })
    });
}


exports.doLogin = function (req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields) {
        var username = fields.username;
        var password = fields.password;
        password = md5(md5(password) + "ciyel");

        operaDb.finddb("user", {"usename":username}, function (err, result) {
            var checkMsg = {
                "success":false,
                "message":""
            };
            if(err){
                checkMsg.message = err;
                res.send(checkMsg)
                return
            }

            if(result.length == 0){
                checkMsg.message = "该用户不存在";
                res.send(checkMsg)

                return
            }else{

                req.session.username = username;
                req.session.isLogin = true;

                var dataPwd = result[0].password;      //数据库中的密码
                if(password == dataPwd){
                    checkMsg.success = true

                    res.send(checkMsg);  //登录成功
                }else{
                    checkMsg.message = "用户名或密码不正确！"
                    res.send(checkMsg); //密码不匹配
                }

            }

        })
    });
}

exports.doPunish = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err,fields) {
        var username = req.session.username;
        var content = fields.content;

        operaDb.insertOne("comment",{
            "username":username,
            "content":content
        }, function (err, result) {
            var checkMsg = {
                "success":false,
                "message":""
            };

            if(err){
                checkMsg.message = err;
                res.send(checkMsg)
                return;
            }else{
                checkMsg.success = true;
                res.send(checkMsg)
            }

        })
    })
}

exports.doPunishComment = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err,fields) {
        var commentId = fields.commentId;
        var content = fields.content;

        operaDb.insertOne("discuss",{
            "commentId":commentId,
            "content":content,
            "username":req.session.username
        }, function (err, result) {
            var checkMsg = {
                "success":false,
                "message":""
            };

            if(err){
                checkMsg.message = err;
                res.send(checkMsg)
                return;
            }else{
                checkMsg.success = true;
                res.send(checkMsg)
            }

        })
    })
}