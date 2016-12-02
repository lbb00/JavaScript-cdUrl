/**
 * @author onelong love@onelong.org
 * @version 0.0.1
 * @github github.com/loveonelong/cdurl
 * @license MIT
 */

/**
 * 封装的cdURL类
 * 
 * @param {string} path - 当前路径的url字符串
 * 
 * @property {string} path - public 原始路径
 * @property {int} rootPathStartPosition - public 路径起始位置
 * @property {string} clearPath - public 路径纯目录
 * @property {string} initSteps - public 新路径层级
 * @property {string} dirName - public 相对、绝对路径
 * @property {string} _endURL - private 临时保存生成的路径 ！importent 不能调用
 * 
 * @property {function} cd(dirname) - 返回最后生成的路径 ！importent 可调用
 * @property {function} _rootPathStartPosition() - 
 * @property {function} _cleanPath() - 
 * @property {function} _initSteps() - 
 * @property {function} _allPoint() -  
 * 
 */
cdURL = function (path) {
    this.path = path;
    this.rootPathStartPosition = this._rootPathStartPosition();
    this.clearPath = this._cleanPath();
    this.initSteps = this._initSteps();
    this.dirName = '';
    this._endURL = this.clearPath;
}

cdURL.prototype.cd = function (dirName) {
    // 
    this.dirName = dirName;

    // 初始化起始位置为-1
    var firstPosition = -1;

    // 寻找第一个'/'
    var secondPosition = dirName.indexOf('/');

    // 循环寻找'/xxx/'区间
    // 找不到则退出循环
    while (secondPosition >= 0) {

        // 根据区间判断并改变endurl
        this._changeSteps(this._allPoint(firstPosition, secondPosition), firstPosition, secondPosition);

        // 区间起始位置后移
        firstPosition = secondPosition;

        // 寻找下一个区间结束位置
        secondPosition = dirName.substring(firstPosition + 1).indexOf('/');

        // 如果找到了下一个区间，且并非第一次找到
        if (secondPosition > 0 && firstPosition !== -1) {

            // 这里是因为，每次寻找下一个区间的时候，都对区间惊醒了切割
            // 代码如下
            // firstPosition = secondPosition;
            // secondPosition = dirName.substring(firstPosition + 1).indexOf('/');
            // 所以应当加上被切割掉的长度
            secondPosition += firstPosition + 1;
        }
        //console.log('dir---'+dirName.substring(firstPosition+1))

    }

    // 将dirName最后的/xxx加上。
    this._endURL += dirName.substring(firstPosition);

    // 返回最终的url
    return this._endURL;
}

/**
 * 寻找根路径开始的位置
 * 
 * @returns {int} position -根路径开始的位置
 */
cdURL.prototype._rootPathStartPosition = function () {
    var path = this.path;

    // 匹配最后一次出现 ':/' 的位置
    var firstPosition = path.lastIndexOf(':/');

    var position;


    if (firstPosition !== -1) {

        // 查找紧靠最后一次出现':/'钟':'位置以后，最后一次连续出现 '/' 的位置
        for (var i = firstPosition + 1; i < path.length; i++) {

            if (path[i] !== '/') { // 匹配到不连续了

                // 该位置为根路径开始位置
                position = i;

                // 跳出循环
                break;
            }
        }
    }

    return position;
}


/**
 * 获取清理后的当前路径，去除当前路径的参数、文件，仅保留目录信息
 * 
 * @returns
 */
cdURL.prototype._cleanPath = function () {

    var path = this.path;
    var rootPathStartPosition = this.rootPathStartPosition;

    // 匹配最后一次出现 '/' 的位置,为当前路径的根
    var endPosition = path.lastIndexOf('/');

    if (endPosition < rootPathStartPosition) {
        // 如果匹配到最后一次出现'/'的位置在根路径开始之前，则path为rootPaht

        return path;
    } else {
        // 截取rooPath
        return path.substring(0, path.lastIndexOf('/'));
    }
}

cdURL.prototype._initSteps = function () {

    var clearPath = this.clearPath;
    var rootPathStartPosition = this.rootPathStartPosition;

    // 初始化path层级
    var steps = 0;

    for (var i = rootPathStartPosition + 1; i < clearPath.length; i++) {
        if (clearPath[i] === '/') {
            steps++;
        }
    }
    return steps + 1;
}

/**
 * 根据寻找到两个区间内'.'的个数确定如何改变路径
 * 
 * @param {int} cdSteps - 寻找到的'.'个数
 * @param {int} firstPosition - 区间的开始'/'的位置
 * @param {int} secondPosition - 区间的结束'/'的位置
 * 
 * @returns {string} endURL - 改变后的路径
 */
cdURL.prototype._changeSteps = function (cdSteps, firstPosition, secondPosition) {

    if (cdSteps > this.initSteps) {
        // 如果后退一级大于了当前最大可后退级，则无操作
        this._endURL += '';
    } else if (cdSteps === 2) {
        // 如果可以后退，且有两个'.'，则后退一级

        // 可后退级减一
        this.initSteps--;
        // 切割endurl
        this._endURL = this._endURL.substring(0, this._endURL.lastIndexOf('/'));
    } else if (cdSteps === 0) {
        // 如果没有点，这里可能为空，或者是一个dir

        if (secondPosition - firstPosition !== 1) {
            // 如果该区间不为空

            // 可后退级加1
            this.initSteps++;
            // 加长endurl
            this._endURL += this.dirName.substring(firstPosition, secondPosition);
        }

    }
}


/**
 * 寻找dirName两个'/'之间的'.'有几个。
 * 
 * @param {int} start - 开始位置，区间第一个'/'所在dirName位置
 * @param {int} end - 结束位置，区间第二个'/'所在dirName位置
 * 
 * @returns {int} count 如果返回为0则代表没有，或区间里是个目录，如果返回数字，则代表仅存在'.'符号，返回值代表'.'的数量。
 */
cdURL.prototype._allPoint = function (start, end) {
    var dirName = this.dirName;

    // '.'计数器
    var count = 0;

    // 循环判断是否全是'.',并计数
    for (var i = start + 1; i < end; i++) {
        if (dirName[i] === '.') {
            count++;
        } else {
            count = 0;
            break;
        }
    }
    return count;
}

/*************test */

// var t = new cdURL('https://onelong.org/cc/ddd/ff/b.js');
// console.log(t.clearPath);
// console.log(t.cd('../../../../a/.b./../../../../../../../../b/c/d.js'));