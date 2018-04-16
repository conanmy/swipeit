import Sprite from '../base/sprite'

const screenWidth  = window.innerWidth
const screenHeight = window.innerHeight


/**
 * 游戏背景类
 * 提供update和render函数实现无限滚动的背景功能
 */
export default class BackGround {
  constructor(ctx) {

    this.render(ctx)

  }

  /**
   * 背景图重绘函数
   * 绘制两张图片，两张图片大小和屏幕一致
   * 第一张漏出高度为top部分，其余的隐藏在屏幕上面
   * 第二张补全除了top高度之外的部分，其余的隐藏在屏幕下面
   */
  render(ctx) {
    var holes = [[0, 0], [0, screenHeight], [screenWidth, 0], [screenWidth, screenHeight]];
    for (var i = 0; i < holes.length; i++) {
      ctx.beginPath();
      ctx.arc(holes[i][0], holes[i][1], 80, 0, 2 * Math.PI);
      ctx.fillStyle = '#008000';
      ctx.fill();
    }
  }
}
