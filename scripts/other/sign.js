window.localStorage.removeItem('maxId');
window.localStorage.removeItem('getListInfor');
$('#sign-con').css({'position': 'fixed','left': '0','top': '0','width': window.innerWidth + 'px','height': window.innerWidth + 'px'});
$(function () {
    $('#nav1').on('click',function () {
        $('.page').hide();
        $('#commentBtn').hide();
        $('#barrage-comment').hide();
        $('#sign-win').show();
    });
    var personArray = new Array;//创建一个数组
    var maxNum = 200;

    // 初始化界面数据
    for(var i = 0; i < maxNum; i++){
        //var ram=Math.round(Math.random()*5);
        var ram = 7;
        personArray.push({
            image: "../images/pc/1_1.png",
        })
    }

    var listIndex = 0;
    common.cfg.maxId = window.localStorage.getItem('maxId') ? window.localStorage.getItem('maxId') - 0 : 0;
    var getListInfor = {};
    var localGetListInfor = JSON.parse(window.localStorage.getItem('getListInfor'));
    var getList = localGetListInfor ? localGetListInfor.getList : [];    // 缓存的签到数据
    var list = getList;    // 签到数据数组

    common.getActivityList(function (res) {
        if (res.status == 1) {
            common.cfg.activityId = res.data.activityList[0].id;
            common.getSignRecord(10,function (res) {
                if (res.status == 1) {
                    if (res.data.backgroundImgUrl.length > 0) {
                        $('.wrapper').css({'background':'url(' + res.data.backgroundImgUrl + ') no-repeat','background-size':'100% 100%'});
                    } else {
                        $('.wrapper').css({'background':'url("../images/pc/bg.jpg") no-repeat','background-size':'100% 100%'});
                    }
                    if (res.data.isShow == 1) {
                        $('.sign-num').show().find('span').html(res.data.signedTotalCount);
                    }

                    if (res.data.signRecordList.length > 0) {

                        for (var i = 0; i < res.data.signRecordList.length; i++) {
                            getList.push(res.data.signRecordList[i]);
                            getListInfor['getList'] = getList;
                        }
                    }

                    common.cfg.maxId = res.data.maxId;
                    window.localStorage.setItem('getListInfor',JSON.stringify(getListInfor));
                }
            });
        }
    });

    // 留言弹窗动画数组
    var _in = ['bounceIn','bounceInDown','bounceInLeft','bounceInRight','bounceInUp','fadeIn','fadeInDown','fadeInDownBig','fadeInLeft','fadeInLeftBig','fadeInRight','fadeInRightBig','fadeInUp','fadeInUpBig','rotateIn','rotateInDownLeft','rotateInDownRight','rotateInUpLeft','rotateInUpRight','slideInDown','slideInLeft','slideInRight'];
    var _out = ['bounceOut','bounceOutDown','bounceOutLeft','bounceOutRight','bounceOutUp','fadeOut','fadeOutDown','fadeOutDownBig','fadeOutLeft','fadeOutLeftBig','fadeOutRight','fadeOutRightBig','fadeOutUp','fadeOutUpBig','rotateOut','rotateOutDownLeft','rotateOutDownRight','rotateOutUpLeft','rotateOutUpRight','slideOutDown','slideOutLeft','slideOutRight'];

    // 模拟推送数据
    var s = setInterval(function(){

        // 留言弹窗动画数组
        var rand_in = parseInt(Math.random() * _in.length,10);
        var rand_out = parseInt(Math.random() * _out.length,10);
        /*console.log(getListInfor);*/
        // 初始化签到数据
        common.getSignRecord(10,function (res) {
            if (res.status == 1) {
                if (res.data.signRecordList.length > 0) {

                    for (var i = 0; i < res.data.signRecordList.length; i++) {
                        getList.push(res.data.signRecordList[i]);
                        getListInfor['getList'] = getList;
                    }
                }

                if (res.data.isShow == 1) {
                    $('.sign-num').show().find('span').html(res.data.signedTotalCount);
                }

                common.cfg.maxId = res.data.maxId;
                window.localStorage.setItem('getListInfor',JSON.stringify(getListInfor));
                window.localStorage.setItem('maxId',common.cfg.maxId);
            }
        });

        setTimeout(function(){

            // 留言弹窗淡入
            $('.show_info').removeClass(_in[rand_in]);

            var idx = Math.round(Math.random() * maxNum);
            var i = findUNusedIdx (idx);
            idx = i;

            if(listIndex > getList.length - 1){
                return false;
            }

            if (table[idx].used == false){
                table[idx].used = true;

                $('.element').eq(idx).find('img').attr('src',getList[listIndex].headImg);
                // 更改留言弹窗数据
                $('.show_img').attr('src',getList[listIndex].headImg);
                $('#sign-win .nickname').html(getList[listIndex].nickname);
                $('.id').html('ID:' + getList[listIndex].id);
                $('.show_info').show();
                $('.show_info').addClass(_in[rand_in]);
                listIndex++;
            } else {
                if (listIndex >= personArray.length - 1) {
                    $('.element').eq(idx).find('img').attr('src',getList[listIndex].headImg);
                    // 更改留言弹窗数据
                    $('.show_img').attr('src',getList[listIndex].headImg);
                    $('.nickname').html(getList[listIndex].nickname);
                    $('.id').html('ID:' + getList[listIndex].id);
                    $('.show_info').show();
                    $('.show_info').addClass(_in[rand_in]);
                    listIndex++;
                }
            }

            setTimeout(function(){
                // 留言弹窗淡出
                $('.show_info').addClass(_out[rand_out]);

                setTimeout(function(){
                    $('.show_info').removeClass(_out[rand_out]);
                    $('.show_info').hide();
                },1000);
            },1300);
        },800);
    },4500);

    var table = new Array;//创建一个table数组里面也是图片路径
    for (var i = 0; i < personArray.length; i++) {

        table[i] = new Object();//每一个图片路径变成一个对象

        if (i < personArray.length) {
            table[i] = personArray[i];//这两个变成一样的
            table[i].src = personArray[i].thumb_image;
        }
        if (maxNum / 20 > 20) {
            table[i].p_x = i % (maxNum / 20) + 1;//p_x是第几个
            table[i].p_y = Math.floor(i / (maxNum / 20)) + 1;//p_y是第几行
            table[i].used = false; //是否首次使用过头像
        } else {
            table[i].p_x = i % (maxNum / 10) + 1;//p_x是第几个
            table[i].p_y = Math.floor(i / (maxNum / 10)) + 1;//p_y是第几行
            table[i].used = false; //是否首次使用过头像
        }


    }

    var newTable = table;

    var camera, scene, renderer;//相机，场景，渲染器
    var controls;

    var objects = [];//创建一个数组，等待对象添加
    var targets = {table: [], sphere: [], helix: [], grid: [] };


    init();
    animate();

    function init() {

        camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );//创建一个相机
        camera.position.z = maxNum * 15;//再屏幕外3000的位置
        if (camera.position.z <= 2500) {
            camera.position.z = 2500;
        }

        scene = new THREE.Scene();//创建一个场景

        // table
        for ( var i = 0; i < table.length; i ++ ) {

            var element = document.createElement( 'div' );//创建一个div
            element.className = 'element';//div的类名
            // element.style.backgroundColor = 'rgba(0,127,127,' + ( Math.random() * 0.5 + 0.25 ) + ')';//div的背景颜色

            var img = document.createElement('img');//创建一个img
            img.src = table[ i ].image;//路径第几张图片
            element.appendChild( img );//添加图片到div中

            var object = new THREE.CSS3DObject( element );//创建一个THREE.CSS3DObject对象里面有元素和元素位置

            //刚初始化时候的随意位置
            object.position.x = Math.random() * 4000 - 2000;
            object.position.y = Math.random() * 4000 - 2000;
            object.position.z = Math.random() * 4000 - 2000;

            scene.add( object );//将对象添加到场景中


            objects.push( object );//将object对象添加到objects数组中

            // 表格需要坐标进行排序的
            var object = new THREE.Object3D();//创建一个Object3D对象里面元素位置
            object.position.x = ( table[ i ].p_x * 90 ) - 950;//第几个的位置
            object.position.y = - ( table[ i ].p_y * 100 ) + 500;//第几行的位置

            targets.table.push( object );//将object对象添加到targets.table数组中
        }

        // 球体
        var vector = new THREE.Vector3();//构造器创建一个对象里面有x，y，z的数值

        var spherical = new THREE.Spherical();//构造器创建一个对象里面有phi，radius，theta，三个参数

        for ( var i = 0, l = objects.length; i < l; i ++ ) {

            var phi = Math.acos( -1 + ( 2 * i ) / l );//余弦值
            var theta = Math.sqrt( l * Math.PI ) * phi;//圆周率的平方根乘余弦值

            var object = new THREE.Object3D();//创建一个Object3D对象里面元素位置


            spherical.set(500, phi, theta );//设置球体半径，余弦值，圆周率的平方根乘余弦值


            object.position.setFromSpherical( spherical );//暂时看不懂

            vector.copy( object.position ).multiplyScalar( 2 );//暂时看不懂

            object.lookAt( vector );//暂时看不懂

            targets.sphere.push( object );//将object对象添加到targets.sphere数组中

        }

        // 螺旋
        var vector = new THREE.Vector3();//构造器创建一个对象里面有x，y，z的数值

        var cylindrical = new THREE.Cylindrical();//构造器创建一个对象里面有radius，theta，y，三个参数


        for ( var i = 0, l = objects.length; i < l; i ++ ) {

            var theta = i * 0.175 + Math.PI;
            var y = - ( i * 5 ) + 500;

            var object = new THREE.Object3D();//创建一个Object3D对象里面元素位置


            // 参数一 圈的大小 参数二 左右间距 参数三 上下间距
            cylindrical.set( 500, theta, y );//设置圆柱体半径，圆周率，y

            object.position.setFromCylindrical( cylindrical );//暂时看不懂

            vector.x = object.position.x * 2;//设置vector对象中的x，y，z
            vector.y = object.position.y;
            vector.z = object.position.z * 2;

            object.lookAt( vector );    //暂时看不懂

            targets.helix.push( object );//将object对象添加到targets.helix数组中

        }

        // 格子
        for ( var i = 0; i < objects.length; i ++ ) {

            var object = new THREE.Object3D();//创建一个Object3D对象里面元素位置

            object.position.x = ( ( i % 5 ) * 320 ) - 650; // 400 图片的左右间距  800 x轴中心店
            object.position.y = ( - ( Math.floor( i / 5 ) % 5 ) * 180 ) + 350;  // 500 y轴中心店
            object.position.z = ( Math.floor( i / 25 ) ) * 200 - 800;// 300调整 片间距 800z轴中心店

            targets.grid.push( object );//将object对象添加到targets.grid数组中

        }

        //渲染
        renderer = new THREE.CSS3DRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight);
        renderer.domElement.style.position = 'absolute';
        document.getElementById('sign-con').appendChild( renderer.domElement );

        // 鼠标控制
        controls = new THREE.TrackballControls( camera, renderer.domElement );
        controls.rotateSpeed = 0.5;
        controls.minDistance = 500;
        controls.maxDistance = 6000;
        controls.addEventListener( 'change', render );
        transform(targets.table, 1000);


        // 自动更换效果
         var ini = 0;
         setInterval(function(){
             ini = ini >= 4 ? 0 : ini;
             ++ini;
             switch(ini){
                 case 1:
                     transform( targets.sphere, 1000 );
                     break;
                 case 2:
                     transform( targets.helix, 1000 );
                     break;
                 case 3:
                     transform( targets.grid, 1000 );
                     break;
                 case 4:
                     transform( targets.table, 1000 );
                     break;
             }
         },8000);
        // 点击tab切换不同效果
        $('#table').on('click',function () {
            transform( targets.table, 1000);
        });

        $('#sphere').on('click',function () {
            transform( targets.sphere, 2000);
        });

        $('#helix').on('click',function () {
            transform( targets.helix, 2000);
        });

        $('#grid').on('click',function () {
            transform( targets.grid, 2000);
        });


        //
        window.addEventListener( 'resize', onWindowResize, false );
    }

    // 元素出场动画
    function transform( targets, duration) {

        TWEEN.removeAll();

        for ( var i = 0; i < objects.length; i ++ ) {

            var object = objects[ i ];
            var target = targets[ i ];

            new TWEEN.Tween( object.position )
                .to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
                .easing( TWEEN.Easing.Exponential.InOut )
                .start();

            new TWEEN.Tween( object.rotation )
                .to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
                .easing( TWEEN.Easing.Exponential.InOut )
                .start();

        }

        new TWEEN.Tween( this )
            .to( {}, duration * 2 )
            .onUpdate( render )
            .start();

        /*setTimeout(function () {
            if (getList.length > 0) {
                for (var j = 0, len = getList.length; j < len; j++) {
                    /!*if (j <= CurPersonNum) {

                    }*!/

                    $('.element').eq(idx).find('img').attr('src',getList[j].headImg);
                    getList[j]['used'] = true;

                }
            }
        },3000);*/
    }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight);

        render();
    }

    // 整体场景动画
    function animate() {

        // 让场景通过x轴或者y轴旋转  & z
        //scene.rotation.x += 0.011;
        scene.rotation.y += 0.004;

        requestAnimationFrame( animate );

        TWEEN.update();

        controls.update();

        // 渲染循环
        render();

    }

    function render() {
        renderer.render( scene, camera );
    }

    function findUNusedIdx (idx){
        //先向后找
        for ( var i = idx; i < table.length; i++ ) {
            if (listIndex <= personArray.length - 1) {
                if (table[i].used == false){
                    return i;
                }
            } else {
                return i;
            }

        }

        //没找到在向前找
        for ( var i = idx - 1; i >= 0; i--) {
            /*if (table[i].used == false){
                return i;
            }*/

            if (listIndex <= personArray.length - 1) {
                if (table[i].used == false){
                    return i;
                }
            } else {
                return i;
            }
        }

        return -1;
    }
});