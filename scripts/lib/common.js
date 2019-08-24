var common = {};

var timer = [];

(function ($) {
    // var baseUrl = "https://order.letsun.com.cn/";
    // var baseUrl = "http://letsun.ngrok.xiaomiqiu.cn/order/";
    //var baseUrl = "https://zp-gateway.ebiaoji.com/api-zpclound";
    var baseUrl = "https://job-api.ebiaoji.com/api-zpclound";
    common.cfg = {
        companyId: "48",
        openid: '',
        activityId: '',
        maxId: '',
        getOpenId: baseUrl + "/wap/wechat/getOpenId/",                           // 获取open id
        isJoinActivity: baseUrl + "/wap/activity/isJoinActivity/",               // 当前用户是否参与了活动
        getActivityList: baseUrl + "/wap/activity/getActivityList/",             // 获取活动列表
        doSign: baseUrl + "/wap/activity/doSign/",                               // 签到
        getSignRecord: baseUrl + "/pc/activity/getSignRecord/",                  // 获取签到信息
        startVote: baseUrl + "/pc/activity/startVote/",                          // 开始投票
        closeVote: baseUrl + "/pc/activity/closeVote/",                          // 关闭投票
        getVoteRecord: baseUrl + "/pc/activity/getVoteRecordNew/",               // 展示投票信息
        getVote: baseUrl + "/wap/activity/getVote/",                             // 获取投票选项
        doVote: baseUrl + "/wap/activity/doVote/",                               // 投票
        doComment: baseUrl + "/wap/activity/doComment/",                         // 评论
        getCommentRecord: baseUrl + "/pc/activity/getCommentRecord/",           // 展示评论信息
        startRedPackage: baseUrl + "/pc/activity/startRedPack/",             // 开启抢红包
        endRedPackage: baseUrl + "/pc/activity/closeRedPack/",                 // 结束抢红包
        getRedPackResult: baseUrl + "/pc/activity/getRedPackResult/",           // 获取中奖结果
        redpack: baseUrl + "/wap/activity/hitRedPack/",                             // 中红包
        startLottery: baseUrl + "/pc/activity/startLottery/",                   // 开始抽奖
        getLotteryedList: baseUrl + "/pc/activity/getLotteryedList/",           // 获取已经中奖的签到人员
        getLotteryItemList: baseUrl + "/pc/activity/getLotteryItemList/",       // 获取抽奖信息
        getNotLotteryList: baseUrl + "/pc/activity/getNotLotteryList/",         // 获取还未中奖的签到人员
        repeatLottery: baseUrl + "/pc/activity/repeatLottery/",                 // 重复抽奖
        doShake: baseUrl + "/wap/activity/doShake/",                             // 摇一摇
        getShakeRank: baseUrl + "/pc/activity/getShakeRank/",                   // 展示摇一摇排行
        startShake: baseUrl + "/pc/activity/startShake/",                       // 开始摇一摇
        closeShake: baseUrl + "/pc/activity/closeShake/",                       // 结束摇一摇
        getShake: baseUrl + "/pc/activity/getShake/",                            // 获取摇一摇活动
        getFormField: baseUrl + "/wap/formdata/getFormField/",                   // 获取字段
        submitData: baseUrl + "/wap/formdata/submitData/",                       // 提交资料
        isOpenActivity: baseUrl + "/wap/activity/isOpenActivity/",               // 是否开启活动
    };

    /**
     * @func common.alert()
     * @desc 弹框组件
     * @param cfg
     * @param cfg.title {string} 弹框标题，默认为没有标题
     * @param cfg.content {string} 弹框内容
     * @param cfg.width {string} 弹框宽度
     * @param cfg.dialog {boolean} 是否是对话框，默认为否
     * @param cfg.ok {function} 点击确定的回调函数
     * @param cfg.okValue {string} 确定按钮的文字，默认为确定
     * @param cfg.cancel {function} 点击取消的回调函数
     * @param cfg.cancelValue {string} 取消按钮的文字，默认为取消
     * @param cfg.textAlign {string} 文字方向，默认为居中
     * @param cfg.mask {boolean} 是否有遮罩层，默认为没有
     */
    common.alert = function (cfg) {
        //设置默认值
        var ok = cfg.ok || function () {
        };
        var okValue = cfg.okValue || "确定";
        var cancel = cfg.cancel || function () {
        };
        var cancelValue = cfg.cancelValue || "取消";
        var dialog = cfg.dialog || false;
        var textAlign = cfg.textAlign || "center";
        var width = cfg.width || "60%";

        //生成随机ID
        var id = Math.ceil(Math.random() * 1000000);

        var con = '<div class="alert" style="position: fixed;width: 100%;height: 100%;top: 0;left: 0;';

        //判断是否添加遮罩层
        if (cfg.mask) {
            con += 'background-color: rgba(0, 0, 0, 0.5);';
        }

        con += '-webkit-transition: ease-out 0.5s; -moz-transition: ease-out 0.5s;-ms-transition: ease-out 0.5s; -o-transition: ease-out 0.5s;' +
            'transition: ease-out 0.5s;z-index:999999999;opacity:0"><div style="position: absolute;top: 40%;left:50%;width: ' + width +
            ';background-color: #fff;border-radius: 10px;overflow: hidden;-webkit-transform: translate(-50%,-50%);-moz-transform: translate(-50%,-50%);' +
            '-ms-transform: translate(-50%,-50%); -o-transform: translate(-50%,-50%);transform: translate(-50%,-50%);box-shadow: 3px 3px 10px #666">';

        //判断是否有标题
        if (cfg.title) {
            con += '<div style="font-size: 24px;line-height: 60px;text-align: center;color: #60a0ff;">' + cfg.title + '</div>' +
                '<div style="font-size: 24px;color: #555;padding: 20px;line-height:30px;text-align:' + textAlign + ';border-bottom: 1px solid #ccc;' +
                'word-break:break-all;word-wrap:break-word;position:relative">' + cfg.content + '</div>';
        } else {
            con += '<div style="font-size: 24px;color: #555;padding: 40px 20px;line-height:30px;text-align:' + textAlign + ';border-bottom: 1px solid #ccc;' +
                'word-break:break-all;word-wrap:break-word;position:relative">' + cfg.content + '</div>';
        }

        //判断弹框类型，如果为对话框则显示确定和取消按钮
        if (dialog) {
            con += '<div><button style="width: 48%;height: 80px;border: none;background: none;font-size: 24px;padding: 0;outline: none" ' +
                'id="dCancel' + id + '">' + cancelValue + '</button><button style="width: 48%;height: 80px;border: none;background: none;' +
                'font-size: 24px;padding: 0;color: #60a0ff;outline: none;" id="dConfirm' + id + '">' + okValue + '</button></div></div>';
        } else {
            con += '<div><button style="width: 100%;height: 80px;border: none;background: none;font-size: 24px;' +
                'padding: 0;color: #60a0ff;outline: none;" id="dConfirm' + id + '">' + okValue + '</button></div></div></div>';
        }

        //向页面添加弹框
        $("body").append(con);

        //延时添加过渡效果
        setTimeout(function () {
            $(".alert").css("opacity", 1);
        }, 30);

        //取消按钮事件
        $("#dCancel" + id).on("click", function () {
            $(this).parents(".alert").remove();
            cancel();
        });

        //确定按钮事件
        $("#dConfirm" + id).on("click", function () {
            $(this).parents(".alert").remove();
            ok();
        });
    };

    /**
     * @desc 隐藏动画元素
     * @func common.hideEle()
     */
    common.hideEle = function () {
        $(".ani").hide();
    };

    /**
     * @desc 添加动画
     * @func common.animate()
     * @param ele {object} 需要添加动画的元素
     */
    common.animate = function (ele) {
        var num = 0;
        ele.each(function () {
            var self = $(this);
            timer[num] = setTimeout(function () {
                self.show();
                self.css({
                    "-webkit-animation": self.data("animate")
                });
            }, self.data("delay"));
            num++;
        });
    };

    /**
     * @desc 移除动画
     * @func common.removeAni()
     * @param ele {object} 需要移除动画的元素
     */
    common.removeAni = function (ele) {
        for (var i = 0; i < timer.length; i++) {
            clearTimeout(timer[i]);
        }
        ele.hide();
        ele.each(function () {
            var self = $(this);

            self.css({
                "-webkit-animation": "none"
            });
        });
    };

    /**
     * @desc 页面切换动画
     * @param p1 {object} 当前页
     * @param p2 {object} 下一页
     */
    common.turnPage = function (p1, p2) {
        p1.css("-webkit-animation", "fadeOut 1s");

        setTimeout(function () {
            p2.show();
            common.removeAni(p1.find(".ani"));
            p1.css("-webkit-animation", "none").hide();

            common.animate(p2.find(".ani"));
        }, 700);
    };

    /**
     * @desc 显示页面加载百分比
     * @param ele {Object} 显示百分比的元素
     */
    common.loading = function (ele) {
        var loadpicarray;
        var picloaded = 0;

        loadpicarray = document.getElementsByTagName("img");
        picloaded = 0;
        for (var i = 0; i < loadpicarray.length; i++) {
            var img = new Image();
            img.onload = function () {
                picloaded++;
                var lstr = Math.ceil(100 * picloaded / loadpicarray.length) + "%";
                $("#percent").html(lstr);
            };
            img.src = loadpicarray[i].src;
        }
    };

    /**
     * @desc 微信分享
     * @func common.wxShare()
     * @param cfg.title {String} 分享的标题
     * @param cfg.desc {String} 分享的描述
     * @param cfg.link {String} 分享的链接
     * @param cfg.imgUrl {String} 分享的图片链接
     * @param cfg.isStat {Boolean} 是否统计分享量
     */
    common.wxShare = function (cfg) {
        var reurl = window.location.href.split('#')[0];

        /**微信分享内容*/
        var shareData = {
            title: cfg.title,
            desc: cfg.desc,
            link: cfg.link,
            imgUrl: cfg.imgUrl,
            trigger: function (res) {
                //common.alert('用户点击发送给朋友');
            },
            success: function (res) {
                //分享成功
                if (cfg.isStat) {
                    addShareSumUrl(reurl);
                }
            },
            cancel: function (res) {
                //取消分享
            },
            fail: function (res) {
                //分享失败
            }
        };

        var isWxBrowser = wxJs.isWeixin();

        //微信浏览器登陆 先获取wxno  设置客户
        if (isWxBrowser) {
            //微信分享
            wx_Share(reurl, shareData);
        }
    };

    /**
     * @desc 分享量统计
     * @param url
     */
    function addShareSumUrl(url) {
        var shareUrl = common.cfg.shareStat + common.cfg.companyId;

        $.ajax({
            type: 'GET',
            url: shareUrl,
            dataType: 'jsonp',
            data: {
                url: url.split('?')[0],
                ts: (new Date()).getTime()
            },
            jsonp: 'addShareSumUrl',
            error: function (XmlHttpRequest, textStatus, errorThrown) {
                //alert("请求出错!");
            },
            success: function (msg) {
                if (msg.status == "true") {
                    //alert("请求提交成功!");
                } else {
                    //alert("处理出错!");
                }
            }
        });
    }

    /**
     * @desc 访问量统计
     * @func common.stat()
     */
    common.stat = function () {
        var url = common.cfg.totalStat + common.cfg.companyId;
        var reurl = window.location.href.split('#')[0];

        $.get(url, {
            type: 1,
            orgid: null,
            url: reurl.split('?')[0]
        }, function (data) {
            //console.log("访问量统计：" + data);
        }, "json");
    };


    /**
     * @desc 获取openid
     * @param isSilent {Number} 是否静默获取 1：是 0：否
     */
    common.getOpenid = function (isSilent) {
        var reurl = window.location.href.split('#')[0];
        var isWxBrowser = wxJs.isWeixin();

        var url = common.cfg.getOpenId + common.cfg.companyId + '?isSilent=' + isSilent + '&requestUrl=' + reurl;

        if (isWxBrowser) {
            common.cfg.openid = wxJs.getUrlParam("openid");
            if (!wxJs.checkMParam(common.cfg.openid)) {
                window.location.href = url;
            }
        }

        if (isSilent == 1) {
            common.cfg.nickname = wxJs.getUrlParam("nickname");
            common.cfg.headImg = wxJs.getUrlParam("headImg");

            common.cfg.nickname = decodeURI(escape(common.nickname));
        }
    };

    /**
     * @desc 当前用户是否参与活动
     * @param functionCode {string} 功能代码
     */
    common.isJoinActivity = function (functionCode,callback) {
        $.ajax({
            type: 'GET',
            url: common.cfg.isJoinActivity + common.cfg.companyId + '/' + common.cfg.activityId,
            data: {
                openid: common.cfg.openid,
                functionCode: functionCode,
            },
            success: function (res) {
                callback(res);
            },
            error: function (res) {
                common.alert({
                    mask:true,
                    content:res.msg,
                })
            },
        });
    };

    /**
     * @desc 获取活动列表
     */
    common.getActivityList = function (callback) {
        $.ajax({
            type: 'GET',
            url: common.cfg.getActivityList + common.cfg.companyId,
            success: function (res) {
                callback(res);
            },
            error: function (res) {

            },
        });
    };

    /**
     * @desc 签到
     */
    common.doSign = function (callback) {
        $.ajax({
            type: 'POST',
            url: common.cfg.doSign + common.cfg.companyId + '/' + common.cfg.activityId,
            data:{
                openid: common.cfg.openid
            },
            success: function (res) {
                callback(res);
            },
            error: function (res) {
                common.alert({
                    mask:true,
                    content:res.msg,
                })
            },
        });
    };

    /**
     * @desc 大屏幕展示签到信息
     */
    common.getSignRecord = function (limitCount,callback) {
        $.ajax({
            type: 'GET',
            url: common.cfg.getSignRecord + common.cfg.companyId + '/' + common.cfg.activityId,
            data:{
                maxId: common.cfg.maxId,
                limitCount: limitCount,
            },
            success: function (res) {
                callback(res);
            },
            error: function (res) {

            },
        });
    };

    /**
     * @desc 开启投票
     */
    common.startVote = function (callback) {
        $.ajax({
            type: 'GET',
            url: common.cfg.startVote + common.cfg.companyId + '/' + common.cfg.activityId,
            success: function (res) {
                callback(res);
            },
            error: function (res) {

            },
        });
    };


    /**
     * @desc 关闭投票
     */
    common.closeVote = function (callback) {
        $.ajax({
            type: 'GET',
            url: common.cfg.closeVote + common.cfg.companyId + '/' + common.cfg.activityId,
            success: function (res) {
                callback(res);
            },
            error: function (res) {

            },
        });
    };

    /**
     * @desc 展示投票信息
     */
    common.getVoteRecord = function (callback) {
        $.ajax({
            type: 'GET',
            url: common.cfg.getVoteRecord + common.cfg.companyId + '/' + common.cfg.activityId,
            success: function (res) {
                callback(res);
            },
            error: function (res) {

            },
        });
    };


    /**
     * @desc 获取投票选项
     */
    common.getVote = function (callback) {
        $.ajax({
            type: 'GET',
            url: common.cfg.getVote + common.cfg.companyId + '/' + common.cfg.activityId,
            success: function (res) {
                callback(res);
            },
            error: function (res) {

            },
        });
    };

    /**
     * @desc 投票
     */
    common.doVote = function (voteData,callback) {
        $.ajax({
            type: 'POST',
            url: common.cfg.doVote + common.cfg.companyId + '/' + common.cfg.activityId,
            data:voteData,
            success: function (res) {
                callback(res);
            },
            error: function (res) {

            },
        });
    };

    /**
     * @desc 评论
     */
    common.doComment = function (doCommentData,callback) {
        $.ajax({
            type: 'POST',
            url: common.cfg.doComment + common.cfg.companyId + '/' + common.cfg.activityId,
            data:doCommentData,
            success: function (res) {
                callback(res);
            },
            error: function (res) {

            },
        });
    };

    /**
     * @desc 展示评论信息
     */
    common.getCommentRecord = function (commentRecordData,callback) {
        $.ajax({
            type: 'GET',
            url: common.cfg.getCommentRecord + common.cfg.companyId + '/' + common.cfg.activityId,
            data:commentRecordData,
            success: function (res) {
                callback(res);
            },
            error: function (res) {

            },
        });
    };

    /**
     * @desc 开启抢红包
     */
    common.startRedPackage = function (callback) {
        $.ajax({
            type: 'POST',
            url: common.cfg.startRedPackage + common.cfg.companyId + '/' + common.cfg.activityId,
            success: function (res) {
                callback(res);
            },
            error: function (res) {

            },
        });
    };

    /**
     * @desc 结束抢红包
     */
    common.endRedPackage = function (callback) {
        $.ajax({
            type: 'POST',
            url: common.cfg.endRedPackage + common.cfg.companyId + '/' + common.cfg.activityId,
            success: function (res) {
                callback(res);
            },
            error: function (res) {

            },
        });
    };

    /**
     * @desc 中红包
     */
    common.redpack = function (redpackData,callback) {
        $.ajax({
            type: 'POST',
            url: common.cfg.redpack + common.cfg.companyId + '/' + common.cfg.activityId,
            data:redpackData,
            success: function (res) {
                callback(res);
            },
            error: function (res) {

            },
        });
    };

    /**
     * @desc 获取中奖结果
     */
    common.getRedPackResult = function (callback) {
        $.ajax({
            type: 'GET',
            url: common.cfg.getRedPackResult + common.cfg.companyId + '/' + common.cfg.activityId,
            success: function (res) {
                callback(res);
            },
            error: function (res) {

            },
        });
    };

    /**
     * @desc 开始抽奖
     */
    common.startLottery = function (startLotteryData,callback) {
        $.ajax({
            type: 'POST',
            url: common.cfg.startLottery + common.cfg.companyId + '/' + common.cfg.activityId,
            data:startLotteryData,
            success: function (res) {
                callback(res);
            },
            error: function (res) {

            },
        });
    };

    /**
     * @desc 获取已经中奖的签到人员
     */
    common.getLotteryedList = function (callback) {
        $.ajax({
            type: 'GET',
            url: common.cfg.getLotteryedList + common.cfg.companyId + '/' + common.cfg.activityId,
            success: function (res) {
                callback(res);
            },
            error: function (res) {

            },
        });
    };

    /**
     * @desc 获取抽奖信息
     */
    common.getLotteryItemList = function (callback) {
        $.ajax({
            type: 'GET',
            url: common.cfg.getLotteryItemList + common.cfg.companyId + '/' + common.cfg.activityId,
            success: function (res) {
                callback(res);
            },
            error: function (res) {

            },
        });
    };

    /**
     * @desc 获取还未中奖的签到人员
     */
    common.getNotLotteryList = function (callback) {
        $.ajax({
            type: 'GET',
            url: common.cfg.getNotLotteryList + common.cfg.companyId + '/' + common.cfg.activityId,
            success: function (res) {
                callback(res);
            },
            error: function (res) {
                common.alert({
                    mask: true,
                    content: res.msg,
                })
            },
        });
    };

    /**
     * @desc 重新抽奖
     */
    common.repeatLottery = function (callback) {
        $.ajax({
            type: 'POST',
            url: common.cfg.repeatLottery + common.cfg.companyId + '/' + common.cfg.activityId,
            success: function (res) {
                callback(res);
            },
            error: function (res) {

            },
        });
    };

    /**
     * @desc 摇一摇
     */
    common.doShake = function (doShakeData,callback) {
        $.ajax({
            type: 'POST',
            url: common.cfg.doShake + common.cfg.companyId + '/' + common.cfg.activityId,
            data:doShakeData,
            success: function (res) {
                callback(res);
            },
            error: function (res) {

            },
        });
    };

    /**
     * @desc 展示摇一摇排行
     */
    common.getShakeRank = function (callback) {
        $.ajax({
            type: 'GET',
            url: common.cfg.getShakeRank + common.cfg.companyId + '/' + common.cfg.activityId,
            success: function (res) {
                callback(res);
            },
            error: function (res) {

            },
        });
    };

    /**
     * @desc 开始摇一摇
     */
    common.startShake = function (callback) {
        $.ajax({
            type: 'GET',
            url: common.cfg.startShake + common.cfg.companyId + '/' + common.cfg.activityId,
            success: function (res) {
                callback(res);
            },
            error: function (res) {

            },
        });
    };

    /**
     * @desc 结束摇一摇
     */
    common.closeShake = function (callback) {
        $.ajax({
            type: 'GET',
            url: common.cfg.closeShake + common.cfg.companyId + '/' + common.cfg.activityId,
            success: function (res) {
                callback(res);
            },
            error: function (res) {

            },
        });
    };

    /**
     * @desc 获取摇一摇活动
     */
    common.getShake = function (callback) {
        $.ajax({
            type: 'GET',
            url: common.cfg.getShake + common.cfg.companyId + '/' + common.cfg.activityId,
            success: function (res) {
                callback(res);
            },
            error: function (res) {

            },
        });
    };

    /**
     * @desc 获取字段
     */
    common.getFormField = function (callback) {
        $.ajax({
            type: 'GET',
            url: common.cfg.getFormField + common.cfg.companyId,
            success: function (res) {
                callback(res);
            },
            error: function (res) {

            },
        });
    };

    /**
     * @desc 提交资料
     */
    common.submitData = function (submitData,callback) {
        $.ajax({
            type: 'POST',
            url: common.cfg.submitData + common.cfg.companyId + '/' + common.cfg.activityId,
            contentType: 'application/json',
            data:submitData,
            success: function (res) {
                callback(res);
            },
            error: function (res) {

            },
        });
    };


    /**
     * @desc 是否开启活动
     */
    common.isOpenActivity = function (isOpenActivityData,callback) {
        $.ajax({
            type: 'GET',
            url: common.cfg.isOpenActivity + common.cfg.companyId + '/' + common.cfg.activityId,
            data:isOpenActivityData,
            success: function (res) {
                callback(res);
            },
            error: function (res) {

            },
        });
    };

})(jQuery);