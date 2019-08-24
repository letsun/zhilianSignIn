var initTop = 20;
var _top = initTop;

$(function () {
    var commentMaxId = 1;
    var commentStyle = 1;
    var commentRecordList = [];
    var swiperTimer = null;
    var time = 2600;
    var index = 1;
    var commentTimer = null;
    var commentSwiperTimer = null;
    // 初始化轮播图
    var commentSwiper = new Swiper('#commentCon', {
        direction: 'vertical',
        slidesPerView: 5,
        spaceBetween: 22.5,
        simulateTouch: false,
        autoplay: 2000,
        autoplayDisableOnInteraction: false,
        autoplayStopOnLast: true,
        width: 762,
        height: 450,
    });

    $('#nav4').on('click',function () {
        $('.page').hide();
        $('#comment').fadeIn();
        common.getCommentRecord({
            limitCount: 10,
            maxId: commentMaxId,
        },function (res) {
            commentMaxId = res.data[0].maxId;
            commentStyle = res.data[0].commentStyle;
            commentRecordList = res.data[0].commentRecordList;

            var html = '';
            if (commentRecordList.length > 0) {
                for (var i = 0; len = commentRecordList.length, i < len; i++) {
                    html += '<div class="swiper-slide">';
                    html += '<img class="userImg" src="' + commentRecordList[i].headImg + '">';
                    html += '<div class="dec">';
                    html += '<div class="userName">' + commentRecordList[i].nickname + '</div><div class="comment-text">：' + commentRecordList[i].content + '</div></div>';
                    html += '</div>';
                }
            }

            if (commentStyle == 1) {
                $('#comment').fadeIn();
                $('#commentBtn').show();
                commentSwiper.appendSlide(html);
                commentSwiper.startAutoplay();
                clearInterval(commentSwiperTimer);
                commentSwiperTimer = setInterval(function () {
                    common.getCommentRecord({
                        limitCount: 10,
                        maxId: commentMaxId,
                    },function (res) {
                        commentMaxId = res.data[0].maxId;
                        commentStyle = res.data[0].commentStyle;
                        commentRecordList = res.data[0].commentRecordList;
                        if (commentRecordList.length > 0) {
                            for (var i = 0; len = commentRecordList.length, i < len; i++) {
                                var html2 = '';
                                html2 += '<div class="swiper-slide">';
                                html2 += '<img class="userImg" src="' + commentRecordList[i].headImg + '">';
                                html2 += '<div class="dec">';
                                html2 += '<div class="userName">' + commentRecordList[i].nickname + '</div><div class="comment-text">：' + commentRecordList[i].content + '</div></div>';
                                html2 += '</div>';
                                commentSwiper.appendSlide(html2);
                                commentSwiper.startAutoplay();
                            }
                        }
                    })
                },time)

            } else {
                $('#comment').hide();
                $('#commentBtn').hide();
                $('#barrage-comment').show();
                startTranslate(commentRecordList);
                commentTimer = setInterval(function () {
                    common.getCommentRecord({
                        limitCount: 10,
                        maxId: commentMaxId,
                    },function (res) {
                        commentMaxId = res.data[0].maxId;
                        commentStyle = res.data[0].commentStyle;
                        commentRecordList = res.data[0].commentRecordList;
                        startTranslate(commentRecordList);
                    })
                },time)
            }
        });
    });

    $("#stop").on("click", function () {
        if (commentStyle == 1) {
            if ($(this).hasClass("stop")) {
                //播放
                $(this).removeClass('stop');
                commentSwiper.stopAutoplay();
            } else {
                //暂停
                $(this).addClass('stop');
                commentSwiper.startAutoplay();
            }
        } else {
            if ($(this).hasClass("stop")) {
                $(this).removeClass('stop');
            } else {
                $(this).addClass('stop');
            }
        }

    });

    /**
     * @desc 评论翻上一页
     */
    $("#prev").on("click", function () {
        commentSwiper.slidePrev();
    });

    /**
     * @desc 评论翻下一页
     */
    $("#next").on("click", function () {
        commentSwiper.slideNext();
    });
});


function startTranslate(commentRecordList) {
    var key = 0;
    var leng = commentRecordList.length;
    var barTimer = setInterval(function() {
        if (key >= leng) {
            clearInterval(barTimer);  //如果data数据没有了就不在插入
            return;
        }
        var _html = itemHtml(key,commentRecordList);
        key++;
        $('#barrage-comment').append(_html);
        init_screen();
    }, 800);

}

function itemHtml(key,commentRecordList) {  //插入内容的模板，也就是每条评论的模板
    var _html = '';
    _html += '<div class="bar-slide">';
    _html += '<img class="userImg" src="' + commentRecordList[key].headImg + '">';
    _html += '<div class="dec">';
    _html += '<div class="userName">' + commentRecordList[key].nickname + '</div><div class="comment-text">：' + commentRecordList[key].content + '</div></div>';
    _html += '</div>';
    return _html;
}

function init_screen() {
    $('#barrage-comment').find(".bar-slide[class!='had']").show().each(function(item, key) {
        /*if ($("#stop").hasClass('stop')) {
            if ($(this).hasClass('had')) return;
            var that = this;
            var twidth = $(this).width();
            var _left = $(window).width() + twidth;
            var rd = Math.random() * 100;
            var _height = $(window).height();
            if (_top > _height - 150) {  //如果快到屏幕底部就重新设置top，这样就从屏幕头部开始动作
                if (initTop == 20) {
                    _top = initTop = 60;   //至于分成2种情况是为了，第一排和第二排错开，这样可以争取空间，不容易重叠（指的是评论item）
                } else {
                    _top = initTop = 20;
                }
            }

            $(this).css({  //初始化每条评论的位置，也就是看不到的位置，right位置在屏幕看不到的地方
                top: _top,
                right: "-" + (twidth + 200) + "px"
            });
            $(this).css({  //这里实现的重点方法是translateX,利用css3实现评论的移动，这样可以提高性能，如果用其他方法比如jq的animate方法在pc端没 问题，在移动端就性能不好，会有卡顿的现象
                transition: "transform 17s linear"
            });
            $(this).css({  //这里实现的重点方法是translateX,利用css3实现评论的移动，这样可以提高性能，如果用其他方法比如jq的animate方法在pc端没 问题，在移动端就性能不好，会有卡顿的现象
                transform: "translateX(-" + (_left + rd + 500) + "px)"
            }).addClass('had');
            _top = _top + 80;
        } else {
            $('.bar-slide').css({transform: "initial"});
        }*/

        if ($(this).hasClass('had')) return;
        var that = this;
        var twidth = $(this).width();
        var _left = $(window).width() + twidth;
        var rd = Math.random() * 100;
        var _height = $(window).height();
        if (_top > _height - 150) {  //如果快到屏幕底部就重新设置top，这样就从屏幕头部开始动作
            if (initTop == 20) {
                _top = initTop = 60;   //至于分成2种情况是为了，第一排和第二排错开，这样可以争取空间，不容易重叠（指的是评论item）
            } else {
                _top = initTop = 20;
            }
        }

        $(this).css({  //初始化每条评论的位置，也就是看不到的位置，right位置在屏幕看不到的地方
            top: _top,
            right: "-" + (twidth + 200) + "px"
        });
        if ($("#stop").hasClass('stop')) {
            $(this).css({  //这里实现的重点方法是translateX,利用css3实现评论的移动，这样可以提高性能，如果用其他方法比如jq的animate方法在pc端没 问题，在移动端就性能不好，会有卡顿的现象
                transition: "transform 17s linear"
            });
            $(this).css({  //这里实现的重点方法是translateX,利用css3实现评论的移动，这样可以提高性能，如果用其他方法比如jq的animate方法在pc端没 问题，在移动端就性能不好，会有卡顿的现象
                transform: "translateX(-" + (_left + rd + 500) + "px)"
            }).addClass('had');
            /*$(this).animate({'left': -(_left + rd + 500) + 'px'},25000,'linear').addClass('had');*/
            _top = _top + 80;
        } else {
        }

    });
}
