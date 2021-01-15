export class Ball {
  constructor (radius, speed) {
    this.radius = radius
    this.vx = speed
    this.vy = speed
    this.x = 0
    this.y = 0
  }

  draw (ctx, stageWidth, stageHeight) {
    this.x += this.vx
    this.y += this.vy

    ctx.fillStyle = '#fdd700'
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
    ctx.fill()
  }
}
