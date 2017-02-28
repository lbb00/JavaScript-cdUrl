# cdURL 定位资源链接

闲着无聊写的，顺便巩固一下js的原型对象等知识。

## 入门

根据当前路径和相对\绝对路径来来生成资源的链接。

就如同命令行下使用cd命令到达资源目录一样，cdURL提供一个方法会返回一个最终路径。

base example：

```javascript
// 引入cdURL.js文件。

// 实例化一个cdURL对象，并传入初始资源地址。
test = new cdURL('https://example.com/about/abc/dd.html');

// 调用cdURL()的cd()方法来获取最终资源地址。该方法需传入绝对或相对地址，并将返回一个string类型的资源地址。
var mURL = test.cd('../../');

// 输出为：
// "https://example.com/about"
cosole.log(mURL);

```

当然现在也支持一些比较变态的写法：

```javascript
// 引入cdURL.js文件。

// 实例化一个cdURL对象，并传入初始资源地址。
test = new cdURL('https://example.com/about/abc/dd.html');

// 传入变态的相对定位地址
var mURL = test.cd('../...../../././bt');

// 输出为：
// "https://example.com/about/bt"
cosole.log(mURL);
```
