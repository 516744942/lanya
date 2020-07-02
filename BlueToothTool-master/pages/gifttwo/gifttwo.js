Page({

  /**
  * 页面的初始数据
  */
  data: {
    awardsConfig: {},
    restaraunts: [], //大转盘奖品信息
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    var self = this;
    wx.getSystemInfo({
      //获取系统信息成功，将系统窗口的宽高赋给页面的宽高
      success: function (res) {
        self.width = res.windowWidth
        self.height = res.windowHeight
      }
    })
    self.data.awardsConfig = {
      chance: true,
      awards: self.data.restaraunts//存放奖项信息
    }
    self.tab();
  },
tab: function() {
  var self = this;

  // 绘制转盘
  var awardsConfig = self.data.awardsConfig.awards,
    len = awardsConfig.length,
    rotateDeg = 360 / len / 2 + 90,
    html = [],
    turnNum = 1 / len // 文字旋转 turn 值
  self.setData({
    btnDisabled: self.data.awardsConfig.chance ? '' : 'disabled'
  })
  var ctx = wx.createContext();
  for (var i = 0; i < len; i++) {
    var w = self.width; //页面宽
    var r = w * 0.38; //圆半径 0.35w
    // 保存当前状态
    ctx.save();
    // 开始一条新路径
    ctx.beginPath();
    // 位移到圆心，下面需要围绕圆心旋转
    // ctx.translate(150, 150);
    ctx.translate(w / 2 - 14, w / 2 - 18);
    // 从(0, 0)坐标开始定义一条新的子路径
    ctx.moveTo(0, 0);
    // 旋转弧度,需将角度转换为弧度,使用 degrees * Math.PI/180 公式进行计算。
    ctx.rotate((360 / len * i - rotateDeg) * Math.PI / 180);
    // 绘制圆弧
    ctx.arc(0, 0, r, 0, 2 * Math.PI / len, false);

    // 颜色间隔
    if (i % 2 == 0) {
      ctx.setFillStyle('#ffffff');
    } else {
      ctx.setFillStyle('#ffeab0');
    }

    // 填充扇形
    ctx.fill();
    // 绘制边框
    ctx.setLineWidth(0.5);
    ctx.setStrokeStyle('#e4370e');
    ctx.stroke();

    // 恢复前一个状态
    ctx.restore();

    // 奖项列表
    html.push({
      turn: (i + 1) * turnNum + 'turn',
      award: awardsConfig[i]
    });
  }
  self.setData({
    awardsList: html
  });

  wx.drawCanvas({
    canvasId: 'canvas',
    actions: ctx.getActions()
  })
},
inner: function(e) {
  const self = this;
  if (self.data.awardsConfig.chance) {

    self.data.awardsConfig.chance = false;//转动时禁止再次触发点击事件
    var json = res.data;//后端自动分配奖项，并传给前端奖项信息
    var item = parseInt(json.grade); //获取从1到奖品数量之间的随机数

    self.getLottery(item + 1, self.data.restaraunts[item]); //奖项位置 （+1 是为了转动的时候计算角度），对应奖项

  }

},
getLottery: function(item, txt) {
  var self = this
  var awardsConfig = self.data.awardsConfig.awards,
    len = awardsConfig.length;
  var awardIndex = item;
  // 获取奖品配置
  var awardsConfig = self.data.awardsConfig
  if (awardIndex < 2) awardsConfig.chance = false

  // 初始化 rotate
  var animationInit = wx.createAnimation({
    duration: 1
  })
  this.animationInit = animationInit;
  animationInit.rotate(0).step()
  this.setData({
    animationData: animationInit.export(),
    btnDisabled: 'disabled'
  })
  // 旋转抽奖 执行动画效果
  setTimeout(function () {
    var animationRun = wx.createAnimation({
      duration: 4000,
      timingFunction: 'ease'
    })
    self.animationRun = animationRun
    animationRun.rotate(0 - (360 * 8 - awardIndex * (360 / len))).step()
    self.setData({
      animationData: animationRun.export()
    })
  }, 100)
  // 记录奖品
  var winAwards = wx.getStorageSync('winAwards') || {
    data: []
  }
  var textInfo = txt === "谢谢参与" ? txt : txt + '1个';
  winAwards.data.push(textInfo)
  wx.setStorageSync('winAwards', winAwards)
  var jh = parseInt(self.data.jh) - 1;
  // 中奖提示
  setTimeout(function () {
    if (txt === "谢谢参与") {
      wx.showModal({
        title: '很遗憾',
        content: '祝您好运',
        showCancel: false
      })
    } else {
      wx.showModal({
        title: '恭喜',
        content: '获得' + txt,
        showCancel: false
      })
    }

    self.data.awardsConfig.chance = true;
    if (awardsConfig.chance) {
      self.setData({
        btnDisabled: ''
      })
    }
  }, 4100);
},

function(err) {
  console.log(err)
  console.log("err")
  //error
},
/**
* 生命周期函数--监听页面初次渲染完成
*/
onReady: function() {
  // this.drawTurntable(this, new Date());
},

/**
* 生命周期函数--监听页面显示
*/
onShow: function() {

},

/**
* 生命周期函数--监听页面隐藏
*/
onHide: function() {

},

/**
* 生命周期函数--监听页面卸载
*/
onUnload: function() {

},

/**
* 页面相关事件处理函数--监听用户下拉动作
*/
onPullDownRefresh: function() {

},

/**
* 页面上拉触底事件的处理函数
*/
onReachBottom: function() {

},

/**
* 用户点击右上角分享
*/
onShareAppMessage: function() {

}
})
