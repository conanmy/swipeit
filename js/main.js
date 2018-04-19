import Ball from './ball'
import BackGround from './runtime/background'
import GameInfo from './runtime/gameinfo'
import Music from './runtime/music'
import DataBus from './databus'
import ZingTouch from './libs/zingtouch';

let ctx = canvas.getContext('2d')
let databus = new DataBus()

var BALL_NUM = 3;

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    // 维护当前requestAnimationFrame的id
    this.aniId = 0

    this.restart()
  }

  restart() {
    databus.reset()

    canvas.removeEventListener(
      'touchstart',
      this.touchHandler
    )

    this.bg = new BackGround(ctx)
    this.gameinfo = new GameInfo()
    this.music = new Music()
    for (var i = 0; i < BALL_NUM; i++) {
      var ball = new Ball((i == BALL_NUM - 1) ? true : false);
      databus.balls.push(ball);
    }

    this.bindLoop = this.loop.bind(this)
    this.hasEventBind = false

    // 清除上一局的动画
    window.cancelAnimationFrame(this.aniId);

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }

  // 全局碰撞检测
  collisionDetection() {
    let that = this

    let balls = databus.balls;

    for (var i = 0; i < balls.length; i++) {
      for (var j = i + 1; j < balls.length; j++) {
        if (balls[i].vx > 0 || balls[i].vy > 0 || balls[j].vx > 0 || balls[j].vy > 0) {
          if (Math.pow(balls[i].x - balls[j].x, 2) + Math.pow(balls[i].y - balls[j].y, 2) <= Math.pow(balls[i].radius + balls[j].radius, 2)) {
            var ix = balls[i].x, iy = balls[i].y, jx = balls[j].x, jy = balls[j].y;
            var ivx = balls[i].vx, ivy = balls[i].vy, jvx = balls[j].vx, jvy = balls[j].vy;
            var d = Math.sqrt(Math.pow(ix - jx, 2) + Math.pow(iy - jy, 2));
            var nx = (jx - ix) / d;
            var ny = (jy - iy) / d;
            var p = ivx * nx + ivy * ny - jvx * nx - jvy * ny;
            balls[i].vx = ivx - p * nx;
            balls[i].vy = ivy - p * ny;
            balls[j].vx = jvx + p * nx;
            balls[j].vy = jvy + p * ny;
          }
        }
      }
    }

  }

  // 游戏结束后的触摸事件处理逻辑
  touchEventHandler(e) {
    e.preventDefault()

    let x = e.touches[0].clientX
    let y = e.touches[0].clientY

    let area = this.gameinfo.btnArea

    if (x >= area.startX
      && x <= area.endX
      && y >= area.startY
      && y <= area.endY)
      this.restart()
  }

  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    this.bg.render(ctx)
    
    databus.balls
      .forEach((item, key) => {
        item.render(ctx, key)
      })

    // databus.animations.forEach((ani) => {
    //   if (ani.isPlaying) {
    //     ani.aniRender(ctx)
    //   }
    // })

    this.gameinfo.renderGameScore(ctx, databus.score)

    // 游戏结束停止帧循环
    if (databus.gameOver) {
      this.gameinfo.renderGameOver(ctx, databus.score)

      if (!this.hasEventBind) {
        this.hasEventBind = true
        this.touchHandler = this.touchEventHandler.bind(this)
        canvas.addEventListener('touchstart', this.touchHandler)
      }
    }
  }

  // 游戏逻辑更新主函数
  update() {
    if (databus.gameOver)
      return;

    databus.balls
      .forEach((item) => {
        item.update()
      })

    this.collisionDetection()
  }

  // 实现游戏帧循环
  loop() {
    databus.frame++

    this.update()
    this.render()

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }
}
