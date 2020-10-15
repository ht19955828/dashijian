// 1.1 获取裁剪区域的 DOM 元素
var $image = $('#image')
    // 1.2 配置选项
const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
}

// 1.3 创建裁剪区域
$image.cropper(options)
$('#btnChooseImage').on('click', function() {
        $('#file').click()

    })
    //监听coverFile的change事件
$('#file').on('change', function(e) {
    //获取到文件的列表数据
    var filelist = e.target.files
        //判断用户是否选择了文件
    if (filelist.length === 0) {
        return layer.msg('请选择图片!')
    }
    //文件转化为路径
    var file = e.target.files[0];
    //根据文件,创建对应的URL地址
    var imgURL = URL.createObjectURL(file);
    //为裁剪区重新设置图片
    $image
        .cropper('destroy') // 销毁旧的裁剪区域
        .attr('src', imgURL) // 重新设置图片路径
        .cropper(options) // 重新初始化裁剪区域
})
$('#btnUpload').on('click', function() {
    var dataURL = $image
        .cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 100,
            height: 100
        })
        .toDataURL('image/png')
    $.ajax({
        method: 'POST',
        url: '/my/update/avatar',
        data: {
            avatar: dataURL
        },
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg('更换头像失败！')
            }
            layer.msg('更换头像成功！')
            window.parent.getUserInfo()
        }
    })






})