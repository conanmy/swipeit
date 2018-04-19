import { getRandNum } from './libs/utils';
var FRICTION_VELOCITY = 0.01;

function checkHittingHole(ball, canvasRect) {
  return (ball.x <= 0 && (canvasRect.height - ball.y < 80  || ball.y < 80))
    || (ball.y <= 0 && (canvasRect.width - ball.x < 80  || ball.x < 80));
}

var Ball = function(white) {
  this.x = getRandNum(0, canvas.width);
  this.y = getRandNum(0, canvas.height);
  this.vx = 0;
  this.vy = 0;
  this.radius = 40;
  this.stopped = false;
  this.white = white;
  this.grow = true;
  this.color = white ? '#000000' : 'rgba(' + getRandNum(0, 10) + ',' + getRandNum(0, 250) + ',' + getRandNum(100, 255) + ',' + 0.6 + ')';
};

Ball.prototype = {
  render: function(ctx, id) {
    if (this.dropped) {
      return;
    }
    drawOnCanvas(this, ctx, id, false);

    function drawOnCanvas(_this, context, id) {
      id = id + "";
      var arr = id.split('');
      while (arr.length < 3) {
        arr.unshift("0");
      }
      var color = arr.join(',');
      context.beginPath();
      context.arc(_this.x, _this.y, _this.radius, 0, 2 * Math.PI);
      context.fillStyle = _this.color;
      context.strokeStyle = (_this.stopped) ? 'rgba(0,0,0,0.5)' : _this.color;

      context.fill();
      context.stroke();
    }

  },
  update: function() {
    //UPDATABLE
    if (this.stopped || this.dropped) {
      return;
    }

    //MOVEMENT
    var canvasRect = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    if (Math.abs(this.vx) < FRICTION_VELOCITY) {
      this.vx == 0;
    } else {
      this.vx = this.vx > 0 ? Math.abs(this.vx) - FRICTION_VELOCITY : 0 - (Math.abs(this.vx) - FRICTION_VELOCITY);
    }
    if (Math.abs(this.vy) < FRICTION_VELOCITY) {
      this.vy == 0;
    } else {
      this.vy = this.vy > 0 ? Math.abs(this.vy) - FRICTION_VELOCITY : 0 - (Math.abs(this.vy) - FRICTION_VELOCITY);
    }
    this.x = this.x + (this.vx * 1);
    this.y = this.y + (this.vy * 1);

    //Change direction / hit a boundary
    if (this.x > canvasRect.width || this.x < 0) {
      if (this.x < 0) {
        this.x = 0;
      } else {
        this.x = canvasRect.width;
      }

      //Reduce velocity
      var currentDirectionX = (this.vx > 0) ? 1 : -1;
      this.vx = Math.abs(this.vx) * 0.60; //Reduce velocity
      this.vx = (this.vx < 1) ? 1 : this.vx;
      this.vx = (currentDirectionX * -1) * this.vx;
    }

    if (checkHittingHole(this, canvasRect)) {
      this.dropped = true;
      return;
    }

    if (this.y > canvasRect.height || this.y < 0) {
      if (this.y < 0) {
        this.y = 0;
      } else {
        this.y = canvasRect.height;
      }

      var currentDirectionY = (this.vy > 0) ? 1 : -1;
      this.vy = Math.abs(this.vy) * 0.60; //Reduce velocity
      this.vy = (this.vy < 1) ? 1 : this.vy;
      this.vy = (currentDirectionY * -1) * this.vy;
    }
  }
}

export default Ball;