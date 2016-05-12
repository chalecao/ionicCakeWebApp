angular.module('starter.services', [])

    .factory('PostListService', function (PostList, $rootScope) {
        return {
            postList: function (formData, callback) {
                formData.t = new Date().getTime();
                PostList.find(formData, function (res) {
                    callback(true, $.grep(res, function (n, i) {
                        return n.isShow == 1;//1表示活动图片状态为显示
                    }));
                }, function (err) {
                    callback(false, err);
                });
            },
            materialList: function (callback) {
                if ($rootScope.materialListCache) {
                    callback(true, $rootScope.materialListCache);
                } else {
                    PostList.find({"filter[where][isShow]": 2, "t": new Date().getTime()}, function (res) {
                        $rootScope.materialListCache = res;
                        callback(true, res);
                    }, function (err) {
                        callback(false, err);
                    });
                }
            }
        };


    })
    .factory('CategoryService', function (Category, $rootScope) {
        return {
            categoryList: function (parentId, callback) {
                Category.find({"t": new Date().getTime()}, function (res) {
                    $rootScope.categoryListCache = {
                        categoryList: res
                    };
                    if (parentId) {
                        callback(true, $.grep($rootScope.categoryListCache.categoryList, function (n, i) {
                            return n.parentId == parentId;
                        }));
                    } else {
                        callback(true, $rootScope.categoryListCache.categoryList);
                    }
                }, function (err) {
                    callback(false, err);
                });
            }
        };
    })
    .factory('DeliverAdressService', function (DeliverAddress, $rootScope) {
        return {
            addAddress: function (_data, callback) {
                _data.t = new Date().getTime();
                DeliverAddress.create(_data, function (res) {
                    callback(true, res);
                }, function (err) {
                    callback(false, err);
                });
            },
            listAddress: function (_data, callback) {
                _data.t = new Date().getTime();
                DeliverAddress.find(_data, function (res) {
                    callback(true, res);
                }, function (err) {
                    callback(false, err);
                });
            },
            delAddress: function (_data, callback) {
                _data.t = new Date().getTime();
                DeliverAddress.deleteById(_data, function (res) {
                    callback(true, res);
                }, function (err) {
                    callback(false, err);
                });
            }
        };
    })
    .factory('CashCouponService', function (CashCoupon, $rootScope) {
        return {
            addCashCoupon: function (_data, callback) {
                _data.t = new Date().getTime();
                CashCoupon.prototype$updateAttributes(_data, function (res) {
                    callback(true, res);
                }, function (err) {
                    callback(false, err);
                });
            },
            listCashCoupon: function (_data, callback) {
                _data.t = new Date().getTime();
                CashCoupon.find(_data, function (res) {
                    callback(true, res);
                }, function (err) {
                    callback(false, err);
                });
            },
            delCashCoupon: function (_data, callback) {
                _data.t = new Date().getTime();
                CashCoupon.deleteById(_data, function (res) {
                    callback(true, res);
                }, function (err) {
                    callback(false, err);
                });
            }
        };
    })
    .factory('OrderService', function (Order, $rootScope) {
        return {
            addOrder: function (_data, callback) {
                _data.t = new Date().getTime();
                Order.create(_data, function (res) {
                    callback(true, res);
                }, function (err) {
                    callback(false, err);
                });
            },
            listOrder: function (_data, callback) {
                _data.t = new Date().getTime();
                Order.find(_data, function (res) {

                    callback(true, $.grep(res, function (n, i) {
                        switch (n.orderStatus) {
                            case 0:
                                n.status = "未付款";
                                break;
                            case 1:
                                n.status = "已付款，待处理";
                                break;
                            case 2:
                                n.status = "制作完成，配送中";
                                break;
                            case 3:
                                n.status = "交易成功，待评论";
                                break;
                            case 4:
                                n.status = "交易成功，已评论";
                                break;
                            case 5:
                                n.status = "售后处理中";
                                break;
                            case 6:
                                n.status = "售后成功";
                                break;
                            case 7:
                                n.status = "售后成功，已评论";
                                break;
                        }
                        return true;
                    }));
                }, function (err) {
                    callback(false, err);
                });
            },
            getOrderById: function (_data, callback) {
                _data.t = new Date().getTime();
                Order.findById(_data, function (res) {
                    callback(true, res);
                }, function (err) {
                    callback(false, err);
                });
            },
            updateOrder: function (_data, callback) {
                _data.t = new Date().getTime();
                Order.prototype$updateAttributes(_data, function (res) {
                    callback(true, res);
                }, function (err) {
                    callback(false, err);
                });
            },
            getCharge: function (_data, callback) {
                _data.t = new Date().getTime();
                Order.getCharge(_data, function (res) {
                    callback(true, res);
                }, function (err) {
                    callback(false, err);
                });
            },
            oauth: function (_data, callback) {
                Order.oauth(_data, function (res) {
                    callback(true, res);
                }, function (err) {
                    callback(false, err);
                });
            },
            notifyResult: function (_data, callback) {
                Order.notifyResult(_data, function (res) {
                    callback(true, res);
                }, function (err) {
                    callback(false, err);
                });
            },
            getopenid: function (_data, callback) {
                Order.getopenid(_data, function (res) {
                    callback(true, res);
                }, function (err) {
                    callback(false, err);
                });
            }
        };
    })
    .factory("SMSService", function (Container) {
        return {
            sendCode: function (formData, callback) {
                Container.sendCode(formData, function (res) {
                    callback(true, res);
                }, function (err) {
                    callback(false, err);
                });
            },
            sendTips: function (formData, callback) {
                Container.sendTips(formData, function (res) {
                    callback(true, res);
                }, function (err) {
                    callback(false, err);
                });
            },
            sign: function (formData, callback) {
                Container.getSign(formData, function (res) {
                    callback(true, res);
                }, function (err) {
                    callback(false, err);
                });
            }

        };
    })
    .factory('UserService', function (PictUser) {
        return {
            login: function (formData, callback) {
                formData.password = hex_md5(formData.password);
                PictUser.login(formData, function (res) {
                    callback(true, res);
                }, function (err) {
                    callback(false, err);
                });
            },
            existUser: function (formData, callback) {
                PictUser.exists(formData, function (res) {
                    callback(true, res);
                }, function (err) {
                    callback(false, err);
                });
            },
            upsert: function (formData, callback) {
                if(formData.npw){
                    formData.npw = hex_md5(formData.npw);
                }
                PictUser.updatePW(formData, function (res) {
                    //webStorage.remove("userListCache");
                    callback(true, res);
                }, function (err) {
                    callback(false, err);
                });
            },
            snslogin: function (formData, callback) {
                PictUser.snsLogin(formData, function (res) {
                    callback(true, res);
                }, function (err) {
                    callback(false, err);
                });
            },
            updateAttributes: function (formData, callback) {
                PictUser.prototype$updateAttributes(formData, function (res) {
                    callback(true, res);
                }, function (err) {
                    callback(false, err);
                });
            },
            upDateAccesstoken: function (formData, callback) {
                PictUser.login(formData, function (res) {
                    callback(true, res);
                }, function (err) {
                    callback(false, err);
                });
            },
            logout: function (formData, callback) {
                PictUser.logout({}, function (res) {
                    callback(true, res);
                }, function (err) {
                    callback(false, err);
                });
            },
            count: function (formData, callback) {
                PictUser.count({}, function (res) {
                    callback(true, res);
                }, function (err) {
                    callback(false, err);
                });
            },
            shopper: function (formData, callback) {
                formData.t = new Date().getTime();
                PictUser.findShoppers(formData, function (res) {
                    callback(true, res);
                }, function (err) {
                    callback(false, err);
                });
            },
            userList: function (formData, callback) {
                formData.t = new Date().getTime();
                PictUser.find(formData, function (res) {
                    callback(true,res);
                }, function (err) {
                    callback(false, err);
                });
            },
            findUserById: function (formData, callback) {
                formData.t = new Date().getTime();
                PictUser.findOne(formData, function (res) {
                    callback(true, res);
                }, function (err) {
                    callback(false, err);
                });
            },
            register: function (formData, callback) {
                formData.password = hex_md5(formData.password);
                PictUser.create(formData, function (res) {
                    callback(true, res);
                }, function (err) {
                    callback(false, err);
                });
            }
        };
    })
    .factory('CakeService', function (Cake, $rootScope) {
        return {
            getCakeList: function (formData, callback) {
                formData.t = new Date().getTime();
                formData.online = 1;
                Cake.find(formData, function (res) {
                    callback(true, res);
                }, function (err) {
                    callback(false, err);
                });
            },
            getCakeById: function (formData, callback) {
                if ($rootScope.tempCake && $rootScope.tempCake.id == formData.id) {
                    callback(true, $rootScope.tempCake);
                } else {
                    formData.t = new Date().getTime();
                    Cake.findOne(formData, function (res) {
                        $rootScope.tempCake = res;
                        callback(true, res);
                    }, function (err) {
                        callback(false, err);
                    });
                }
            },
            updateCake: function (_data, callback) {
                _data.t = new Date().getTime();
                Cake.upsert(_data, function (res) {
                    callback(true, res);
                }, function (err) {
                    callback(false, err);
                });
            }
        };
    });
