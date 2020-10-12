$(function () {
    // 点击去注册账号的链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    });
    //点击去登录账号的链接
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    });

    // 从layui中解构form对象
    // const { form: form } = layui; 取别名解构
    const { form, layer } = layui;
    // const { layer } = layui;
    // 通过form.verify() 自定义校验规则
    form.verify({
        // 自定义了 pwd 校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验两次密码是否一致的规则
        repwd: function (value) {
            // 通过形参拿到的确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败,则return一个提示消息
            var pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致';
            }
        },
    });
    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        let data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val(),
        };
        $.post('/api/reguser', data, function (res) {
            if (res.status != 0) {
                // return console.log(res.message);
                return layer.msg(res.message);
            }
            // console.log('注册成功');
            layer.msg('注册成功');
            // 模拟点击行为,注册成功后点击
            $('#link_login').click();
        });
    });
    // 登录表单提交事件
    $('#form_login').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败');
                }
                layer.msg('登录成功！');
                // 将登录成功得到的字符串token 保存到LocalStorage中
                localStorage.setItem('token', res.token);
                // 跳转页面
                location.href = './index.html';
            },
        });
    });
});
