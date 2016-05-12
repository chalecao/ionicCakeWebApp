# ionic-na1ke
蛋糕项目中的网页app代码所有内容，具有很好的参考价值，既可以作为网页 app，也可以打包成android或者ios应用。
在线预览地址：http://m.pictcake.cn
设置了自动跳转的功能，电脑访问会跳转到官网页面。可以在官网页面中试用。
# 打包
本项目是作为web app的，用gulp做打包
```
//不混淆压缩
gulp
//混淆压缩
gulp build
```
输出后的内容放在dist目录，直接放到静态服务器即可。

# 关于上传
使用的是阿里云的oss 服务，canvas 转 toDataURL 转blob上传

# 关于支付
支持微信支付和支付宝支付，使用的ping++做的服务，但是其他的商家申请都是需要自己申请的

# 关于后台
后台使用loopback 提供的rest接口，参考另外一个项目