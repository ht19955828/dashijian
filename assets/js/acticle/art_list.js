$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;
    //定义时间的过滤器
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    //定义一个查询的参数对象.将请求数据的时候
    //需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //页码数.默认请求第一页数据
        pagesize: 2, //煤业显示寄条数据,默认每条显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    };

    //获取文章列表数据的方法
    initTable()

    // 获取文章列表数据的方法   渲染表单的数据
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {

                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面的数据

                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                console.log(res.total);
                randerPage(res.total)
            }
        })
    }
    initCate()

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)

                $('[name=cate_id]').html(htmlStr)
                    // 通过 layui 重新渲染表单区域的UI结构
                form.render()
            }
        })
    }
    //为筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault()
        var cate_id = $('[name="cate_id"]').val()
        var state = $('[name="state"]').val()
            //为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        alert('ownKeys')
            // 根据最新的筛选条件，重新渲染表格的数据
        initTable()
    });
    // 定义渲染分页的方法
    function randerPage(total) {
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10], // 每页展示多少条
            theme: '#c00',

            //分页发生回调,触发jump回调
            //触发jump回调的方式有2种
            //1.点击页码值的时候会触发jump回调
            //2.调用layrander 方法就会触发帐篷回调
            //可以通过first 的值 来判断是通过哪种方式触发的  如果first 的值为true 则是第2中方式触发的 如果为flase 则可以判断为第一种方式触发的

            jump: function(obj, first) {
                // console.log(obj.curr);

                // console.log(obj.limit); //得到每页显示的条数
                q.pagesize = obj.limit //把每页显示的条数赋值给q
                q.pagenum = obj.curr //把最新的页码值赋值给q
                    //因为我们只需要在点击换页的时候执行 所以我们只有在flase的情况下执行jump函数
                if (!first) {
                    initTable()
                }
            }
        })
    }

    $('tbody').on('click', '.btn-delete', function(e) {
        var id = $(this).attr('data-id')
        var len = $('.btn-delete').length
        console.log(len);
        layer.confirm('确定要删除此列吗?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')
                        //当数据删除完成后,需要判断当前这一页中.是否还有剩余的数据
                        //如果没有神域的数据了 则让页码值-1
                        //再调用initTabale()
                        //证明删除完毕之后页面上就没有数据了
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })

            layer.close(index);
        });
    })


})