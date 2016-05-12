// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'lbServices', 'webStorageModule','angularFileUpload','pictcakeTemplates','ngIOS9UIWebViewPatch'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleLightContent();
            }
        });

    })

    .config(function ($stateProvider, $urlRouterProvider, LoopBackResourceProvider,$ionicConfigProvider,$locationProvider,$httpProvider) {
        //$ionicConfigProvider.views.maxCache(3);
        $ionicConfigProvider.tabs.position("bottom");
        $ionicConfigProvider.tabs.style("standard");
        LoopBackResourceProvider.setAuthHeader("X-Access-Token");
        LoopBackResourceProvider.setUrlBase("---接口url--");
        //去掉hash #号
        //$locationProvider.html5Mode(true);
        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider
            // setup an abstract state for the tabs directive
            .state('tab', {
                url: "/tab",
                abstract: true,
                templateUrl: "tabs.html",
                controller: 'TabCtrl'
            })

            // Each tab has its own nav history stack:

            .state('tab.dash', {
                url: '/dash',
                views: {
                    'tab-dash': {
                        templateUrl: 'tab-dash.html',
                        controller: 'DashCtrl'
                    }
                }
            })
            .state('search', {
                url: '/search',
                templateUrl: 'search.html',
                controller: 'SearchCtrl'
            })
            .state('tab.cake-design', {
                url: '/design/:cakeId',
                //cache: false,
                views: {
                    'tab-design': {
                        templateUrl: 'design.html',
                        controller: 'DesignCtrl'
                    }
                }
            })
            .state('tab.cake-order', {
                cache: false,
                url: '/order/:orderId',
                views: {
                    'tab-order': {
                        templateUrl: 'order.html',
                        controller: 'OrderCtrl'
                    }
                }
            })
            .state('tab.cake-detail', {
                url: '/cake/:cakeId',
                views: {
                    'tab-detail': {
                        templateUrl: 'cake-detail.html',
                        controller: 'CakeDetailCtrl'
                    }
                }
            })
            .state('tab.cake-list', {
                //cache: false,
                url: '/cakeList/:condition',
                views: {
                     'tab-cakeList': {
                            templateUrl: 'cake-list.html',
                            controller: 'CakeListCtrl'
                    }
                }
            })
            .state('tab.tab-nearby', {
                url: '/nearby',
                views: {
                    'tab-nearby': {
                        templateUrl: 'tab-nearby.html',
                        controller: 'NearbyCtrl'
                    }
                }
            })

            .state('tab.myself', {
                url: '/myself',
                //cache: false,
                views: {
                    'tab-myself': {
                        templateUrl: 'tab-myself.html',
                        controller: 'MyselfCtrl'
                    }
                }
            })

            .state('tab.myOrder', {
                //cache: false,
                url: '/myOrder/:cat',
                views: {
                    'tab-myOrder': {
                        templateUrl: 'tab-myOrder.html',
                        controller: 'MyOrderCtrl'
                    }
                }
            })

            .state('tab.more', {
                url: '/more/:kind',
                views: {
                    'tab-more': {
                        templateUrl: 'tab-more.html',
                        controller: 'MoreCtrl'
                    }
                }
            })
        ;

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/tab/dash');

        //所有请求添加loading
        $httpProvider.interceptors.push(function($rootScope) {
            return {
                request: function(config) {
                    $rootScope.$broadcast('showLoading');
                    return config;
                },
                response: function(response) {
                    $rootScope.$broadcast('hideLoading');
                    return response;
                }
            };
        });

    }).run(function ($rootScope, webStorage,UserService,$ionicLoading,$timeout) {

        $rootScope.global = {};
        $rootScope.user = {};
        if (webStorage.isSupported ) {
            if(webStorage.has("global")){
                $rootScope.global = webStorage.get("global");
            }
            if(webStorage.has("user")){
                $rootScope.user = webStorage.get("user");
                UserService.existUser({id:$rootScope.user.id},function (flag, data){
                    if (!flag) {
                        $rootScope.user = {};
                        webStorage.remove("user");
                    }else{
                        if($rootScope.global.accessTokenTime < new Date().getTime()){
                            UserService.upDateAccesstoken($rootScope.user, function (flag, data) {
                                if (flag) {
                                    $rootScope.global.accessToken = data.id;
                                    $rootScope.global.accessTokenTime = new Date(new Date().getTime()+data.ttl*1000).getTime();
                                    $rootScope.user = data.user;
                                    $rootScope.user.password = $rootScope.user.password;
                                    if (webStorage.isSupported) {
                                        webStorage.remove("global");
                                        webStorage.add("global", $rootScope.global);
                                        webStorage.remove("user");
                                        webStorage.add("user", $rootScope.user);
                                    }
                                }
                            });
                        }
                    }
                });

            }
        }
        $rootScope.global.title = "那一刻创意数码蛋糕";
        $rootScope.global.baseUrl = "后台api接口地址";
        $rootScope.global.ossPicUploadUrl = "oss上传地址";
        $rootScope.global.ossPicDownloadUrl = "oss下载地址";
        $rootScope.global.mainUrl = "访问url";
        $rootScope.global.inWeixin = false;
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            $rootScope.global.inWeixin = true;
        }
        $rootScope.global.cityList = [
            //{
            //    content: "B",
            //    zm: true
            //},
            //{
            //    cityArea: [
            //        {
            //            content: "北京",
            //            area:[
            //
            //        ]}
            //    ],
            //    zm: false
            //},
            {
                content: "N",
                zm: true
            },
            {
                cityArea: [
                    {content: "南京",
                        area:[
                            "鼓楼区",
                            "玄武区",
                            "秦淮区",
                            "建邺区",
                            "白下区",
                            "下关区",
                            "浦口区",
                            "栖霞区",
                            "雨花台区",
                            "溧水县",
                            "高淳县"
                        ]}
                ],
                zm: false
            },
            {
                content: "W",
                zm: true
            },
            {
                cityArea: [
                    {
                        content: "武汉",
                        area:[
                            "江岸区",
                            "江汉区",
                            "硚口区",
                            "汉阳区",
                            "武昌区",
                            "青山区",
                            "洪山区",
                            "汉南区",
                            "蔡甸区",
                            "东西湖区",
                            "江夏区",
                            "新洲区",
                            "黄陂区"

                        ]}
                ],
                zm: false
            },
            {
                content: "S",
                zm: true
            },
            {
                cityArea: [
                    {content: "上海",
                        area:[
                        "浦东新区",
                        "徐汇",
                        "长宁",
                        "普陀",
                        "闸北",
                        "虹口",
                        "杨浦",
                        "黄浦",
                        "宝山",
                        "闵行",
                        "静安",
                        "卢湾",
                        "嘉定",
                        "金山",
                        "松江",
                        "青浦",
                        "南汇",
                        "奉贤",
                        "崇明"

                    ]},
                    {content: "苏州",
                        area:[
                            "吴中区",
                            "相城区",
                            "金阊区",
                            "平江区",
                            "沧浪区",
                            "虎丘区",
                            "常熟市",
                            "昆山市",
                            "张家港市",
                            "吴江市",
                            "太仓市",
                            "苏州工业园区"

                        ]}
                ],
                zm: false
            }
        ];
        $rootScope.loadFlag = false;
        $rootScope.loadCloseFlag = false;
        $rootScope.$on('showLoading', function() {
            if(!$rootScope.loadFlag) {
                $rootScope.loadFlag = true;
                $ionicLoading.show({template: "<img src='/img/loading.gif'/>"});
            }
            $timeout(function(){
                $rootScope.loadFlag = false;
            },500);
        });

        $rootScope.$on('hideLoading', function() {
            if(!$rootScope.loadCloseFlag) {
                $rootScope.loadCloseFlag = true;
                $ionicLoading.hide();
            }else{
                $timeout(function() {
                    $ionicLoading.hide();
                    $rootScope.loadCloseFlag = false;
                },1000);
            }
        });
    });
