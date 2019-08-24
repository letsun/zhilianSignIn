$(function () {

    var voteTimer = null;
    var time = 2000;

    common.getActivityList(function (res) {
        if (res.status == 1) {
            common.cfg.activityId = res.data.activityList[0].id;
            common.getVote(function (res) {
                if (res.status == 1) {
                    if (res.data != null) {
                        var html = '';
                        var total = 0;
                        var voteName = res.data.voteList[0].voteName;
                        var voteId = res.data.voteList[0].voteId;
                        var voteList = res.data.voteList[0].activityVoteItemVos;
                        var width = parseInt(780 / voteList.length);
                        for (var i = 0; i < voteList.length; i++) {
                            html += '<div class="select-box"><div class="selectNum">';
                            html += '<div id="s' + voteList[i].voteItemId + '" class="length">';
                            html += '<span>0</span>';
                            html += '</div>';
                            html += '</div>';
                            html += '<div class="selectName">' + voteList[i].name + '</div>';
                            html += '</div>';

                        }
                        $("#voteTitle").html(voteName);
                        $("#voteSelect").html(html);
                        $('.select-box').css({'width': width + 'px'});
                        $('.select-box').find('span').css({'width': width + 'px','right': - (width - 14) / 2 + 'px'});
                    }
                } else {
                    common.alert({
                        mask: true,
                        content: res.msg,
                        width: '300px',
                    })
                }

            })
        }
    });


    $('#nav3').on('click',function () {
        $('.page').hide();
        $('#commentBtn').hide();
        $('#barrage-comment').hide();
        $('#vote').fadeIn();
        common.isOpenActivity({
            functionCode: 'VOTE',
        },function (res) {
            if (res.data == 0) {
                $('#voteBtn').html('开启投票');
                $('#voteBtn').attr('data-type','0');
            } else if (res.data == 1) {
                $('#voteBtn').html('关闭投票');
                $('#voteBtn').attr('data-type','1');
            } else {
                $('#voteBtn').html('开启投票');
                $('#voteBtn').attr('data-type','0');
            }

            voteTimer = setInterval(function () {
                common.getVoteRecord(function (res) {
                    if (res.status == 1) {
                        if (res.data.length > 0) {
                            var voteName = res.data[0].voteName;
                            var voteId = res.data[0].voteId;
                            var voteRecordList = res.data[0].voteRecordList;
                            var width = parseInt(780 / voteRecordList.length);
                            var html = '';
                            var total = 0;
                            for (var i = 0; i < voteRecordList.length; i++) {
                                total += voteRecordList[i].count;
                                html += '<div class="select-box"><div class="selectNum">';
                                html += '<div id="s' + voteRecordList[i].voteItemId + '" class="length">';
                                html += '<span>' + voteRecordList[i].count + '</span>';
                                html += '</div>';
                                html += '</div>';
                                html += '<div class="selectName">' + voteRecordList[i].voteItemName + '</div>';
                                html += '</div>';

                            }
                            $("#voteTitle").html(voteName);
                            $("#voteSelect").html(html);
                            $('.select-box').css({'width': width + 'px'});
                            $('.select-box').find('span').css({'width': width + 'px','right': - (width - 14) / 2 + 'px'});
                            $('.length').each(function (i,item) {
                                $(item).css("height", parseInt(voteRecordList[i].count) / total * 100 + "%").find("span").html(voteRecordList[i].count);//设置柱形图宽度
                            });
                        }
                    } else {
                        clearInterval(voteTimer);
                        common.alert({
                            mask: true,
                            content: res.msg,
                            width: '300px',
                        })
                    }
                })
            },time);
        });
    });

    // 点击开启或者关闭投票
    $('#voteBtn').on('click',function () {
        var type = $(this).attr('data-type');

        if (type == 0) {
            $(this).attr('data-type',1);
            $(this).html('关闭投票');
            common.startVote(function (res) {});
        } else {
            clearInterval(voteTimer);
            $(this).attr('data-type',0);
            $(this).html('开启投票');
            common.closeVote(function (res) {});
        }
    });
});