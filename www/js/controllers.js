angular.module('starter.controllers', [])
    .controller('TabCtrl', function ($scope, $rootScope, $ionicHistory, $ionicPopup, UserService, DeliverAdressService, SMSService, $ionicModal, $timeout, webStorage, CashCouponService, $ionicLoading, LoopBackAuth) {
        $rootScope.currentCityBundle = $rootScope.global.cityList[3].cityArea[0];
        var BJScipt = document.createElement("script");
        BJScipt.setAttribute("type", "text/javascript");
        BJScipt.setAttribute("src", "http://api.map.baidu.com/getscript?v=1.5&ak=wDVbdfzotPyU5s2XHE8BhpA5&services=&t=20150522094656");
        document.getElementsByTagName("head")[0].appendChild(BJScipt);
        BJScipt.onload = function () {
            setTimeout(
                function () {
                    var geolocation = new BMap.Geolocation();
                    geolocation.getCurrentPosition(function (r) {
                        //返回状态码
                        //BMAP_STATUS_SUCCESS	检索成功。对应数值“0”。
                        //BMAP_STATUS_CITY_LIST	城市列表。对应数值“1”。
                        //BMAP_STATUS_UNKNOWN_LOCATION	位置结果未知。对应数值“2”。
                        //BMAP_STATUS_UNKNOWN_ROUTE	导航结果未知。对应数值“3”。
                        //BMAP_STATUS_INVALID_KEY	非法密钥。对应数值“4”。
                        //BMAP_STATUS_INVALID_REQUEST	非法请求。对应数值“5”。
                        //BMAP_STATUS_PERMISSION_DENIED	没有权限。对应数值“6”。(自 1.1 新增)
                        //BMAP_STATUS_SERVICE_UNAVAILABLE	服务不可用。对应数值“7”。(自 1.1 新增)
                        //BMAP_STATUS_TIMEOUT	超时。对应数值“8”。(自 1.1 新增)
                        var BMAP_STATUS_SUCCESS = 0, _city = "武汉";
                        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                            var myGeo = new BMap.Geocoder();
                            // 根据坐标得到地址描述
                            myGeo.getLocation(new BMap.Point(r.point.lng, r.point.lat), function (result) {
                                if (result) {
                                    //返回结果示例：浙江省杭州市滨江区求一路
                                    window.bmapLocation = result;
                                    _city = result.address;
                                    Zepto.each($rootScope.global.cityList, function (k, v) {
                                        if (v.cityArea)
                                            Zepto.each(v.cityArea, function (_k, _v) {
                                                if (_city.indexOf(_v.content) != -1) {
                                                    $rootScope.currentCityBundle = v;
                                                    return false;
                                                }
                                            });
                                    });
                                }
                            });
                        } else {
                            var myFun = function (result) {
                                var _city = result.name;
                                Zepto.each($rootScope.global.cityList, function (k, v) {
                                    if (v.cityArea)
                                        Zepto.each(v.cityArea, function (_k, _v) {
                                            if (_city.indexOf(_v.content) != -1) {
                                                $rootScope.currentCityBundle = v;
                                                return false;
                                            }
                                        });
                                });
                            };
                            var myCity = new BMap.LocalCity();
                            myCity.get(myFun);
                        }
                    }, {enableHighAccuracy: true});
                }, 3000);
        };
        $scope.flagCode = false;

        $scope.reg = {
            validCode: "",
            validPassword: ""
        };
        $scope.userNew = {
            score: 0,
            lock: 0,
            address: "",
            lastUpdated: new Date(),
            userType:3
        };
        $scope.findPW = {
            validCode: "",
            validPassword: ""
        };
        $scope.userTemp = {
            username: "",
            password: ""
        };
        $scope.codeBtn = "获取验证码";
        $scope.codePWBtn = "获取验证码";
        $scope.sendCodeNum = "";
        $ionicModal.fromTemplateUrl('my-login.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $rootScope.loginModal = modal;
        });
        $ionicModal.fromTemplateUrl('my-register.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $rootScope.registerModal = modal;
        });
        $ionicModal.fromTemplateUrl('my-findPW.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $rootScope.findPWModal = modal;
        });
        //var ua = window.navigator.userAgent.toLowerCase();
        //if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        //    var weixinJScipt = document.createElement("script");
        //    weixinJScipt.setAttribute("type", "text/javascript");
        //    weixinJScipt.setAttribute("src", "http://res.wx.qq.com/open/js/jweixin-1.0.0.js");
        //    document.getElementsByTagName("head")[0].appendChild(weixinJScipt);
        //    weixinJScipt.onload = function () {
        //    }
        //}

        $rootScope.openLoginModal = function () {
            $rootScope.loginModal.show();
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                //jQuery.get("https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx36b10605e1164209&redirect_uri="+  encodeURI(location.href)+"&response_type=code&scope=SCOPE&state=STATE#wechat_redirect",{},function(_data){
                //
                //});
                //jQuery.get("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx4c994fb862af8e29&secret=99c86ddcb5f2efaa6154043b2fbd89de",{},function(_data){
                //    if(_data && _data.access_token){
                //        $rootScope.WX_access_token = _data.access_token;
                //        jQuery.get("https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=_data.access_token&type=jsapi",{},function(_data){
                //            if(_data && _data.ticket){
                //                $rootScope.WX_jsapi_ticket =  _data.ticket;
                //                var _ts = new Date().getTime();
                //                wx.config({
                //                    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                //                    appId: 'wx4c994fb862af8e29', // 必填，公众号的唯一标识
                //                    timestamp: new Date().getTime(), // 必填，生成签名的时间戳
                //                    nonceStr: 'na1ke', // 必填，生成签名的随机串
                //                    signature: rstr_sha1("jsapi_ticket="+_data.ticket+"&noncestr=na1ke&timestamp="+  _ts+"&url=http://m.pictcake.cn/"),// 必填，签名，见附录1
                //                    jsApiList: [] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                //                });
                //                wx.ready(function(){
                //
                //                    // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                //                });
                //                wx.error(function(res){
                //
                //                    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                //
                //                });
                //            }
                //        });
                //    }
                //});

            }

            //去除QQ登录和微博登录
            //var otherJScipt = document.createElement("script");
            //otherJScipt.setAttribute("type", "text/javascript");
            //otherJScipt.setAttribute("src", "http://tjs.sjs.sinajs.cn/open/api/js/wb.js?appkey=1202344459");
            //document.getElementsByTagName("head")[0].appendChild(otherJScipt);
            //otherJScipt.onload = function () {
            //    WB2.anyWhere(function (W) {
            //        W.widget.connectButton({
            //            id: "wb_connect_btn",
            //            type: "3,4",
            //            callback: {
            //                login: function (o) {	//登录后的回调函数
            //                    $ionicLoading.show({
            //                        template: '登录跳转中，稍后亲...'
            //                    });
            //                    UserService.snslogin({
            //                        "id": o.id,
            //                        "type": 2,
            //                        "nickname": o.screen_name || o.name,
            //                        "avatar": o.avatar_hd || o.profile_image_url,
            //                        "address": o.location || bmapLocation
            //                    }, function (flag, data) {
            //                        if (flag) {
            //                            //console.log(data);
            //                            LoopBackAuth.setUser(data.accessToken.id, data.accessToken.userId, {});
            //
            //                            $rootScope.global.accessToken = data.accessToken.id;
            //                            $rootScope.global.accessTokenTime = new Date(new Date().getTime() + data.accessToken.ttl * 1000).getTime();
            //                            $rootScope.loginModal.hide();
            //                            $ionicLoading.hide();
            //                            UserService.updateAttributes({
            //                                id: data.accessToken.userId,
            //                                lastUpdated: new Date().getTime()
            //                            }, function (flag, res) {
            //                                //console.log(res);
            //                                $rootScope.user = res;
            //                                LoopBackAuth.setUser(data.accessToken.id, data.accessToken.userId, res);
            //                                LoopBackAuth.rememberMe = true;
            //                                LoopBackAuth.save();
            //                                if (webStorage.isSupported) {
            //                                    webStorage.remove("global");
            //                                    webStorage.add("global", $rootScope.global);
            //                                    webStorage.remove("user");
            //                                    webStorage.add("user", $rootScope.user);
            //                                }
            //                                $scope.userTemp = {
            //                                    username: "",
            //                                    password: ""
            //                                };
            //                                DeliverAdressService.listAddress({
            //                                    "filter[where][userId]": $rootScope.user.id || 0
            //                                }, function (flag, res) {
            //                                    if (flag) {
            //                                        $rootScope.addressList = res;
            //                                    }
            //                                });
            //                            });
            //
            //                        } else {
            //                            $ionicPopup.alert({
            //                                title: '登录失败',
            //                                template: '微博授权失败！'
            //                            });
            //                        }
            //                    });
            //                },
            //                logout: function () {	//退出后的回调函数
            //                }
            //            }
            //        });
            //    });
            //};
            //var QQJScipt = document.createElement("script");
            //QQJScipt.setAttribute("type", "text/javascript");
            //QQJScipt.setAttribute("src", "http://qzonestyle.gtimg.cn/qzone/openapi/qc_loader.js");
            //QQJScipt.setAttribute("data-appid", "101269949");
            ////加了回调url之后，浏览器上的会跳到对应地址，但是url地址不能填带有#的，这个现在还没法解决，不填写回调地址，网页是正常的，微信浏览器不正常
            ////QQJScipt.setAttribute("data-redirecturi", "http://m.pictcake.cn/");
            //QQJScipt.setAttribute("charset", "utf-8");
            //QQJScipt.setAttribute("data-callback", true);
            //document.getElementsByTagName("head")[0].appendChild(QQJScipt);
            //
            //window.QCTimer = setInterval(function () {
            //    if(!!QC) {
            //        clearInterval(QCTimer);
            //        //调用QC.Login方法，指定btnId参数将按钮绑定在容器节点中
            //        QC.Login({
            //                //btnId：插入按钮的节点id，必选
            //                btnId: "qqLoginBtn",
            //                //用户需要确认的scope授权项，可选，默认all
            //                scope: "all",
            //                //按钮尺寸，可用值[A_XL| A_L| A_M| A_S|  B_M| B_S| C_S]，可选，默认B_S
            //                size: "A_M"
            //            }, function (reqData, opts) {//登录成功
            //                //根据返回数据，更换按钮显示状态方法
            //                $ionicLoading.show({
            //                    template: '登录跳转中，稍后亲...'
            //                });
            //                QC.Login.getMe(function (openId, accessToken) {
            //                    UserService.snslogin({
            //                        "id": openId,
            //                        "type": 1,
            //                        "nickname": reqData.nickname,
            //                        "avatar": reqData.figureurl_2 || reqData.figureurl_qq_2,
            //                        "address": reqData.city ? (reqData.province + "省" + reqData.city + "市") : bmapLocation
            //                    }, function (flag, data) {
            //                        if (flag) {
            //                            //console.log(data);
            //                            LoopBackAuth.setUser(data.accessToken.id, data.accessToken.userId, {});
            //                            $rootScope.global.accessToken = data.accessToken.id;
            //                            $rootScope.global.accessTokenTime = new Date(new Date().getTime() + data.accessToken.ttl * 1000).getTime();
            //                            $rootScope.loginModal.hide();
            //                            $ionicLoading.hide();
            //                            UserService.updateAttributes({
            //                                id: data.accessToken.userId,
            //                                lastUpdated: new Date().getTime()
            //                            }, function (flag, res) {
            //                                //console.log(res);
            //                                $rootScope.user = res;
            //                                LoopBackAuth.setUser(data.accessToken.id, data.accessToken.userId, res);
            //                                LoopBackAuth.rememberMe = true;
            //                                LoopBackAuth.save();
            //                                if (webStorage.isSupported) {
            //                                    webStorage.remove("global");
            //                                    webStorage.add("global", $rootScope.global);
            //                                    webStorage.remove("user");
            //                                    webStorage.add("user", $rootScope.user);
            //                                }
            //                                $scope.userTemp = {
            //                                    username: "",
            //                                    password: ""
            //                                };
            //                                DeliverAdressService.listAddress({
            //                                    "filter[where][userId]": $rootScope.user.id || 0
            //                                }, function (flag, res) {
            //                                    if (flag) {
            //                                        $rootScope.addressList = res;
            //                                    }
            //                                });
            //                            });
            //
            //                        } else {
            //                            $ionicPopup.alert({
            //                                title: '登录失败',
            //                                template: 'QQ授权失败！'
            //                            });
            //                        }
            //                    });
            //                });
            //            }, function (opts) {//注销成功
            //            }
            //        );
            //    }
            //}, 2000);
        };
        $scope.openRegisterModal = function () {
            $rootScope.registerModal.show();
        };
        $scope.openFindPWModal = function () {
            $rootScope.findPWModal.show();
        };
        $scope.closeLoginModal = function () {
            $rootScope.loginModal.hide();
            $rootScope.loginModal.remove();
            $ionicModal.fromTemplateUrl('my-login.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $rootScope.loginModal = modal;
            });
        };
        $scope.closeRegisterModal = function () {
            $rootScope.registerModal.hide();
            $rootScope.registerModal.remove();
            $ionicModal.fromTemplateUrl('my-register.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $rootScope.registerModal = modal;
            });
        };
         $scope.closeFindPWModal = function () {
            $rootScope.findPWModal.hide();
            $rootScope.findPWModal.remove();
            $ionicModal.fromTemplateUrl('my-findPW.html', {
             scope: $scope,
             animation: 'slide-in-up'
            }).then(function (modal) {
             $rootScope.findPWModal = modal;
            });
        };

        $scope.loginIn = function () {
            UserService.login($scope.userTemp, function (flag, data) {
                if (flag) {
                    $rootScope.global.accessToken = data.id;
                    $rootScope.global.accessTokenTime = new Date(new Date().getTime() + data.ttl * 1000).getTime();
                    $rootScope.user = data.user;
                    $rootScope.user.password = $scope.userTemp.password;
                    if (webStorage.isSupported) {
                        webStorage.remove("global");
                        webStorage.add("global", $rootScope.global);
                        webStorage.remove("user");
                        webStorage.add("user", $rootScope.user);
                    }
                    $rootScope.loginModal.hide();
                    $scope.userTemp = {
                        username: "",
                        password: ""
                    };
                    DeliverAdressService.listAddress({
                        "filter[where][userId]": $rootScope.user.id || 0
                    }, function (flag, res) {
                        if (flag) {
                            $rootScope.addressList = res;
                        }
                    });
                } else {
                    $ionicPopup.alert({
                        title: '登录失败',
                        template: '手机号或密码错误！'
                    });
                    $ionicLoading.hide();
                    $scope.userTemp.password = "";
                }
            });
        };
        $scope.logOut = function () {
            $rootScope.user = {};
            $rootScope.addressSelect = {};
            $rootScope.couponSelect = {};

            webStorage.remove("user");
            $rootScope.global = {};
            webStorage.remove("global");
            $rootScope.selfModal.hide();
            // if(!WB2) {
            //     var otherJScipt = document.createElement("script");
            //     otherJScipt.setAttribute("type", "text/javascript");
            //     otherJScipt.setAttribute("src", "http://tjs.sjs.sinajs.cn/open/api/js/wb.js?appkey=1202344459");
            //     document.getElementsByTagName("head")[0].appendChild(otherJScipt);
            //     otherJScipt.onload = function () {
            //         WB2.logout(function () {
            //         });
            //     };
            // }else{
            //     WB2.logout(function () {});
            // }

            // if(!QC) {
            //     var QQJScipt = document.createElement("script");
            //     QQJScipt.setAttribute("type", "text/javascript");
            //     QQJScipt.setAttribute("src", "http://qzonestyle.gtimg.cn/qzone/openapi/qc_loader.js");
            //     QQJScipt.setAttribute("data-appid", "101269949");
            //     //QQJScipt.setAttribute("data-callback", true);
            //     document.getElementsByTagName("head")[0].appendChild(QQJScipt);
            // }
            // window.QCTimerExit = setInterval(function () {
            //     if(QC){
            //         clearInterval(QCTimerExit);
            //         QC.Login.signOut();
            //     }
            // }, 2000);
        };
        $scope.telCode = function () {
            //$scope.sendCodeNum = "123456";
            var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[7]{1})|(18[0-9]{1}))+\d{8})$/;
            if (!$scope.userNew.phone || $scope.userNew.phone.length != 11 || !myreg.test($scope.userNew.phone)) {
                $ionicPopup.alert({
                    title: '提示',
                    template: '请输入正确的手机号！'
                });
                return;
            }
            $scope.flagCode = true;
            $scope.codeBtn = "稍等 " + 180 + " s";
            var cnt = 180;
            var codeTimer = $timeout(function myTimer() {
                cnt = cnt - 1;
                $scope.codeBtn = "稍等 " + cnt + " s";
                if (cnt <= 0) {
                    $scope.codeBtn = "获取验证码";
                    $scope.flagCode = false;
                } else {
                    $timeout(myTimer, 1000);
                }
            }, 1000);
            //$scope.reg.validCode = "123456";
            SMSService.sendCode({phone: $scope.userNew.phone,hashcode:b64_hmac_sha1($scope.userNew.phone+"-自定义-","")}, function (flag, data) {
                if (flag) {
                    $scope.sendCodeNum = data.code;
                }
            });

        };
        $scope.findPWTelCode = function () {
            //$scope.sendCodeNum = "123456";
            var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[7]{1})|(18[0-9]{1}))+\d{8})$/;
            if (!$scope.findPW.phone || $scope.findPW.phone.length != 11 || !myreg.test($scope.findPW.phone)) {
                $ionicPopup.alert({
                    title: '提示',
                    template: '请输入正确的手机号！'
                });
                return;
            }
            $scope.flagPWCode = true;
            $scope.codePWBtn = "稍等 " + 180 + " s";
            var cnt = 180;
            var codeTimer = $timeout(function myTimer() {
                cnt = cnt - 1;
                $scope.codePWBtn = "稍等 " + cnt + " s";
                if (cnt <= 0) {
                    $scope.codePWBtn = "获取验证码";
                    $scope.flagPWCode = false;
                } else {
                    $timeout(myTimer, 1000);
                }
            }, 1000);
            //$scope.reg.validCode = "123456";
            SMSService.sendCode({phone: $scope.findPW.phone,hashcode:b64_hmac_sha1($scope.findPW.phone+"-自定义-","")}, function (flag, data) {
                if (flag) {
                    $scope.findPW.sendCodeNum = data.code;
                }
            });

        };
        $scope.registerUser = function () {
            var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[7]{1})|(18[0-9]{1}))+\d{8})$/;
            if (!$scope.userNew.phone || $scope.userNew.phone.length != 11 || !myreg.test($scope.userNew.phone)) {
                $ionicPopup.alert({
                    title: '提示',
                    template: '请输入正确的手机号！'
                });
                return;
            }

            if (!$scope.reg.validCode || !$scope.sendCodeNum || ($scope.sendCodeNum + "") != b64_hmac_sha1($scope.reg.validCode+"na1ke","")) {
                $ionicPopup.alert({
                    title: '验证失败',
                    template: '验证码不正确，请核对短信！'
                });
            } else if (!$scope.userNew.password || $scope.userNew.password != $scope.reg.validPassword) {
                $ionicPopup.alert({
                    title: '密码不对',
                    template: '两次输入密码不一致，请重试！'
                });
            } else {
                $scope.userNew.username = $scope.userNew.phone;
                $scope.userNew.email = $scope.userNew.phone + "@qq.com";
                UserService.register($scope.userNew, function (flag, data) {
                    if (flag) {
                        $rootScope.registerModal.hide();
                        $scope.userTemp = {
                            username: "",
                            password: ""
                        };
                        $scope.userNew = {
                            score: 0,
                            lock: 0,
                            address: "",
                            lastUpdated: new Date(),
                            userType:3
                        };
                    } else {
                        $ionicPopup.alert({
                            title: '注册失败',
                            template: 'Duang，用户已存在！'
                        });
                    }
                });
            }
        };
        $scope.findPWUser = function(){
            var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[7]{1})|(18[0-9]{1}))+\d{8})$/;
            if (!$scope.findPW.phone || $scope.findPW.phone.length != 11 || !myreg.test($scope.findPW.phone)) {
                $ionicPopup.alert({
                    title: '提示',
                    template: '请输入正确的手机号！'
                });
                return;
            }

            if (!$scope.findPW.validCode || !$scope.findPW.sendCodeNum || ($scope.findPW.sendCodeNum + "") != b64_hmac_sha1($scope.findPW.validCode+"na1ke","")) {
                $ionicPopup.alert({
                    title: '验证失败',
                    template: '验证码不正确，请核对短信！'
                });
            } else if (!$scope.findPW.password || $scope.findPW.password != $scope.findPW.validPassword) {
                $ionicPopup.alert({
                    title: '密码不对',
                    template: '两次输入密码不一致，请重试！'
                });
            } else {
                
                UserService.upsert({username: $scope.findPW.phone, npw: $scope.findPW.password,code:$scope.findPW.sendCodeNum,hashcode:b64_hmac_sha1(($scope.findPW.sendCodeNum+hex_md5($scope.findPW.password)),"")}, function (flag, res) {
                        if(flag && (res.res > 0)){
                            $ionicPopup.alert({
                                title: '成功',
                                template: '密码修改成功，请使用新密码登录！'
                            });
                            $rootScope.findPWModal.hide();
                            $scope.findPW = {};
                        }
                        
                    });
            }
        };
        $ionicModal.fromTemplateUrl('my-address.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $rootScope.addressModal = modal;
        });

        $scope.openAddressModal = function () {
            DeliverAdressService.listAddress({
                "filter[where][userId]": $rootScope.user.id || 0
            }, function (flag, res) {
                if (flag) {
                    $rootScope.addressList = res;
                }
            });
            $rootScope.addressModal.show();
        };
        $scope.closeAddressModal = function () {
            $rootScope.addressModal.hide();
            $rootScope.addressModal.remove();
            $ionicModal.fromTemplateUrl('my-address.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $rootScope.addressModal = modal;
            });
        };
        $scope.newAdress = {
            // userArea: $rootScope.currentCityBundle.area[0],
            isDefault: true
        };

        $rootScope.addressSelect = {};

        $ionicModal.fromTemplateUrl('my-new-address.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $rootScope.newAddressModal = modal;
        });

        $scope.openNewAddressModal = function () {
            if (!!!$rootScope.user.id) {
                $rootScope.openLoginModal();
            } else {
                $rootScope.newAddressModal.show();
            }
        };
        $scope.closeNewAddressModal = function () {
            $rootScope.newAddressModal.hide();
        };
        $scope.saveAddress = function () {
            if (!$scope.newAdress.userName || !$scope.newAdress.telNum || !$scope.newAdress.userAddr) {
                var alertPopup = $ionicPopup.alert({
                    title: '提示',
                    template: '请认真填写地址，否则收不到哦'
                });
                alertPopup.then(function (res) {
                });
                return false;
            }
            DeliverAdressService.addAddress({
                "userId": $rootScope.user.id,
                "shipUserName": $scope.newAdress.userName,
                "shipTel": $scope.newAdress.telNum,
                "shipAddress": ( $scope.newAdress.userAddr),
                "isDefault": $scope.newAdress.isDefault
            }, function (flag, res) {
                if (flag) {
                    DeliverAdressService.listAddress({
                        "filter[where][userId]": $rootScope.user.id || 0
                    }, function (flag, res) {
                        if (flag) {
                            $scope.addressList = res;

                        }
                    });
                }
            });
            $rootScope.newAddressModal.hide();
        };
        $scope.selectAddress = function (_addr) {
            $rootScope.addressSelect = _addr;
            $timeout(function myTimer() {
                $rootScope.addressModal.hide();
            }, 300);
        };
        $scope.delAddress = function (_addr) {
            $scope.newAdress = {
                // userArea: $rootScope.currentCityBundle.area[0],
                isDefault: true
            };
            DeliverAdressService.delAddress({"id": _addr.id}, function (flag, res) {
                if (flag) {
                    DeliverAdressService.listAddress({
                        "filter[where][userId]": $rootScope.user.id || 0
                    }, function (flag, res) {
                        if (flag) {
                            $scope.addressList = res;

                        }
                    });
                }
            });
        };

        $scope.coupon = {
            couponCode: ""
        };
        $rootScope.couponList = [];
        $rootScope.couponSelect = {
            price: 0
        };

        $ionicModal.fromTemplateUrl('my-coupon.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $rootScope.couponModal = modal;

        });

        $scope.openCouponModal = function () {
            if (!!!$rootScope.user.id) {
                $rootScope.openLoginModal();
            } else {
                CashCouponService.listCashCoupon({"filter[where][userName]": $rootScope.user.username}, function (flag, res) {
                    if (flag) {
                        $rootScope.couponList = res;
                    }
                });
                $rootScope.couponModal.show();
            }
        };
        $scope.closeCouponModal = function () {
            $rootScope.couponModal.hide();
        };
        $scope.delCoupon = function (_cid) {

            CashCouponService.addCashCoupon({id: _cid, isUse: 2}, function (flag, res) {
                if (flag) {
                    CashCouponService.listCashCoupon({"filter[where][userName]": $rootScope.user.username}, function (flag, res) {
                        if (flag) {
                            $rootScope.couponList = res;
                        }
                    });
                }
            });
        };
        $scope.selectCoupon = function (coup) {
            $rootScope.couponSelect = coup;
            $timeout(function myTimer() {
                $rootScope.couponModal.hide();
            }, 300);
        };
        $scope.exchangeCoupon = function () {
            $ionicLoading.show({
                template: '正在兑换中...'
            });
            CashCouponService.listCashCoupon({"filter[where][couponCode]": $scope.coupon.couponCode}, function (flag, res) {
                if (flag) {
                    if (res && res.length > 0) {
                        if (res[0].userName == "pictcake" && parseInt(res[0].expireTime) > new Date().getTime() && res[0].isUse === 0) {
                            CashCouponService.addCashCoupon({
                                id: res[0].id,
                                userName: $rootScope.user.username
                            }, function (flag, res) {
                                if (flag) {
                                    CashCouponService.listCashCoupon({"filter[where][userName]": $rootScope.user.username}, function (flag, res) {

                                        if (flag) {
                                            $rootScope.couponList = res;
                                        }
                                    });
                                }
                                $ionicLoading.hide();
                            });
                        } else {
                            $ionicLoading.hide();
                            $ionicPopup.alert({
                                title: '提示',
                                template: '该现金券兑换码无效，请重试！'
                            });
                            return false;
                        }
                    } else {
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            title: '提示',
                            template: '该现金券兑换码无效，请重试！'
                        });
                        return false;
                    }
                } else {
                    $ionicLoading.hide();
                }
            });
        };
        //获取城市，wf.makyPy()
        // UserService.userList({"filter[where][userType]": 2,"filter[fields][city]":true}, function (flag, data) {
            UserService.shopper({}, function (flag, data) {
            //data = [{"city":"武汉"},{"city":"南京"},{"city":"武汉"},{"city":"上海"},{"city":"苏州"},{"city":"温州"},{"city":"北京"}]
            if(flag){
                var _citys = {}, _city = "", _keys="", _key = "",_shouzimus= [], _shouzimu= '';
                Zepto.each(data.shoppers, function (k, v) {
                    //v.city
                    if(_city.indexOf(v.city) < 0){
                        _shouzimu = wf.makePy(v.city[0])+"";
                        
                        if(!_citys[_shouzimu]){
                            _citys[_shouzimu] = [];
                            _shouzimus.push(_shouzimu);
                        }
                        _citys[_shouzimu].push({content:v.city});
                        _city = _city +"_"+ v.city;
                    }
                    
                });
                _shouzimus.sort();
                $rootScope.global.shoppers = data.shoppers;
                $rootScope.global.cityList = [];
                Zepto.each(_shouzimus, function (k, v) {
                    $rootScope.global.cityList.push({
                        content: v,
                        zm: true
                    });
                    $rootScope.global.cityList.push({
                        cityArea:  _citys[v],
                        zm: false
                    });
                });
            }

        });


    })
    .controller('DashCtrl', function ($scope, $rootScope, PostListService, CakeService, $ionicSlideBoxDelegate, webStorage, $ionicModal) {
        $scope.posts = [];
        $scope.cnt = 1;
        $scope.makeCakeList = [];
        $scope.themeCakeList = [];

        PostListService.postList({"filter[where][isShow]": 1}, function (flag, res) {
            if (flag) {
                $scope.posts = res;
            }
        });

        var watchSlide = $scope.$watch('posts', function () {
            $ionicSlideBoxDelegate.update();
        });
        setTimeout(watchSlide, 3000);

        CakeService.getCakeList({"filter[where][area][like]": $rootScope.currentCityBundle.content}, function (flag, res) {
            if (flag) {
                $scope.dashCakeList = res.slice(0, 10);
                $rootScope.global.cakeList = res;
            }
        });
        $scope.$watch('currentCityBundle', function () {
            CakeService.getCakeList({"filter[where][area][like]": $rootScope.currentCityBundle.content}, function (flag, res) {
                if (flag) {
                    $scope.dashCakeList = res.slice(0, 10);
                    $rootScope.global.cakeList = res;
                }
            });
        });

        $scope.loadMore = function () {
            if ($rootScope.global.cakeList) {
                $scope.cnt++;
                $scope.dashCakeList = $rootScope.global.cakeList.slice(0, 10 * $scope.cnt);
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }

        };

        $scope.$on('$stateChangeSuccess', function () {
            $scope.loadMore();
        });
        $scope.doRefresh = function () {
            CakeService.getCakeList({}, function (flag, res) {
                if (flag) {
                    $scope.dashCakeList = res.slice(0, 10);
                    $rootScope.global.cakeList = res;
                    $scope.$broadcast('scroll.refreshComplete');
                }
            });
            PostListService.postList({}, function (flag, res) {
                if (flag) {
                    $scope.posts = res;
                }
            });
            var watchSlide = $scope.$watch('posts', function () {
                $ionicSlideBoxDelegate.update();
            });
            setTimeout(watchSlide, 3000);

        };

        $ionicModal.fromTemplateUrl('my-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function () {
            $scope.modal.show();
        };
        $scope.closeModal = function () {
            $scope.modal.hide();
        };
        $scope.selectCity = function (_city) {
            $rootScope.currentCityBundle = _city;
            $scope.modal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });


    })

    .controller('CakeDetailCtrl', function ($scope, $rootScope, $stateParams, CakeService, $ionicSlideBoxDelegate, $ionicModal, DeliverAdressService, $ionicLoading, OrderService, CashCouponService,$ionicHistory) {
        location.href = location.origin + "/#/tab/cake/" + $stateParams.cakeId;
        $scope.cakeId = $stateParams.cakeId;
        CakeService.getCakeById({"filter[where][id]": $scope.cakeId}, function (flag, res) {
            if (flag) {
                $scope.cake = res;
                $scope.order = {
                    num: 1,
                    size: $scope.cake.sizeList[0],
                    deliver: 1,
                    price: $scope.cake.priceList[0],
                    cakeName: $scope.cake.title,
                    cakeId: $scope.cake.id,
                    orderStatus: 0,
                    deliverPrice: 0,
                    flavor: $scope.cake.flavorList[0]
                };
            }
        });

        var watchSlideDetail = $scope.$watch('cake', function () {
            $ionicSlideBoxDelegate.update();
        });
        setTimeout(watchSlideDetail, 2000);

        $scope.startDesign = function () {
            Zepto(".tab-nav").hide();
            $ionicHistory.clearCache();
            location.href = "#/tab/design/" + $scope.cakeId;
        };
        $scope.goBack =function(){
            if($ionicHistory.backView()){
                $ionicHistory.goBack();
            }else{
               location.href = "#/tab/dash"; 
            }
        };
        $scope.selectCoupon = function () {
            if (!!!$rootScope.user.id) {
                $rootScope.openLoginModal();
            } else {
                CashCouponService.listCashCoupon({"filter[where][userName]": $rootScope.user.username}, function (flag, res) {
                    if (flag) {
                        $rootScope.couponList = res;
                    }
                });
                $rootScope.couponModal.show();
            }
        };

        $ionicModal.fromTemplateUrl('my-makeOrder.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $rootScope.makeOrderModal = modal;
        });

        $scope.openMakeOrderModal = function () {
            $rootScope.makeOrderModal.show();
        };
        $scope.closeMakeOrderModal = function () {
            $rootScope.makeOrderModal.hide();
        };

        $scope.freeShip = function () {
            $scope.order.deliver = 1;
            $scope.order.deliverPrice = 0;
        };
        $scope.selfShip = function () {
            $scope.order.deliver = -1;
            $scope.order.deliverPrice = 0;
        };

        $scope.plusOne = function () {
            $scope.order.num++;
        };
        $scope.minusOne = function () {
            if ($scope.order.num > 1)
                $scope.order.num--;
        };
        $scope.selectFlavor = function (_fla) {
            $scope.order.flavor = _fla;
        };
        $scope.tips = "3-5人份";
        $scope.selectSize = function (_size, _index) {
            $scope.order.size = _size;
            $scope.tips = (_size - 5) + "-" + (_size - 4) + "人份";
            $scope.order.price = $scope.cake.priceList[_index];

        };

        $scope.subOrder = function () {
            if (!!!$rootScope.user.id) {
                $rootScope.openLoginModal();
            } else {
                if (!!!$rootScope.addressSelect.shipUserName) {
                    DeliverAdressService.listAddress({"filter[where][userId]": $rootScope.user.id || 0}, function (flag, res) {
                        if (flag) {
                            $rootScope.addressList = res;
                        }
                    });
                    $rootScope.addressModal.show();
                } else {
                    $ionicLoading.show({
                        template: '订单生成中...'
                    });
                    $ionicHistory.clearCache();
                    $scope.order.userId = $rootScope.user.id;
                    $scope.order.shopperId = $scope.cake.userId || $rootScope.user.id;
                    $scope.order.deliverUserName = $rootScope.addressSelect.shipUserName;
                    $scope.order.phone = $rootScope.addressSelect.shipTel;
                    $scope.order.address = $rootScope.addressSelect.shipAddress;
                    $scope.order.finalPic = $scope.cake.coverPic;
                    $scope.order.uploadPic = "";
                    var _tmpPrice = $scope.order.price - $rootScope.couponSelect.price;
                    // $scope.order.price = _tmpPrice>0?_tmpPrice:1;
                    $scope.order.price = 0.01;
                    $scope.order.createTime = new Date().getTime();
                    CakeService.updateCake({
                        id: $scope.cake.id,
                        soldCnt: (($scope.cake.soldCnt || 8) + 1)
                    }, function (flag, res) {
                        if (flag) {
                            OrderService.addOrder($scope.order, function (flag, res) {
                                if (flag) {
                                    $rootScope.makeOrderModal.hide();
                                    $ionicLoading.hide();
                                    Zepto(".tab-nav").show();
                                    location.href = "#/tab/order/" + res.id;
                                }
                            });
                        }
                    });
                    if ($rootScope.couponSelect.price) {
                        CashCouponService.addCashCoupon({
                            id: $rootScope.couponSelect.id,
                            isUse: 1
                        }, function (flag, res) {
                            if (flag) {

                            }
                        });
                    }
                }
            }
        };


        $scope.openAddressModal = function () {
            DeliverAdressService.listAddress({
                "filter[where][userId]": $rootScope.user.id || 0
            }, function (flag, res) {
                if (flag) {
                    $rootScope.addressList = res;
                }
            });
            $rootScope.addressModal.show();
        };


    })
    .controller('CakeListCtrl', function ($scope, $rootScope, $ionicHistory, CakeService, $ionicModal, $stateParams) {
        var condition = $stateParams.condition.split("=");
        var _key = "filter[where][" + (condition[0] || "theme") + "]";
        var _value = condition[1] || 1;
        $scope.theCakeList = [];
        $scope.cnt = 1;
        var _param = {};
        _param[_key] = _value;
        _param["filter[where][area][like]"] = $rootScope.currentCityBundle.content;
        CakeService.getCakeList(_param, function (flag, res) {
            if (flag) {
                $scope.filterCakeList = res;
                $scope.theCakeList = res.slice(0, 10);
            }
        });
        $scope.loadMore = function () {
            if ($scope.filterCakeList) {
                $scope.cnt = $scope.cnt + 1;
                $scope.theCakeList = $scope.filterCakeList.slice(0, 10 * $scope.cnt);
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
        };
        $scope.$on('$stateChangeSuccess', function () {
            $scope.loadMore();
        });
        $scope.goBack =function(){
            if($ionicHistory.backView()){
                $ionicHistory.goBack();
                $ionicHistory.clearCache();
            }else{
               location.href = "#/tab/dash"; 
            }
        };
        $scope.doRefresh = function () {
            CakeService.getCakeList(_param, function (flag, res) {
                if (flag) {
                    $scope.theCakeList = res.slice(0, 10);
                    $scope.filterCakeList = res;
                    $scope.$broadcast('scroll.refreshComplete');
                }
            });

        };


    })
    .controller('SearchCtrl', function ($scope, $rootScope,$ionicHistory,  $stateParams, UserService, CakeService) {
        $scope.category = 0;
        $scope.selectCat = function (_cat) {
            if ($scope.category == _cat) {
                $scope.category = 0;
            } else {
                $scope.category = _cat;

            }
        };
        $scope.goBack =function(){
            if($ionicHistory.backView()){
                $ionicHistory.goBack();
            }else{
               location.href = "#/tab/dash"; 
            }
        };
        $scope.keyWord = "";
        $scope.searchResult = [
            {
                content: "蛋糕店",
                zm: true
            },
            {
                cityArea: [],
                zm: false
            },
            {
                content: "推荐",
                zm: true
            },
            {
                cityArea: [],
                zm: false
            },
            {
                content: "蛋糕",
                zm: true
            },
            {
                cityArea: [],
                zm: false
            }];

        $scope.searchCon = function () {
            $scope.searchResult = [
                {
                    content: "蛋糕店",
                    zm: true
                },
                {
                    cityArea: [],
                    zm: false
                },
                {
                    content: $scope.keyWord + "推荐",
                    zm: true
                },
                {
                    cityArea: [],
                    zm: false
                },
                {
                    content: "蛋糕",
                    zm: true
                },
                {
                    cityArea: [],
                    zm: false
                }];
            UserService.shopper({}, function (flag, res) {
                if (flag) {
                    $scope.searchResult[1].cityArea = $scope.searchResult[1].cityArea.concat($.grep(res.shoppers, function (n, i) {
                        n.url = "#/tab/cakeList/userId=" + n.id;
                        return eval("/" + $scope.keyWord + "/g").test(n.nickname);
                    }));
                    $scope.searchResult[3].cityArea = $scope.searchResult[3].cityArea.concat($.grep(res.shoppers, function (n, i) {
                        n.url = "#/tab/cakeList/userId=" + n.id;
                        return eval("/" + $scope.keyWord + "/g").test(n.address);
                    }));
                }
            });

            CakeService.getCakeList({
                "filter[where][title][like]": $scope.keyWord,
                "filter[fields][title]": true,
                "filter[fields][id]": true,
                "filter[fields][coverPic]": true
            }, function (flag, res) {
                if (flag) {
                    $scope.searchResult[5].cityArea = $scope.searchResult[5].cityArea.concat($.grep(res, function (n, i) {
                        n.url = "#/tab/cakeList/id=" + n.id;
                        return true;
                    }));
                }
            });

        };


    })
    .controller('NearbyCtrl', function ($scope, $rootScope, CakeService) {
        $scope.orderHot = 0;
        $scope.orderDistance = 0;
        $scope.orderShop = 0;
        $scope.theNearCakeList = [];
        CakeService.getCakeList({"filter[where][area][like]": $rootScope.currentCityBundle.content}, function (flag, res) {
            if (flag) {
                $scope.filterCakeList = res;
                $scope.theNearCakeList = res.slice(0, 10);
            }
        });
        $scope.cnt = 1;
        $scope.loadMore = function () {
            if ($scope.filterCakeList) {
                $scope.cnt = $scope.cnt + 1;
                $scope.theNearCakeList = $scope.filterCakeList.slice(0, 10 * $scope.cnt);
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
        };
        $scope.$on('$stateChangeSuccess', function () {
            $scope.loadMore();
        });
        $scope.doRefresh = function () {
            CakeService.getCakeList({"filter[where][area][like]": $rootScope.currentCityBundle.content}, function (flag, res) {
                if (flag) {
                    $scope.theNearCakeList = res.slice(0, 10);
                    $scope.filterCakeList = res;
                    $scope.$broadcast('scroll.refreshComplete');
                }
            });

        };

        $scope.orderByShop = function () {
            $scope.orderShop = !$scope.orderShop;
            CakeService.getCakeList({
                "filter[where][area][like]": $rootScope.currentCityBundle.content,
                "filter[order]": "title desc"
            }, function (flag, res) {
                if (flag) {
                    $scope.theNearCakeList = res.slice(0, 10);
                    $scope.filterCakeList = res;
                }
            });
        };
        $scope.orderByHot = function () {
            $scope.orderHot = !$scope.orderHot;
            CakeService.getCakeList({
                "filter[where][area][like]": $rootScope.currentCityBundle.content,
                "filter[order]": "soldCnt desc"
            }, function (flag, res) {
                if (flag) {
                    $scope.theNearCakeList = res.slice(0, 10);
                    $scope.filterCakeList = res;
                }
            });
        };
        $scope.orderByComment = function () {
            $scope.orderDistance = !$scope.orderDistance;
            CakeService.getCakeList({
                "filter[where][area][like]": $rootScope.currentCityBundle.content,
                "filter[order]": "commentCnt desc"
            }, function (flag, res) {
                if (flag) {
                    $scope.theNearCakeList = res.slice(0, 10);
                    $scope.filterCakeList = res;
                }
            });
        };

    })
    .controller('MyselfCtrl', function ($scope, $rootScope, UserService, $stateParams, $fileUploader, DeliverAdressService, $ionicModal, webStorage, SMSService, $ionicLoading) {
        $scope.username = $rootScope.user.nickname || $rootScope.user.username || "点我登录";
        $scope.userlogo = $rootScope.user.avatar ? ($rootScope.user.avatar.indexOf("pictcake.cn") > 0 ? ($rootScope.user.avatar + "@1e_100w_100h_0c_0i_1o_1x.png") : $rootScope.user.avatar) : "/img/default.jpg";

        $scope.$watch('user', function () {
            $scope.username = $rootScope.user.nickname || $rootScope.user.username || "点我登录";
            $scope.userlogo = $rootScope.user.avatar ? ($rootScope.user.avatar.indexOf("pictcake.cn") > 0 ? ($rootScope.user.avatar + "@1e_100w_100h_0c_0i_1o_1x.png") : $rootScope.user.avatar) : "/img/default.jpg";
            $scope.self = {
                nickname: $rootScope.user.nickname || "",
                phone: $rootScope.user.phone || "",
                email: $rootScope.user.email || ""
            };
        });

        if (!!!$rootScope.user.username) {
            $rootScope.openLoginModal();
        }

        $scope.openAddressModal = function () {
            DeliverAdressService.listAddress({"filter[where][userId]": $rootScope.user.id || 0}, function (flag, res) {
                if (flag) {
                    $rootScope.addressList = res;
                }
            });
            $rootScope.addressModal.show();
        };
        $scope.changeLogo = function () {
            if (!!!$rootScope.user.username) {
                $rootScope.openLoginModal();
            } else {
                Zepto("#select_avd").click();
            }
        };

        var _policy = base64_encode(JSON.stringify({
            "expiration": "2016-12-01T12:00:00.000Z",
            "conditions": [
                {"bucket": "pictcakeuserpic"},
                ["starts-with", "$key", "user/"]
            ]
        }));
        var _tmpDateTime = new Date().getTime();
        SMSService.sign({policy: _policy}, function (flag, res) {
            if (flag) {
                var uploader = $scope.uploader = $fileUploader.create({
                    scope: $scope,
                    url: $rootScope.global.ossPicUploadUrl,
                    headers: {},
                    filters: [],
                    formData: [
                        {"OSSAccessKeyId": "------------"},
                        {"policy": _policy},
                        {"success_action_status": "201"},
                        {"Signature": res.sign},
                        {"key": "user/" + _tmpDateTime + "${filename}"}
                    ]
                });
                // REGISTER HANDLERS
                uploader.bind('afteraddingfile', function (event, item) {
                    $ionicLoading.show({
                        template: '上传中，请稍后...'
                    });
                    uploader.uploadAll();
                });
                uploader.bind('completeall', function (event, items) {
                    var _avatar = $rootScope.global.ossPicDownloadUrl + "user/" + _tmpDateTime + items[0].file.name;
                    $rootScope.user.avatar = _avatar;
                    UserService.updateAttributes({id: $rootScope.user.id, avatar: _avatar}, function (flag, res) {
                        $scope.userlogo = _avatar;
                        $rootScope.user.avatar = _avatar;
                        webStorage.remove("user");
                        webStorage.add("user", $rootScope.user);
                        $ionicLoading.hide();
                    });
                });

            }

        });


        $ionicModal.fromTemplateUrl('my-self.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $rootScope.selfModal = modal;
        });

        $scope.openSelfModal = function () {
            if (!!!$rootScope.user.username) {
                $rootScope.openLoginModal();
            } else {
                $rootScope.selfModal.show();
            }
        };
        $scope.closeSelfModal = function () {
            if ($scope.self.nickname != $rootScope.user.nickname || $scope.self.phone != $rootScope.user.phone || $scope.self.email != $rootScope.user.email) {
                UserService.updateAttributes({
                    id: $rootScope.user.id,
                    nickname: $scope.self.nickname,
                    phone: $scope.self.phone,
                    email: $scope.self.email
                }, function (flag, res) {
                    $rootScope.user.nickname = $scope.self.nickname;
                    $rootScope.user.phone = $scope.self.phone;
                    $rootScope.user.email = $scope.self.email;
                });
            }
            $rootScope.selfModal.hide();
        };
        $scope.self = {
            nickname: $rootScope.user.nickname || "",
            phone: $rootScope.user.phone || "",
            email: $rootScope.user.email || ""
        };

        document.addEventListener('DOMContentLoaded', init, false);

        function init() {
            var u = new UploadPic();
            u.init({
                input: document.querySelector('#select_avd')
            });
        }

        function UploadPic() {
            this.sw = 0;
            this.sh = 0;
            this.tw = 0;
            this.th = 0;
            this.scale = 0;
            this.maxSize = 0;
            this.fileSize = 0;
            this.fileDate = null;
            this.fileType = '';
            this.fileName = '';
            this.input = null;
            this.canvas = null;
            this.mime = {};
            this.type = '';
            this.callback = function () {
            };
            this.loading = function () {
            };
        }

        UploadPic.prototype.init = function (options) {
            this.input = options.input;
            this.mime = {'png': 'image/png', 'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'bmp': 'image/bmp'};
            this.callback = options.callback || function () {
                };
            this._addEvent();
        };

        /**
         * @description 绑定事件
         * @param {Object} elm 元素
         * @param {Function} fn 绑定函数
         */
        UploadPic.prototype._addEvent = function () {
            var _this = this;

            function tmpSelectFile(ev) {
                _this._handelSelectFile(ev);
            }

            this.input.addEventListener('change', tmpSelectFile, false);
        };

        /**
         * @description 绑定事件
         * @param {Object} elm 元素
         * @param {Function} fn 绑定函数
         */
        UploadPic.prototype._handelSelectFile = function (ev) {
            var file = ev.target.files[0];

            this.type = file.type;

// 如果没有文件类型，则通过后缀名判断（解决微信及360浏览器无法获取图片类型问题）
            if (!this.type) {
                this.type = this.mime[file.name.match(/\.([^\.]+)$/i)[1]];
            }

            if (!/image.(png|jpg|jpeg|bmp)/.test(this.type)) {
                alert('选择的文件类型不是图片');
                return;
            }

            if (file.size > this.maxSize) {
                alert('选择文件大于' + this.maxSize / 1024 / 1024 + 'M，请重新选择');
                return;
            }

            this.fileName = file.name;
            this.fileSize = file.size;
            this.fileType = this.type;
            this.fileDate = file.lastModifiedDate;

            this._readImage(file);
        };

        /**
         * @description 读取图片文件
         * @param {Object} image 图片文件
         */
        UploadPic.prototype._readImage = function (file) {
            var _this = this;
            this._getURI(file, this.callback);
        };

        /**
         * @description 通过文件获得URI
         * @param {Object} file 文件
         * @param {Function} callback 回调函数，返回文件对应URI
         * return {Bool} 返回false
         */
        UploadPic.prototype._getURI = function (file, callback) {
            var reader = new FileReader();
            var _this = this;

            function tmpLoad() {
// 头不带图片格式，需填写格式
                var re = /^data:base64,/;
                var ret = this.result + '';

                if (re.test(ret)) ret = ret.replace(re, 'data:' + _this.mime[_this.fileType] + ';base64,');

                callback && callback(ret);
            }

            reader.onload = tmpLoad;

            reader.readAsDataURL(file);

            return false;
        };


    })
    .controller('DesignCtrl', function ($scope, $rootScope,$ionicHistory,  UserService, PostListService, OrderService, $stateParams, CategoryService, DeliverAdressService, CakeService, $fileUploader, $ionicModal, $ionicPopover, $ionicLoading, SMSService, CashCouponService,$timeout) {
        Zepto(".tab-nav").hide();
        Zepto(".select-cat").parent().parent().css("bottom", "0px");
        $scope.cakeId = $stateParams.cakeId;
        $scope.cake = {};
        $scope.category = 0;

        Zepto("#canvas").css("width", document.documentElement.clientWidth);
        Zepto("#canvas").css("height", document.documentElement.clientHeight);
        Zepto("#canvas").attr("width", document.documentElement.clientWidth);
        Zepto("#canvas").attr("height", document.documentElement.clientHeight);
        window.canvas = new fabric.Canvas('canvas', {
            isDrawingMode: false,
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight
        });

        CakeService.getCakeById({id: $scope.cakeId}, function (flag, res) {
            if (flag) {
                $scope.cake = res;
                $scope.order = {
                    num: 1,
                    size: 10,
                    deliver: 1,
                    price: $scope.cake.priceList[0],
                    cakeName: $scope.cake.title,
                    cakeId: $scope.cake.id,
                    orderStatus: 0,
                    deliverPrice: 0,
                    flavor: $scope.cake.flavorList[0]
                };
                $ionicLoading.show({
                    template: '蛋糕模型图片加载中...'
                });
                fabric.util.loadImage(($scope.cake.modelPic+"@0o_0l_100sh_540w.png"), function (omg) {
                    var oImg = new fabric.Image(omg);
                    //使其不可选中
                    oImg.selectable = false;
                    //使其事件忽略，相当于事件穿透
                    oImg.evented = false;
                    oImg.scaleToHeight(document.documentElement.clientHeight);
                    oImg.scaleToWidth(document.documentElement.clientWidth);
                    oImg.set({
                        left: 0,
                        top: (document.documentElement.clientHeight - oImg.getHeight()) / 2,
                        hasControls: false,
                        hasBorders: false
                    });
                    window.canvas.add(oImg);
                    window.canvas.renderAll();
                    window.backImg = oImg;
                    $ionicLoading.hide();

                }, null, {crossOrigin: 'Anonymous'});
            }
        });

        Zepto(".upper-canvas").css("width", document.documentElement.clientWidth);
        Zepto(".upper-canvas").css("height", document.documentElement.clientHeight);
        Zepto(".upper-canvas").attr("width", document.documentElement.clientWidth);
        Zepto(".upper-canvas").attr("height", document.documentElement.clientHeight);
        Zepto(".canvas-container").attr("height", document.documentElement.clientHeight - 40);
        Zepto(".canvas-container").css("height", document.documentElement.clientHeight - 40);

        var _policy = base64_encode(JSON.stringify({
            "expiration": "2016-12-01T12:00:00.000Z",
            "conditions": [
                {"bucket": "pictcakeuserpic"},
                ["starts-with", "$key", "user/"]
            ]
        }));
        var _tmpDateTime = new Date().getTime();
        var _tmpDateTime1 = new Date().getTime() + 1;
        SMSService.sign({policy: _policy}, function (flag, res) {
            if (flag) {
                $scope.resSign = res.sign;
                $scope.uploader = $fileUploader.create({
                    scope: $scope, // to automatically update the html. Default: $rootScope
                    url: $rootScope.global.ossPicUploadUrl,
                    headers: {},
                    filters: [],
                    formData: [
                        {"OSSAccessKeyId": "--------------"},
                        {"policy": _policy},
                        {"success_action_status": "201"},
                        {"Signature": res.sign},
                        {"key": "user/" + _tmpDateTime + "${filename}"}
                    ]
                });
                // REGISTER HANDLERS
                $scope.uploader.bind('afteraddingfile', function (event, item) {

                    var reader = new FileReader();
                    reader.onload = function (event) {
                        var imgObj = new Image();
                        imgObj.src = event.target.result;
                        imgObj.onload = function () {
                            var image = new fabric.Image(imgObj);

                            image.scaleToHeight(document.documentElement.clientHeight / 2);
                            image.scaleToWidth(document.documentElement.clientWidth / 2);
                            image.set({
                                crossOrigin: "Anonymous",
                                angle: 0,
                                left: (document.documentElement.clientWidth - image.getWidth()) / 2,
                                top: (document.documentElement.clientHeight - image.getHeight()) / 2,
                                hasControls: false,
                                hasBorders: false
                            });
                            window.canvas.add(image);
                            window.backImg.bringToFront();
                        };
                    };
                    reader.readAsDataURL(item.file);
                    window.canvas.renderAll();
                });

                $scope.uploader.bind('completeall', function (event, items) {
                    $scope.order.userId = $rootScope.user.id;
                    $scope.order.shopperId = $scope.cake.userId || $rootScope.user.id;
                    $scope.order.deliverUserName = $rootScope.addressSelect.shipUserName;
                    $scope.order.phone = $rootScope.addressSelect.shipTel;
                    $scope.order.address = $rootScope.addressSelect.shipAddress;
                    $scope.order.finalPic = $rootScope.global.ossPicDownloadUrl + "user/" + _tmpDateTime + (items[0].file.name || "blob");
                    $scope.order.uploadPic = $rootScope.global.ossPicDownloadUrl + "user/" + _tmpDateTime1 + (items[1].file.name || "blob");
                    var _tmpPrice = $scope.order.price - $rootScope.couponSelect.price;
                    // $scope.order.price = _tmpPrice>0?_tmpPrice:1;
                    $scope.order.price = 0.01;
                    $scope.order.createTime = new Date().getTime();
                    CakeService.updateCake({
                        id: $scope.cake.id,
                        soldCnt: (($scope.cake.soldCnt || 8) + 1)
                    }, function (flag, res) {
                        if (flag) {
                            OrderService.addOrder($scope.order, function (flag, res) {
                                if (flag) {
                                    $rootScope.makeOrderModal.hide();
                                    $rootScope.previewModal.hide();
                                    $ionicLoading.hide();
                                    Zepto(".tab-nav").show();
                                    location.href = "#/tab/order/" + res.id;
                                }
                            });
                        }
                    });
                });
            }
        });

        $ionicModal.fromTemplateUrl('my-preview.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $rootScope.previewModal = modal;
        });

        $scope.openPreviewModal = function () {
            window.backImg.bringToFront();
            $scope.previewImg = window.canvas.toDataURL('image/png');
            window.canvas.setWidth(document.documentElement.clientWidth*3);
            window.canvas.setHeight(document.documentElement.clientHeight*3);
            window.canvas.setZoom(3);
            window.backImg.visible = false;
            window.canvas.renderAll();
            $scope.uploadPic = window.canvas.toDataURL('image/png');
            $rootScope.previewModal.show();
        };
        $scope.closePreviewModal = function () {
            window.canvas.setWidth(document.documentElement.clientWidth);
            window.canvas.setHeight(document.documentElement.clientHeight);
            window.canvas.setZoom(1);

            window.backImg.sendToBack();
            window.backImg.visible = true;
            window.canvas.renderAll();
            $rootScope.previewModal.hide();

        };
        $scope._tmpCatPicId = "";
        $scope._tmpCatTxtId = "";
        CategoryService.categoryList(-1, function (flag, data) {
            if (flag) {
                Zepto.each(data, function (k, v) {
                    if (v.title === "图片") {
                        $scope._tmpCatPicId = v.id;
                    }
                    if (v.title === "文字") {
                        $scope._tmpCatTxtId = v.id;
                    }
                });
            }
        });
        $scope.materiaList = [];
        $scope.textList = [];
        $scope.selectCat = function (_cat) {
            $scope.category = _cat;
            if (_cat == 1) {
                $ionicLoading.show({
                    template: '素材图片加载中...'
                });
                if($scope.materiaList.length < 1) {
                    CategoryService.categoryList($scope._tmpCatPicId, function (flag, data) {
                        if (flag) {
                            $scope.cateList = data;
                            PostListService.materialList(function (flag, _data) {
                                Zepto.each($scope.cateList, function (k, v) {
                                    $scope.materiaList.push({
                                        catName: v.title,
                                        picList: $.grep(_data, function (n, i) {
                                            return n.categoryId == v.id;
                                        })
                                    });
                                });

                            });
                        }
                        $ionicLoading.hide();
                    });
                }else{
                    $ionicLoading.hide();
                }

                $scope.popover.show();
            }
            if (_cat == 2) {
                Zepto("#selectFile").click();
            }
            if (_cat == 3) {
                $ionicLoading.show({
                    template: '素材图片加载中...'
                });
                if($scope.textList.length < 1) {
                    CategoryService.categoryList($scope._tmpCatTxtId, function (flag, data) {
                        if (flag) {
                            $scope.cateList = data;
                            PostListService.materialList(function (flag, _data) {
                                Zepto.each($scope.cateList, function (k, v) {
                                    $scope.textList.push({
                                        catName: v.title,
                                        picList: $.grep(_data, function (n, i) {
                                            return n.categoryId == v.id;
                                        })
                                    });

                                });
                            });
                        }
                        $ionicLoading.hide();
                    });
                }else{
                    $ionicLoading.hide();
                }

                $scope.popover.show();
            }

            if (_cat == 4) {
                window.canvas.remove(window.canvas.getActiveObject());
            }
        };
        $ionicPopover.fromTemplateUrl('my-popover.html', {
            scope: $scope
        }).then(function (popover) {
            $scope.popover = popover;
        });
        $scope.openPopover = function ($event) {
            $scope.popover.show($event);
        };
        $scope.closePopover = function () {
            $scope.popover.hide();
        };

        $scope.paintPic = function (_pic) {
            var imgObj = new Image();
            imgObj.crossOrigin = "anonymous";
            imgObj.src = _pic+"@0o_0l_70h.png?t="+new Date().getTime();
            $ionicLoading.show({
                template: '素材图片加载中...'
            });
            imgObj.onload = function () {
                var image = new fabric.Image(imgObj);
                image.set({
                    angle: 0,
                    left: (document.documentElement.clientWidth - image.getWidth()) / 2,
                    top: (document.documentElement.clientHeight - image.getHeight()) / 2,
                    hasControls: false,
                    hasBorders: false
                });
                window.canvas.add(image);
                window.backImg.bringToFront();
                $ionicLoading.hide();
            };

            //fabric.util.loadImage(_pic.picture, function (omg) {
            //    var oImg = new fabric.Image(omg);
            //    //oImg.selectable = false;
            //    oImg.scaleToHeight(document.documentElement.clientHeight);
            //    oImg.scaleToWidth(document.documentElement.clientWidth);
            //    oImg.set({
            //        left: 0,
            //        top: (document.documentElement.clientHeight - oImg.getHeight()) / 2,
            //        hasControls: false,
            //        hasBorders: false
            //    });
            //    window.canvas.add(oImg);
            //    window.canvas.renderAll();
            //}, null, {crossOrigin: 'Anonymous'});

            $scope.popover.hide();
        };

        $ionicModal.fromTemplateUrl('my-makeOrder.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $rootScope.makeOrderModal = modal;
        });

        $scope.openMakeOrderModal = function () {
            $ionicLoading.show({
                template: '正在优化您的美图，稍等哦...'
            });
            $timeout(function() {
                $scope.previewImg = window.canvas.toDataURL('image/png');
                window.canvas.setWidth(document.documentElement.clientWidth * 3);
                window.canvas.setHeight(document.documentElement.clientHeight * 3);
                window.canvas.setZoom(3);
                window.backImg.visible = false;
                window.canvas.renderAll();
                $scope.uploadPic = window.canvas.toDataURL('image/png');
                $ionicLoading.hide();
                $rootScope.makeOrderModal.show();
            },100);
        };
        $scope.closeMakeOrderModal = function () {
            window.canvas.setWidth(document.documentElement.clientWidth);
            window.canvas.setHeight(document.documentElement.clientHeight);
            window.backImg.visible = true;
            window.canvas.setZoom(1);
            window.canvas.renderAll();
            $rootScope.makeOrderModal.hide();
        };

        $scope.freeShip = function () {
            $scope.order.deliver = 1;
            $scope.order.deliverPrice = 0;
        };
        $scope.selfShip = function () {
            $scope.order.deliver = -1;
            $scope.order.deliverPrice = 0;
        };
        $scope.plusOne = function () {
            $scope.order.num++;
        };
        $scope.minusOne = function () {
            if ($scope.order.num > 1)
                $scope.order.num--;
        };
        $scope.selectFlavor = function (_fla) {
            $scope.order.flavor = _fla;
        };
        $scope.tips = "3-5人份";
        $scope.selectSize = function (_size, _index) {
            $scope.order.size = _size;
            $scope.tips = (_size - 5) + "-" + (_size - 4) + "人份";
            $scope.order.price = $scope.cake.priceList[_index];
        };

        $scope.subOrder = function () {
            if (!!!$rootScope.user.id) {
                $rootScope.openLoginModal();
            } else {
                if (!!!$rootScope.addressSelect.shipUserName) {
                    DeliverAdressService.listAddress({"filter[where][userId]": $rootScope.user.id || 0}, function (flag, res) {
                        if (flag) {
                            $rootScope.addressList = res;
                        }
                    });
                    $rootScope.addressModal.show();
                } else {
                    $scope.uploader.clearQueue();
                    $scope.uploader.addToQueue(dataURLtoBlob($scope.previewImg), {
                        formData: [
                            {"OSSAccessKeyId": "f4SPykrAtaEXsprr"},
                            {"policy": _policy},
                            {"success_action_status": "201"},
                            {"Signature": $scope.resSign},
                            {"key": "user/" + _tmpDateTime + "${filename}"}
                        ]
                    });
                    $scope.uploader.addToQueue(dataURLtoBlob($scope.uploadPic), {
                        formData: [
                            {"OSSAccessKeyId": "f4SPykrAtaEXsprr"},
                            {"policy": _policy},
                            {"success_action_status": "201"},
                            {"Signature": $scope.resSign},
                            {"key": "user/" + _tmpDateTime1 + "${filename}"}
                        ]
                    });
                    $scope.uploader.uploadAll();
                    $ionicLoading.show({
                        template: '订单生成中...'
                    });
                }
            }
        };

        $scope.selectCoupon = function () {
            if (!!!$rootScope.user.id) {
                $rootScope.openLoginModal();
            } else {
                CashCouponService.listCashCoupon({"filter[where][userName]": $rootScope.user.username}, function (flag, res) {
                    if (flag) {
                        $rootScope.couponList = res;
                    }
                });
                $rootScope.couponModal.show();
            }
        };

        $scope.openAddressModal = function () {
            DeliverAdressService.listAddress({
                "filter[where][userId]": $rootScope.user.id || 0
            }, function (flag, res) {
                if (flag) {
                    $rootScope.addressList = res;
                }
            });
            $rootScope.addressModal.show();
        };
        $scope.leave = function () {
            Zepto(".tab-nav").show();
            // location.href = "#/tab/cake/" + $scope.cakeId;
            if($ionicHistory.backView()){
                $ionicHistory.goBack();
                $ionicHistory.clearCache();
            }else{
               location.href = "#/tab/dash"; 
            }
            
        };

        document.addEventListener('DOMContentLoaded', init, false);

        function init() {
            var u = new UploadPic();
            u.init({
                input: document.querySelector('#selectFile')
            });
        }

        function UploadPic() {
            this.sw = 0;
            this.sh = 0;
            this.tw = 0;
            this.th = 0;
            this.scale = 0;
            this.maxSize = 0;
            this.fileSize = 0;
            this.fileDate = null;
            this.fileType = '';
            this.fileName = '';
            this.input = null;
            this.canvas = null;
            this.mime = {};
            this.type = '';
            this.callback = function () {
            };
            this.loading = function () {
            };
        }

        UploadPic.prototype.init = function (options) {
            this.input = options.input;
            this.mime = {'png': 'image/png', 'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'bmp': 'image/bmp'};
            this.callback = options.callback || function () {
                };
            this._addEvent();
        };

        UploadPic.prototype._addEvent = function () {
            var _this = this;

            function tmpSelectFile(ev) {
                _this._handelSelectFile(ev);
            }

            this.input.addEventListener('change', tmpSelectFile, false);
        };

        UploadPic.prototype._handelSelectFile = function (ev) {
            var file = ev.target.files[0];

            this.type = file.type;

// 如果没有文件类型，则通过后缀名判断（解决微信及360浏览器无法获取图片类型问题）
            if (!this.type) {
                this.type = this.mime[file.name.match(/\.([^\.]+)$/i)[1]];
            }

            if (!/image.(png|jpg|jpeg|bmp)/.test(this.type)) {
                alert('选择的文件类型不是图片');
                return;
            }

            if (file.size > this.maxSize) {
                alert('选择文件大于' + this.maxSize / 1024 / 1024 + 'M，请重新选择');
                return;
            }

            this.fileName = file.name;
            this.fileSize = file.size;
            this.fileType = this.type;
            this.fileDate = file.lastModifiedDate;

            this._readImage(file);
        };

        UploadPic.prototype._readImage = function (file) {
            var _this = this;
            this._getURI(file, this.callback);
        };

        UploadPic.prototype._getURI = function (file, callback) {
            var reader = new FileReader();
            var _this = this;

            function tmpLoad() {
// 头不带图片格式，需填写格式
                var re = /^data:base64,/;
                var ret = this.result + '';

                if (re.test(ret)) ret = ret.replace(re, 'data:' + _this.mime[_this.fileType] + ';base64,');

                callback && callback(ret);
            }

            reader.onload = tmpLoad;

            reader.readAsDataURL(file);

            return false;
        };

    })
    .controller('OrderCtrl', function ($scope, $rootScope, $ionicHistory, $stateParams, OrderService, $ionicLoading, $ionicPopup, $location, webStorage,SMSService,$timeout) {
        $scope.orderId = $stateParams.orderId;
        $scope.order = {};
        if($rootScope.global.inWeixin){
            $scope.payMethod = 2;
        }else{
            $scope.payMethod = 1;
        }
        
        
        OrderService.getOrderById({id: $scope.orderId}, function (flag, res) {
            if (flag) {
                $scope.order = res;
                switch ($scope.order.orderStatus) {
                    case 0:
                        $scope.orderStatus = "未付款";
                        break;
                    case 1:
                        $scope.orderStatus = "已付款，待处理";
                        break;
                    case 2:
                        $scope.orderStatus = "制作完成，配送中";
                        break;
                    case 3:
                        $scope.orderStatus = "交易成功，待评论";
                        break;
                    case 4:
                        $scope.orderStatus = "交易成功，已评论";
                        break;
                    case 5:
                        $scope.orderStatus = "售后处理中";
                        break;
                    case 6:
                        $scope.orderStatus = "售后成功";
                        break;
                    case 7:
                        $scope.orderStatus = "售后成功，已评论";
                        break;
                }
                var _code = window.location.href.match(new RegExp("[\?\&]code=([^\&]+)", "i"));

                if (_code && _code.length > 1) {

                    OrderService.getopenid({code: _code[1]}, function (flag, res) {
                        if (flag) {
                            OrderService.getCharge({
                                amount: $scope.order.price * 100,
                                channel: 'wx_pub',
                                order_no: $scope.orderId,
                                open_id: res.openid
                            }, function (flag, res) {
                                if (flag) {
                                    pingpp.createPayment(res, function (result, err) {
                                        if (result == "success") {
                                            // payment succeed
                                            OrderService.notifyResult({charge: res.id}, function (flag, res) {
                                                if (flag) {
                                                    if (res.charge.paid) {
                                                        OrderService.updateOrder({
                                                            id: $scope.orderId,
                                                            orderStatus: 1,
                                                            chargeId: res.id
                                                        }, function (flag, res) {
                                                            if (flag) {
                                                                var alertPopup = $ionicPopup.alert({
                                                                    title: '微信支付成功',
                                                                    template: '感谢亲的信任，我们努力做到最好',
                                                                    buttons: [
                                                                        {
                                                                            text: '确定', type: 'button-positive',
                                                                            onTap: function (e) {
                                                                                var _shop = {};
                                                                                Zepto.each($rootScope.global.shoppers, function (k, v) {
                                                                                    //v.city
                                                                                    if(v.id == $scope.order.shopperId){
                                                                                       _shop = v;
                                                                                    }
                                                                                    
                                                                                });
                                                                                SMSService.sendTips({phone: $scope.order.phone,name:($rootScope.user.nickname || $rootScope.user.username),contact:($scope.order.phone+"_"+$scope.order.address),shop:"18611709409",hashcode:b64_hmac_sha1($scope.order.phone+"na1ke","")}, function (flag, data) {});
                                                                                SMSService.sendTips({phone: "18611709409",name:($rootScope.user.nickname || $rootScope.user.username),contact:($scope.order.phone+"_"+$scope.order.address),shop:$scope.order.phone,hashcode:b64_hmac_sha1("18611709409"+"na1ke","")}, function (flag, data) {});

                                                                                $timeout(function() {
                                                                                    $ionicHistory.clearCache();
                                                                                    location.href = "#/tab/myOrder/2";
                                                                                },500);

                                                                            }
                                                                        }
                                                                    ]
                                                                });
                                                            }
                                                        });
                                                    } else {
                                                        $ionicPopup.alert({
                                                            title: '提示',
                                                            template: '支付失败，请重试'
                                                        });
                                                    }

                                                }
                                            });
                                        } else {

                                            $ionicPopup.alert({
                                                title: '提示',
                                                template: '支付失败，请重试'
                                            });
                                            console.log(result + " " + err.msg + " " + err.extra);
                                        }
                                    });
                                } else {
                                    $ionicPopup.alert({
                                        title: '提示',
                                        template: '支付失败，请重试'
                                    });
                                    console.log(result + " " + err.msg + " " + err.extra);
                                }
                            });
//                        pingpp_one.init({
//                            app_id:'app_qPK4m5TGK0uTPiPC',    //该应用在ping++的应用ID
//                            order_no:$scope.orderId,   //订单在商户系统中的订单号
//                            amount:$scope.order.price*100,               //订单价格，单位：人民币 分
//                            // 壹收款页面上需要展示的渠道，数组，数组顺序即页面展示出的渠道的顺序
//                            // upmp_wap 渠道在微信内部无法使用，若用户未安装银联手机支付控件，则无法调起支付
//                            channel:['wx_pub'],
//                            charge_url:$rootScope.global.baseUrl+'/Orders/getCharge',  //商户服务端创建订单的url
//                            open_id: res.openid
//                        },function(res){
//                          console.log(res);
//                            if(!res.status){
//                                console.log(res.msg);//处理错误
//                            }
//                      });
                        }
                    });

                }
                if ($location.search().result && $location.search().result == 'success') {
                    var _charge = webStorage.get($scope.orderId);
                    if (_charge) {
                        webStorage.remove($scope.orderId);
                        OrderService.notifyResult({charge: _charge.id}, function (flag, res) {
                            if (flag) {
                                if (res.charge.paid) {
                                    OrderService.updateOrder({
                                        id: $scope.orderId,
                                        orderStatus: 1,
                                        chargeId: _charge.id
                                    }, function (flag, res) {
                                        if (flag) {
                                            var alertPopup = $ionicPopup.alert({
                                                title: '支付成功',
                                                template: '感谢亲的信任，我们努力做到最好',
                                                buttons: [
                                                    {
                                                        text: '确定', type: 'button-positive',
                                                        onTap: function (e) {
                                                            var _shop = {};
                                                            Zepto.each($rootScope.global.shoppers, function (k, v) {
                                                                //v.city
                                                                if(v.id == $scope.order.shopperId){
                                                                   _shop = v;
                                                                }
                                                                
                                                            });
                                                            SMSService.sendTips({phone: $scope.order.phone,name:($rootScope.user.nickname || $rootScope.user.username),contact:($scope.order.phone+"_"+$scope.order.address),shop:"18611709409",hashcode:b64_hmac_sha1($scope.order.phone+"na1ke","")}, function (flag, data) {});
                                                            SMSService.sendTips({phone: "18611709409",name:($rootScope.user.nickname || $rootScope.user.username),contact:($scope.order.phone+"_"+$scope.order.address),shop:$scope.order.phone,hashcode:b64_hmac_sha1("18611709409"+"na1ke","")}, function (flag, data) {});

                                                            $timeout(function() {
                                                                $ionicHistory.clearCache();
                                                                location.href = "#/tab/myOrder/2";
                                                            },500);

                                                        }
                                                    }
                                                ]
                                            });
                                        }
                                    });
                                } else {
                                    $ionicPopup.alert({
                                        title: '提示',
                                        template: '支付失败，请重试'
                                    });
                                }

                            }
                        });
                    }

                }

            }

        });
//        alert(location.href);


        $scope.changePay = function (_index) {
            $scope.payMethod = _index;
        };
        $scope.goBack =function(){
            if($ionicHistory.backView()){
                $ionicHistory.goBack();
            }else{
               location.href = "#/tab/dash"; 
            }
        };
        $scope.payOrder = function () {
            $ionicHistory.clearCache();
            $ionicLoading.show({
                template: '正在跳转支付页面，请稍后...'
            });
            if ($scope.payMethod == 1) {
                OrderService.getCharge({
                    amount: $scope.order.price * 100,
                    channel: 'alipay_wap',
                    order_no: $scope.orderId,
                    success_url: $rootScope.global.mainUrl + "#/tab/order/" + $scope.orderId,
                    cancel_url: $rootScope.global.mainUrl + "#/tab/order/" + $scope.orderId
                }, function (flag, res) {
                    if (flag) {
                        webStorage.add($scope.orderId, res);
                        pingpp.createPayment(res, function (result, err) {
                            if (result == "success") {
                                // payment succeed                                        
                                //OrderService.updateOrder({id: $scope.orderId, orderStatus: 1}, function (flag, res) {
                                //    if (flag) {
                                //        location.href = "#/tab/myOrder";
                                //    }
                                //});
                            } else {
                                $ionicLoading.hide();
                                $ionicPopup.alert({
                                    title: '提示',
                                    template: '支付失败，请在我的订单中查看'
                                });
                                console.log(result + " " + err.msg + " " + err.extra);
                            }
                        });
                    } else {
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            title: '提示',
                            template: '支付失败，请在我的订单中查看'
                        });
                    }
                });
//                pingpp_one.init({
//                    app_id:'app_qPK4m5TGK0uTPiPC',    //该应用在ping++的应用ID
//                    order_no:$scope.orderId,   //订单在商户系统中的订单号
//                    amount:$scope.order.price*100,               //订单价格，单位：人民币 分
//                    // 壹收款页面上需要展示的渠道，数组，数组顺序即页面展示出的渠道的顺序
//                    // upmp_wap 渠道在微信内部无法使用，若用户未安装银联手机支付控件，则无法调起支付
//                    channel:['alipay_wap'],
//                    charge_url:$rootScope.global.baseUrl+'/Orders/getCharge',  //商户服务端创建订单的url
//                    charge_param:{success_url: "#/tab/order/"+$scope.orderId,cancel_url:"#/tab/order/"+$scope.orderId}
//                   
//                },function(res){
//                  console.log(res);
//                    if(!res.status){
//                        console.log(res.msg);//处理错误
//                    }
//              });
            } else {
                OrderService.oauth({appid: location.href}, function (flag, res) {
                    location.href = res.url;
                });
            }

        };

//        pingpp_one.success(function(res){
//            if(!res.status){
//                console.log(res.msg);
//            }
//        },function(){
//            OrderService.updateOrder({id:Zepto(".p_one_order_num").html(),orderStatus:1},function(flag,res){
//                if(flag){
//                    location.href="#/tab/myOrder";
//                    location.reload();
//                }
//            });
//        });

    })

    .controller('MyOrderCtrl', function ($scope, $rootScope, $ionicHistory, OrderService, $ionicPopup,$stateParams) {
        if (!!!$rootScope.user.username) {
            $rootScope.openLoginModal();
        }
        OrderService.listOrder({
            "filter[where][userId]": $rootScope.user.id || 0
        }, function (flag, res) {
            if (flag) {
                $scope.category = $stateParams.cat || 1;
                $scope.tempOrderList = $.grep(res, function (n, i) {
                    return n.orderStatus === 0;
                }).reverse();

            }
        });
        $scope.tempOrderList = [];
        $scope.goBack =function(){
            if($ionicHistory.backView()){
                $ionicHistory.clearCache();
                $ionicHistory.goBack();
            }else{
               location.href = "#/tab/dash"; 
            }
        };
        $scope.selectCat = function (_cat) {
            $scope.category = _cat;
            OrderService.listOrder({
                "filter[where][userId]": $rootScope.user.id || 0
            }, function (flag, res) {
                if (flag) {
                    if ($scope.category == 1) {
                        $scope.tempOrderList = $.grep(res, function (n, i) {
                            return n.orderStatus === 0;
                        }).reverse();
                    }
                    if ($scope.category == 2) {
                        $scope.tempOrderList = $.grep(res, function (n, i) {
                            return (n.orderStatus == 1) || (n.orderStatus == 2);
                        }).reverse();
                    }
                    if ($scope.category == 3) {
                        $scope.tempOrderList = $.grep(res, function (n, i) {
                            return n.orderStatus > 2;
                        }).reverse();
                    }
                }
            });
        };
        $scope.doRefresh = function () {
            OrderService.listOrder({
                "filter[where][userId]": $rootScope.user.id || 0

            }, function (flag, res) {
                if (flag) {
                    if ($scope.category == 1) {
                        $scope.tempOrderList = $.grep(res, function (n, i) {
                            return n.orderStatus === 0;
                        }).reverse();
                    }
                    if ($scope.category == 2) {
                        $scope.tempOrderList = $.grep(res, function (n, i) {
                            return (n.orderStatus == 1) || (n.orderStatus == 2);
                        }).reverse();
                    }
                    if ($scope.category == 3) {
                        $scope.tempOrderList = $.grep(res, function (n, i) {
                            return n.orderStatus > 2;
                        }).reverse();
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                }
            });

        };
        $scope.notifyShop = function () {
            var alertPopup = $ionicPopup.alert({
                title: '提醒成功',
                template: '亲，已提醒蛋糕店制作蛋糕啦',
                buttons: [
                    {text: '确定', type: 'button-positive'}
                ]
            });
        };
        $scope.deleteOrder = function (_order) {
            var confirmPopup = $ionicPopup.confirm({
                title: '删除订单',
                template: '确认要删除该条订单记录吗',
                buttons: [
                    {
                        text: '确定', type: 'button-positive',
                        onTap: function (e) {
                            OrderService.updateOrder({id: _order.id, orderStatus: -1}, function (flag, res) {
                                _order.orderStatus = -1;
                            });
                        }
                    },
                    {text: '取消', type: 'button-default'}
                ]
            });

        };

    })
    .controller('MoreCtrl', function ($scope, $rootScope, $stateParams, $ionicModal, $ionicPopup) {
        $scope.kind = $stateParams.kind;
        $scope._height = document.documentElement.clientHeight - 42;
        $scope._width = document.documentElement.clientWidth;
        $ionicModal.fromTemplateUrl('safe.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $rootScope.safeModal = modal;
            $scope.showPage();
        });

        $scope.openSafeModal = function () {
            $rootScope.safeModal.show();
        };
        $scope.closeSafeModal = function () {
            $rootScope.safeModal.hide();
        };
        $ionicModal.fromTemplateUrl('official.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $rootScope.officialModal = modal;
            $scope.showPage();
        });

        $scope.openOfficialModal = function () {
            $rootScope.officialModal.show();
        };
        $scope.closeOfficialModal = function () {
            $rootScope.officialModal.hide();
        };
        $scope.storys = [
            "/img/story2.jpg","/img/story1.jpg","/img/story3.jpg", "/img/story4.jpg", "/img/story5.jpg", "/img/story6.jpg", "/img/story7.jpg"
        ];
        $ionicModal.fromTemplateUrl('story.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $rootScope.storyModal = modal;
            $scope.showPage();
        });

        $scope.openStoryModal = function () {
            $rootScope.storyModal.show();
        };
        $scope.closeStoryModal = function () {
            $rootScope.storyModal.hide();
        };

        $ionicModal.fromTemplateUrl('app.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $rootScope.appModal = modal;
            $scope.showPage();
        });

        $scope.openAppModal = function () {
            $rootScope.appModal.show();
        };
        $scope.closeAppModal = function () {
            $rootScope.appModal.hide();
        };

        $scope.abouts = [
            "/img/about1.jpg", "/img/about2.jpg", "/img/about3.jpg", "/img/about4.jpg"
        ];
        $ionicModal.fromTemplateUrl('about.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $rootScope.aboutModal = modal;
            $scope.showPage();
        });

        $scope.openAboutModal = function () {
            $rootScope.aboutModal.show();
        };
        $scope.closeAboutModal = function () {
            $rootScope.aboutModal.hide();
        };
        $scope.downloadTips = function () {
            $ionicPopup.alert({
                title: '提示',
                template: '亲，暂时没有发布Iphone版本，欢迎体验网页版',
                buttons: [
                    {text: '确定', type: 'button-positive'}
                ]
            });
        };

        $scope.showPage = function () {
            switch (parseInt($scope.kind)) {
                case 1:
                    $scope.openStoryModal();
                    break;
                case 2:
                    $scope.openAppModal();
                    break;
                case 3:
                    $scope.openOfficialModal();
                    break;
                case 4:
                    $scope.openSafeModal();
                    break;
                case 5:
                    $scope.openAboutModal();
                    break;
            }
        };
    })
;
