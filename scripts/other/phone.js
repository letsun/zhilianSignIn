var voteCheckedArr = [];
var time = 0;
var rockNum = 0;
var shakeNum = 0;
var shakeInt = null;
var fieldList = [];
$(function () {
    /**
     * 摇一摇相关
     */
    var shakeThreshold = 2000;//定义一个摇动的阈值
    var lastTime = 0;//定义一个变量记录上一次摇动的时间
    var x = 0,   //定义x、y、z记录三个轴的数据以及上一次触发的时间
        y = 0,
        z = 0,
        last_x = 0,
        last_y = 0,
        last_z = 0;

    var shakeThreshold2 = 1500;//定义一个摇动的阈值
    var lastTime2 = 0;//定义一个变量记录上一次摇动的时间
    var x2 = 0,   //定义x、y、z记录三个轴的数据以及上一次触发的时间
        y2 = 0,
        z2 = 0,
        last_x2 = 0,
        last_y2 = 0,
        last_z2 = 0;

    var yes1 = new Audio();
    var yes2 = new Audio();
    wx.config({
        debug:false,
        appId:'',
        timestamp:1,
        nonceStr:'',
        signature:'',
        jsApiList:[]
    });

    if (yes1) {
        yes1.src = "../audio/suc.mp3";
        yes2.src = "../audio/suc2.mp3";
    }
    wx.ready(function(){
        yes1.play();
        yes1.pause();
        yes2.play();
        yes2.pause();
    });


    common.getOpenid(1);
    if (common.cfg.headImg) {
        $('.avator').find('img').attr('src',common.cfg.headImg).css('display','block');
    }

    common.getActivityList(function (res) {
        if (res.status == 1) {
            common.cfg.activityId = res.data.activityList[0].id;

            common.getShake(function (res) {
                if (res.status == 1) {
                    if (res.data != null) {
                        time = res.data.keepTime;
                    }
                }

            });
        }
    });

    // 输入框失去焦点兼容苹果系统
    $('#container').on('blur','input,textarea,select',function(){
        setTimeout(function () {
            var hasFocus = $('input').is(':focus') || $('textarea').is(':focus') || $('select').is(':focus');
            if (!hasFocus) {
                window.scroll(0,0);
            }
        },100);
    });


    // 点击签到按钮
    $('.sign-btn').on('click',function () {
        common.getFormField(function (res) {
            if (res.status == 1) {
                fieldList = res.data.companyFieldVos;
                var isOpenFormSubmit = res.data.isOpenFormSubmit;
                if (isOpenFormSubmit == 1) {
                    var html = '';
                    for (var i = 0; len = fieldList.length, i < len; i++) {
                        if (fieldList[i].isRequired == 1) {
                            if (fieldList[i].fieldReg == 'isMobile') {
                                html += ' <div class="form-item">';
                                html += '<input type="text" class="form-input" maxlength="100" data-code="' + fieldList[i].fieldCode + '" data-name="' + fieldList[i].fieldName + '" placeholder="请输入'+ fieldList[i].fieldName +'" data-validateInfor="{strategy:isEmpty,msg:'+ fieldList[i].fieldName +'不能为空}|{strategy:'+ fieldList[i].fieldReg + ',msg:' + fieldList[i].fieldName + '格式不正确}">';
                                html += '</div>';
                            } else {
                                html += ' <div class="form-item">';
                                html += '<input type="text" class="form-input" maxlength="100" data-code="' + fieldList[i].fieldCode + '" data-name="' + fieldList[i].fieldName + '" placeholder="请输入'+ fieldList[i].fieldName +'" data-validateInfor="{strategy:isEmpty,msg:'+ fieldList[i].fieldName +'不能为空}">';
                                html += '</div>';
                            }
                        } else {
                            html += ' <div class="form-item">';
                            html += '<input type="text" class="form-input" maxlength="100" data-code="' + fieldList[i].fieldCode + '" data-name="' + fieldList[i].fieldName + '" placeholder="请输入'+ fieldList[i].fieldName +'">';
                            html += '</div>';
                        }
                    }

                    $('#input-wra').html(html);
                    $('#sign-win').fadeIn(function () {
                        scrollSign.refresh();
                    });
                } else {
                    common.isJoinActivity('SIGN',function (res) {
                        if (res.status == 1) {

                            if (res.data.isJoin == 1) {
                                $('#sign-win').hide();
                                common.alert({
                                    mask:true,
                                    content:'您已签到，不能重复签到',
                                })
                            } else {
                                common.doSign(function (res) {
                                    if (res.status == 1) {
                                        $('#sign-win').hide();
                                        $('#sign-success').fadeIn();
                                    } else {
                                        common.alert({
                                            mask:true,
                                            content:res.msg,
                                        })
                                    }
                                })
                            }
                        }
                    })
                }

            }
        });
    });

    var flag = true;
    // 点击提交签到
    $('#sign-submit').on('click',function () {
        var res = Global.initValidate('#sign-win');
        if (!res) {
            return;
        }

        var formDatas = [];
        var formItem = $('.form-input');
        formItem.each(function (i,item) {
            var obj = {};
            obj['fieldCode'] = $(item).attr('data-code');
            obj['fieldName'] = $(item).attr('data-name');
            obj['fieldValue'] = $(item).val();
            formDatas.push(obj);
        });

        var submitDatas = {
            formDatas: formDatas,
            openid: common.cfg.openid,
        };
        if (flag) {
            flag = false;

            setTimeout(function () {
                flag  = true;
            },3000);
        }
        common.isJoinActivity('SIGN',function (res) {
            console.log(res);

            if (res.status == 1) {

                if (res.data.isJoin == 1) {
                    common.alert({
                        mask:true,
                        content:'您已签到，不能重复签到',
                        ok:function () {
                            $('#sign-win').hide();
                        }
                    })
                } else {
                    common.submitData(JSON.stringify(submitDatas),function (res) {
                        if (res.status == 1) {
                            common.doSign(function (res) {
                                if (res.status == 1) {
                                    $('#sign-win').hide();
                                    $('#sign-success').fadeIn();
                                } else {
                                    common.alert({
                                        mask:true,
                                        content:res.msg,
                                    })
                                }
                            })
                        } else {
                            common.alert({
                                mask:true,
                                content:res.msg,
                            })
                        }
                    });

                }
            }
        })
    });

    // 关闭签到弹窗
    $('#sign-close').on('click',function () {
        $('#sign-win').fadeOut();
    });

    // 关闭签到成功弹窗
    $('#success-close').on('click',function () {
        $('#sign-success').fadeOut();
    });

    // 点击打开投票弹窗
    $('.vote-btn').on('click',function () {
        common.isOpenActivity({
            functionCode: 'VOTE',
        },function (res) {
            console.log(res);
            if (res.data == 0) {
                $('#activity-start').fadeIn();
            } else if (res.data == 2) {
                $('#activity-start').fadeIn();
            } else {
                common.getVote(function (res) {
                    if (res.status == 1) {
                        var voteList = res.data.voteList[0].activityVoteItemVos;
                        var html = '';
                        var title = res.data.voteList[0].voteName;
                        for (var i = 0; len = voteList.length, i < len; i++) {
                            html += '<div class="formRow" data-id="' + voteList[i].voteItemId + '">';
                            html += '<span class="select">' + voteList[i].name + '</span>';
                            html += '<div class="line"></div>';
                            html += '<div class="select-item">';
                            html += '<img class="select-img select-old" src="../images/phone/8_1.png" alt="">';
                            html += '<img class="select-img select-new" src="../images/phone/8_2.png" alt="">';
                            html += '</div>';
                            html += '</div>';
                        }
                        $('#questionSelect').html(html);
                        $('#questionTitle').html(title);
                        $('#vote').fadeIn(function () {
                            scrollWra.refresh();
                        });
                    }
                });
            }
        })
    });

    // 点击投票选项
    $('.vote-con').on('click','.formRow',function () {
        var id = $(this).attr('data-id');
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            for (var i = 0; i < voteCheckedArr.length; i++) {
                if (id == voteCheckedArr[i]) {
                    voteCheckedArr.splice(i,1);
                }
            }
        } else {
            if (voteCheckedArr.length < 3) {
                $(this).addClass('active');
                voteCheckedArr.push(id);
            } else {
                common.alert({
                    mask:true,
                    content:'最多只能选择3个选项'
                })
            }
        }

    });

    // 点击关闭投票弹窗
    $('#close-vote').on('click',function () {
        voteCheckedArr = [];
        $('#vote').fadeOut();
    });


    // 点击提交投票
    $('#submitVote').on('click',function () {
        if (voteCheckedArr.length <= 0) {
            common.alert({
                mask: true,
                content: '请选择投票选项'
            })
        } else {
            common.doVote({
                openid: common.cfg.openid,
                voteItemId: voteCheckedArr.join(','),
            },function (res) {
                if (res.status == 1) {
                    voteCheckedArr = [];
                    $('#vote').hide();
                    $('#sign-success').fadeIn();
                } else {
                    common.alert({
                        mask:true,
                        content: res.msg,
                    })
                }
            })

        }
    });


    // 点击留言按钮
    $('.speak-btn').on('click',function () {
        $('#speak').fadeIn();
    });

    // 点击提交留言
    $('#submitSpeak').on('click',function () {
        var content = $('#comment').val();

        if ($.trim(content) == '') {
            common.alert({
                mask: true,
                content: '请填写评论',
            });
            return;
        }
        common.doComment({
            openid: common.cfg.openid,
            content: content,
        },function (res) {
            if (res.status == 1) {
                $('#comment').val('');
                $('#speak').hide();
                $('#sign-success').fadeIn();
            } else {
                common.alert({
                    mask: true,
                    content: res.msg,
                });
            }

        })
    });

    // 点击关闭留言
    $('#close-speak').on('click',function () {
        $('#speak').fadeOut();
    });

    // 点击关闭红包弹窗
    $('#redPack-confirm').on('click',function () {
        $('#redPack-win').fadeOut();
    });


    // 点击关闭活动结束弹窗
    $('#activity-end-btn').on('click',function () {
        $('#activity-ends').fadeOut();
    });

    // 点击关闭活动结束弹窗
    $('#activity-start-btn').on('click',function () {
        $('#activity-start').fadeOut();
    });

    // 点击摇一摇
    $('.shake-btn').on('click',function () {
        common.isOpenActivity({
            functionCode: 'SHAKE',
        },function (res) {
            if (res.status == 1) {
                if (res.data == 0) {
                    $('#activity-start').fadeIn();
                } else if (res.data == 1) {
                    $('#shake').fadeIn(function () {
                        shakeInt = setInterval(function() {
                            if (window.DeviceMotionEvent) {
                                window.addEventListener('devicemotion', rock);
                            } else {
                                alert('你的设备不支持DeviceMotion事件');
                            }

                            common.isOpenActivity({
                                functionCode: 'SHAKE',
                            },function (res) {
                                if (res.data == 0) {
                                    rockNum = 0;
                                    clearInterval(shakeInt);
                                    window.removeEventListener('devicemotion',rock);
                                    $("#shake").hide();
                                    $('#activity-ends').fadeIn();
                                } else {
                                    common.doShake({
                                        count: rockNum,
                                        openid: common.cfg.openid,
                                    },function (res) {

                                    });
                                }
                            });
                        },1000);
                    });
                } else {
                    $('#activity-start').fadeIn();
                }
            } else {
                common.alert({
                    mask: true,
                    content: res.msg,
                })
            }
        })

    });

    // 关闭摇一摇
    $('#shake-close').on('click',function () {
        clearInterval(shakeInt);
        $('#shake').fadeOut();
    });


    /**
     * 摇一摇事件
     */
    function rock(event) {
        //rockNum = 0;

        //获取重力加速
        var acceleration = event.accelerationIncludingGravity;

        var curTime = new Date().getTime();//获取当前时间戳
        var diffTime = curTime - lastTime;//获取摇动的间隔

        if (diffTime > 100) {
            lastTime = curTime;//记录上一次摇动的时间
            x = acceleration.x;//获取加速度X方向
            y = acceleration.y;//获取加速度Y方向
            z = acceleration.z;//获取加速度垂直方向

            var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;//计算阈值

            if (speed > shakeThreshold) {
                rockNum++;
            }
            //记录上一次加速度
            last_x = x;
            last_y = y;
            last_z = z;
        }
    }

    /**
     * 摇一摇事件
     */
    function rock2(event) {
        //rockNum = 0;

        //获取重力加速
        var acceleration = event.accelerationIncludingGravity;

        var curTime = new Date().getTime();//获取当前时间戳
        var diffTime = curTime - lastTime2;//获取摇动的间隔

        if (diffTime > 100) {
            lastTime2 = curTime;//记录上一次摇动的时间
            x2 = acceleration.x;//获取加速度X方向
            y2 = acceleration.y;//获取加速度Y方向
            z2 = acceleration.z;//获取加速度垂直方向

            var speed = Math.abs(x2 + y2 + z2 - last_x2 - last_y2 - last_z2) / diffTime * 10000;//计算阈值

            if (speed > shakeThreshold2) {
                yes1.play();
                shakeNum++;
                if(shakeNum > 5) {
                    window.removeEventListener('devicemotion', rock2);
                    yes1.pause();
                    yes2.play();
                    common.redpack({
                        openid: common.cfg.openid,
                    },function (res) {
                        $('#shake').hide();
                        if (res.status == 1) {
                            if (res.data.isLottery == 1) {
                                $('.redPack-title').html('恭喜您获得');
                                $('.dec').hide();
                                if (res.data.lotteryType == 1) {
                                    $('.dec1').find('.num').find('span').html(res.data.amount);
                                    $('.dec1').show();
                                } else {
                                    $('.dec2').find('.name').html(res.data.lotteryName);
                                    $('.dec2').show();
                                }
                            } else {
                                $('.redPack-title').html('很遗憾');
                                $('.dec3').find('.name').html('您未中奖');
                                $('.dec').hide();
                                $('.dec3').show();
                            }
                            $('#redPack-win').fadeIn();
                        } else {
                            common.alert({
                                mask: true,
                                content: res.msg,
                            })
                        }
                    })
                }
            }
            //记录上一次加速度
            last_x2 = x2;
            last_y2 = y2;
            last_z2 = z2;
        }
    }
    
    // 点击抢红包按钮
    $('.redpack-btn').on('click',function () {
        common.isOpenActivity({
            functionCode: 'REDPACKAGE',
        },function (res) {
            if (res.status == 1) {
                if (res.data == 1) {
                    common.isJoinActivity('REDPACKAGE',function (res) {
                        if (res.status == 1) {
                            if (res.data.isJoin == 1) {
                                $('.redPack-title').html('很遗憾');
                                $('.dec3').find('.name').html('您已抽过奖');
                                $('.dec').hide();
                                $('.dec3').show();
                                $('#redPack-win').fadeIn();
                            } else {
                                $('#shake').fadeIn(function () {
                                    if (window.DeviceMotionEvent) {
                                        window.addEventListener('devicemotion', rock2);
                                    } else {
                                        alert('你的设备不支持DeviceMotion事件');
                                    }
                                });

                            }
                        }
                    });

                } else {
                    $('#activity-start').fadeIn();
                }
            }
        })
    })
});