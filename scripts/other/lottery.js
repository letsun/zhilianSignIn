$(function () {
    var notLotteryListInfor = {};
    var notLotteryList = [];
    var newNotLotteryList = [];
    var lotteryListResult = [];
    var count = '';
    $('#nav6').on('click',function () {
        $('.page').hide();
        $('#barrage-comment').hide();
        $('#commentBtn').hide();
        common.getNotLotteryList(function (res) {
            if (res.status == 1) {

                notLotteryList = res.data.notLotteryList;
                newNotLotteryList = notLotteryList;
                notLotteryListInfor['notLotteryList'] = newNotLotteryList;
                window.localStorage.setItem('notLotteryListInfor',JSON.stringify(notLotteryListInfor));
                var notLotteryListHtml = '';
                for (var i = 0; len = notLotteryList.length,i < len; i++) {
                    notLotteryListHtml += '<img class="avatar" src="' + notLotteryList[i].headImg + '" alt="">';
                }

                $('.lottery-list').html(notLotteryListHtml);
                $('.lottery-list').css({'width': (82 + 44) * notLotteryList.length - 44 + 'px'});
                $('#lottery').fadeIn();
                common.getLotteryItemList(function (res) {
                    var lotteryList = res.data.lotteryList;
                    var lotteryListHtml = '';
                    for (var i = 0; len = lotteryList.length,i < len; i++) {
                        lotteryListHtml += '<option value="">' + lotteryList[i].name + '</option>';
                    }
                    $('#form-select').html(lotteryListHtml);
                    $('.winning-award').html(lotteryList[0].name);
                })
            }
        });
    });

    // 选择奖项
    $('#form-select').on('change',function () {
        var awardValue = $(this).find("option:selected").text();
        $('.winning-award').html(awardValue);
    });

    var winnerTime1 = null;
    var aniTime = null;
    var winnerIndex = 0;
    var winnerListIndex = 0;
    var speed = 3500;
    var flag = true;

    // 点击开始抽奖
    $('#start-lottery').on('click',function () {
        winnerListIndex = 0;
        var lotteryItemName = $('#form-select option:selected').text();
        count = $('#form-input').val();
        var reg = /^[0-9]*$/;

        if ($.trim(count) == '') {
            common.alert({
                mask: true,
                content: '抽奖人数不能为空',
                width: '300px',
            });
            return;
        }
        if (!reg.test(count)) {
            common.alert({
                mask: true,
                content: '抽奖人数必须为数字',
                width: '300px',
            });
            return;
        }

        if (count - 0 == 0) {
            common.alert({
                mask: true,
                content: '抽奖人数必须大于0',
                width: '300px',
            });
            return;
        }

        if (flag) {
            flag = false;
            winnerTime1 = setInterval(lotteryTime,180);
            common.startLottery({
                count: count,
                lotteryItemName: lotteryItemName,
            },function (res) {
                if (res.status == 1) {
                    var lotteryList = res.data.lotteryList;
                    aniTime = setInterval(function (){
                        setTimeout(function () {
                            clearInterval(winnerTime1);
                            var notLotteryListHtml2 = '';
                            notLotteryList = JSON.parse(window.localStorage.getItem('notLotteryListInfor')).notLotteryList;
                            newNotLotteryList = notLotteryList;
                            for (var i = 0; i < notLotteryList.length; i++) {
                                if (notLotteryList[i].openid == lotteryList[winnerListIndex].openid) {
                                    newNotLotteryList.splice(i,1);
                                    notLotteryListInfor['notLotteryList'] = newNotLotteryList;
                                    window.localStorage.setItem('notLotteryListInfor',JSON.stringify(notLotteryListInfor));
                                    break;
                                }
                            }
                            newNotLotteryList = JSON.parse(window.localStorage.getItem('notLotteryListInfor')).notLotteryList;
                            for (var i = 0; i < newNotLotteryList.length; i++) {
                                notLotteryListHtml2 += '<img class="avatar" src="' + newNotLotteryList[i].headImg + '" alt="">';
                            }
                            $('.lottery-list').css({'left': 0}).html(notLotteryListHtml2);
                            $('.lottery-list').css({'width': (82 + 44) * newNotLotteryList.length - 44 + 'px','left' : 0});
                            $('.winning-avatar').attr('src',lotteryList[winnerListIndex].headImg);
                            $('.winning-nickname').html(lotteryList[winnerListIndex].nickname);
                            $('.winning-avatar').addClass('active');

                            winnerIndex = 0;
                            winnerListIndex ++;
                            setTimeout(function () {
                                $('.winning-avatar').removeClass('active').attr('src','');
                                $('.winning-nickname').html('');
                                common.getLotteryedList(function (red) {
                                    if (red.status == 1) {
                                        lotteryListResult = red.data.lotteryList;
                                        winnerTime1 = setInterval(lotteryTime,180);
                                        if (winnerListIndex == count) {
                                            clearInterval(winnerTime1);
                                            clearInterval(aniTime);
                                            newNotLotteryList = JSON.parse(window.localStorage.getItem('notLotteryListInfor')).notLotteryList;
                                            $('.lottery-list').css({'width': (82 + 44) * newNotLotteryList.length - 44 + 'px','left' : 0});
                                            var lotteryListHtml = '';
                                            for (var i = 0; len = lotteryListResult.length,i < len; i++) {
                                                lotteryListHtml += '<div class="winner-con">';
                                                lotteryListHtml += '<div class="winner-title winner-title1">' + lotteryListResult[i].lotteryItemName + '</div>';
                                                lotteryListHtml += '<div class="winner-list">';
                                                lotteryListHtml += '</div>';
                                                lotteryListHtml += '</div>';
                                            }

                                            $('.lottery-result').html(lotteryListHtml);

                                            for (var j = 0; le = lotteryListResult.length,j < le; j++) {
                                                var lotteryListItem = lotteryListResult[j].lotteryers;
                                                var findLotteryListHtml = '';
                                                for (var m = 0; m < lotteryListItem.length; m++) {
                                                    findLotteryListHtml += '<div class="winner-item">';
                                                    findLotteryListHtml += '<img class="avatar" src="'+ lotteryListItem[m].headImg + '" alt="">';
                                                    findLotteryListHtml += '<div class="nickname">'+ lotteryListItem[m].nickname + '</div>';
                                                    findLotteryListHtml += '</div>';
                                                }
                                                $('.winner-con').eq(j).find('.winner-list').html(findLotteryListHtml);
                                            }
                                            flag = true;
                                        }
                                    } else {
                                        clearInterval(winnerTime1);
                                        clearInterval(aniTime);
                                        newNotLotteryList = JSON.parse(window.localStorage.getItem('notLotteryListInfor')).notLotteryList;
                                        $('.lottery-list').css({'width': (82 + 44) * newNotLotteryList.length - 44 + 'px','left' : 0});
                                        common.alert({
                                            mask: true,
                                            content: res.msg,
                                            width: '300px',
                                        })
                                    }
                                });
                            },1500);
                        },1500)
                    },speed);
                } else {
                    clearInterval(winnerTime1);
                    clearInterval(aniTime);
                    common.alert({
                        mask: true,
                        content: res.msg,
                        width: '300px',
                    });
                }
            });
        } else {
            common.alert({
                mask: true,
                content: '抽奖还未结束，请等待结束后再开始抽奖',
                width: '300px',
            })
        }

    });

    function lotteryTime() {
        if (notLotteryList.length >= 2) {
            newNotLotteryList = JSON.parse(window.localStorage.getItem('notLotteryListInfor')).notLotteryList;
            winnerIndex++;
            if (winnerIndex >= notLotteryList.length - 2){
                $('.lottery-list').css("left", 0);
                winnerIndex = 1;
            }
            //移动
            $('.lottery-list').stop().animate({left:-winnerIndex * (82 + 44) + 'px'}, 160,'linear');
        } else {
            $('.lottery-list').css({'left': (82 + 44) + 'px'});
        }

    }
    
    // 点击重新抽奖
    $('#resetLottery-btn').on('click',function () {
        if (flag) {
            common.alert({
                dialog: true,
                mask: true,
                content: '您确定重新抽奖吗？重新抽奖将清空原来已中奖的数据',
                width: '500px',
                ok:function () {
                    clearInterval(winnerTime1);
                    clearInterval(aniTime);
                    common.repeatLottery(function (res) {
                        if (res.status == 1) {
                            $('.lottery-result').html('');
                            common.getNotLotteryList(function (res) {
                                if (res.status == 1) {
                                    notLotteryList = res.data.notLotteryList;
                                    notLotteryListInfor['notLotteryList'] = notLotteryList;
                                    window.localStorage.setItem('notLotteryListInfor',JSON.stringify(notLotteryListInfor));
                                    var notLotteryListHtml = '';
                                    for (var i = 0; len = notLotteryList.length,i < len; i++) {
                                        notLotteryListHtml += '<img class="avatar" src="' + notLotteryList[i].headImg + '" data-name="'+ notLotteryList[i].nickname +'" alt="">';
                                    }
                                    $('.lottery-list').html(notLotteryListHtml);
                                    $('.lottery-list').css({'width': (82 + 44) * notLotteryList.length - 44 + 'px','left' : 0});
                                    common.getLotteryItemList(function (res) {
                                        var lotteryList = res.data.lotteryList;
                                        var lotteryListHtml = '';
                                        for (var i = 0; len = lotteryList.length,i < len; i++) {
                                            lotteryListHtml += '<option value="">' + lotteryList[i].name + '</option>';
                                        }
                                        $('#form-select').html(lotteryListHtml);
                                        $('.winning-award').html(lotteryList[0].name);
                                    })
                                }
                            });
                        } else {
                            common.alert({
                                mask: true,
                                content: res.msg,
                                width: '300px',
                            })
                        }
                    })
                },
            });
        } else {
            common.alert({
                mask: true,
                content: '抽奖还未结束，请等待结束后再重新抽奖',
                width: '300px',
            })
        }

    })
});