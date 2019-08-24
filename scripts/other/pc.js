
var main = {};
var user = [];
var sign;
var vote;
var lottery;
var comment;
var commentSwiper;
var type = 1;

$(function () {
    common.getActivityList(function (res) {
        if (res.status == 1) {
            common.cfg.activityId = res.data.activityList[0].id;
        }
    });
});

