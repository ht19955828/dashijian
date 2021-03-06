$(function() {
    // 调用函数，获取用户基本信息
    getUserInfo()
        // 退出按钮事件
    var layer = layui.layer
    $('#btnLogout').on('click', function() {
        // 提示用户是否退出
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            //do something
            // 1.清空本地出吹的token
            localStorage.removeItem('token')
                // 2. 重新跳转到登录页面
            location.href = './login.html'
            layer.close(index);
        })
    })
})

function getUserInfo() {
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        data: "data",
        // 请求头配置对象
        headers: {
            Authorization: localStorage.getItem('token') || ''
        },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message || '获取用户信息失败！')
            }
            renderAvatar(res.data)
        },
    });
}

// 渲染用户的头像
function renderAvatar(user) {
    // 1. 获取用户的名称
    var name = user.nickname || user.username
        // 2. 设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
        // 3. 按需渲染用户头像
    if (user.user_pic != null) {
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}