$(function () {
    var keepTime = 0;
    $('#nav5').on('click',function () {
        $('.page').hide();
        $('#barrage-comment').hide();
        $('#commentBtn').hide();
        $('#shake-win').fadeIn();

        common.getShake(function (res) {
            if (res.status == 1) {
                keepTime = res.data.keepTime;
                $('.box-time').html(keepTime);
            } else {
                common.alert({
                    mask: true,
                    content: res.msg,
                    width: '300px',
                })
            }
        })
    });

    /**
     * @desc 点击开启摇一摇
     */
    $(".remain-btn").on("click", function () {
        if (!$(this).hasClass('active')) {
            $(this).addClass('active');
            common.startShake(function (res) {});
            remainFuc(keepTime);
        }
    });

    /**
     * @desc 倒计时函数
     */
    function remainFuc(time) {
        var interval = setInterval(function() {
            time --;

            if(time < 10) {
                time = "0" + time;
            }
            $(".box-time").html(time);
            common.getShakeRank(function (res) {
                if (res.status == 1) {
                    var shakeList = res.data.shakeList;
                    var limitTop = res.data.limitTop;
                    var html = '';
                    for (var i = 0; len = shakeList.length,i < len; i++) {
                        if (i <= limitTop - 1) {
                            html += '<div class="line line1">';
                            html += '<div class="count">' + shakeList[i].count + '</div>';
                            html += '<img class="avatar" src="' + shakeList[i].headImg + '" alt="">';
                            html += '<div class="line-bg1"></div>';
                            html += '<div class="line-bg2"></div>';
                            html += '</div>';
                        }
                    }
                    $('.line-wra').html(html);
                    $('.line').each(function (i,item) {
                        var left = parseInt(shakeList[i].count * 8);
                        if (left >= 642) {
                            left = 642;
                        }
                        $(item).find('.avatar').css({'left': left + 'px'});
                        $(item).find('.line-bg2').css({'width': left + 'px'});
                    })
                } else {
                    clearInterval(interval);
                    $(".remain-btn").html('开启摇一摇').removeClass('active');
                    $('.box-time').html();
                    common.getShake(function (res) {
                        keepTime = res.data.keepTime;
                        $('.box-time').html(keepTime);
                    });
                    common.alert({
                        mask: true,
                        content: res.msg,
                        width: '300px',
                    })
                }


            });

            if(time <= 0) {
                time = "00";
                clearInterval(interval);
                $(".remain-btn").html('开启摇一摇').removeClass('active');
                common.closeShake(function (res) {

                });
            }
        },1000);
    }



});