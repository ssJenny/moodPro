/**
 * Created by Administrator on 2017/7/3.
 */

$("#punish").click(function () {
    if($("#content").val() == ""){

        $("#content").focus()
    }else {
        $.post("/doPunish",{
            "content": $("#content").val()

        },function(result){
            console.log(result)
            if(result.success){
                location = "/";
            }else{
                $("#punishError").text(result.message).fadeIn();
            }

        })
    }

})

$(".punishComment").click(function () {
    var commentId = $(this).attr("data-commentid")
    var content = $(this).parent().prev().val();
    console.log(commentId)
    console.log($("#"+commentId))
    if(content == ""){
        $(this).parent().prev().focus();
    }else{
        $.post("/doPunishComment",{
            "commentId":commentId,
            "content": content


        },function(result){
            console.log(result)
            if(result.success){
                location = "/";
            }else{
                $("#"+commentId).text(result.message).fadeIn();
            }

        })
    }


})