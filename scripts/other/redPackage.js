$(function () {
    var redTime = null;
    $('#nav2').on('click',function () {
        $('.page').hide();
        $('#barrage-comment').hide();
        $('#commentBtn').hide();
        $('#redPackage-win').show();
        common.isOpenActivity({
            functionCode: 'REDPACKAGE',
        },function (res) {
            if (res.status == 1) {
                if (res.data == 0) {
                    $('#redPackage-start').html('开始');
                    $('#redPackage-start').attr('data-type','0');
                } else if (res.data == 1) {
                    $('#redPackage-start').html('结束');
                    $('#redPackage-start').attr('data-type','1');
                    common.getRedPackResult(function (res) {
                        if (res.status == 1) {
                            if (res.data != null) {
                                var lotteryList = res.data.lotteryList;
                                getRedPackResult(lotteryList);
                            }

                        } else {
                            clearInterval(redTime);
                            common.alert({
                                mask: true,
                                content: res.msg,
                                width: '300px',
                            })
                        }
                    });
                    redTime = setInterval(function () {
                        common.getRedPackResult(function (res) {
                            if (res.status == 1) {
                                if (res.data != null) {
                                    var lotteryList = res.data.lotteryList;
                                    getRedPackResult(lotteryList);
                                }
                            } else {
                                clearInterval(redTime);
                                common.alert({
                                    mask: true,
                                    content: res.msg,
                                    width: '300px',
                                })
                            }
                        })
                    },2000);
                } else {
                    $('#redPackage-start').html('开始');
                    $('#redPackage-start').attr('data-type','0');
                }
            }

        });
    });

    // 点击开始抢红包
    $('#redPackage-start').on('click',function () {
        var type = $(this).attr('data-type');
        if (type == 0) {
            $(this).attr('data-type','1');
            $(this).html('关闭');
            common.startRedPackage(function () {
                clearInterval(redTime);
                redTime = setInterval(function () {
                    common.getRedPackResult(function (res) {
                        if (res.status == 1) {
                            if (res.data != null) {
                                var lotteryList = res.data.lotteryList;
                                getRedPackResult(lotteryList);
                            }
                        } else {
                            clearInterval(redTime);
                            common.alert({
                                mask: true,
                                content: res.msg,
                                width: '300px',
                            })
                        }

                    })
                },2000)
            })
        } else {
            $(this).attr('data-type','0');
            $(this).html('开始');
            clearInterval(redTime);
            common.endRedPackage(function () {})
        }
    });
});


function getRedPackResult(lotteryList) {
    var lotteryListHtml = '';
    for (var i = 0; len = lotteryList.length,i < len; i++) {
        lotteryListHtml += '<div class="redPackage-con">';
        lotteryListHtml += '<div class="redPackage-title">' + lotteryList[i].lotteryItemName + '</div>';
        lotteryListHtml += '<div class="redPackage-list">';
        lotteryListHtml += '</div>';
        lotteryListHtml += '</div>';
    }

    $('.redPackage-list-wra').html(lotteryListHtml);

    for (var j = 0; le = lotteryList.length,j < le; j++) {
        var lotteryListItem = lotteryList[j].lotteryers;
        var findLotteryListHtml = '';
        for (var m = 0; m < lotteryListItem.length; m++) {
            findLotteryListHtml += '<div class="redPackage-item">';
            findLotteryListHtml += '<img class="redPackage-avatar" src="' + lotteryListItem[m].headImg + '" alt="">';
            findLotteryListHtml += '<div class="redPackage-name">' + lotteryListItem[m].nickname + '</div>';
            findLotteryListHtml += '</div>';
        }
        $('.redPackage-con').eq(j).find('.redPackage-list').html(findLotteryListHtml);
    }
}