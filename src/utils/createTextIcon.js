/*
 * @Description: 创建文字图标
 * @Author: xxm
 * @Date: 2021-06-18 16:32:30
 */
import {Texture, SpriteMaterial, Sprite } from 'three'

// 获取字体长度
function getTextWidth(text, font) {
  // re-use canvas object for better performance
  var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'))
  var context = canvas.getContext('2d')
  context.font = font
  var metrics = context.measureText(text)
  return metrics.width
}
// canvas绘制标签的形状
CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
  if (w < 2 * r) r = w / 2
  if (h < 2 * r) r = h / 2
  this.beginPath()
  this.moveTo(x + r, y)
  this.arcTo(x + w, y, x + w, y + h, r)
  this.arcTo(x + w, y + h, x, y + h, r)
  this.arcTo(x, y + h, x, y, r)
  this.arcTo(x, y, x + w, y, r)
  this.stroke()
  this.fillStyle = 'rgba(0, 0, 0, 0.7)'
  this.fill()

  this.beginPath()
  this.moveTo(w / 2 - 20, h)
  this.lineTo(w / 2 + 20, h)
  this.lineTo(w / 2, 110)
  this.fillStyle = 'rgba(0, 0, 0, 0.7)'
  this.fill()
  this.closePath()
  return this
}
// 创建公司文字标签
export function createCompanyIcon(threePoit, text, name) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  // 形状边框
  ctx.lineWidth = 3
  ctx.strokeStyle = '#000'
  const fontLen = getTextWidth(text, 'bold 40px sans-serif')
  // 填充形状
  canvas.width = 660
  canvas.height = 310
  ctx.font = 'bold 40px sans-serif'
  ctx.roundRect(0, 0, fontLen + 40, 80, 30).stroke()
  ctx.fillStyle = '#fff'
  // 文字样式
  ctx.textAlign = 'center'
  ctx.fillText(text, (fontLen + 40) / 2, 52.5)

  // 纹理
  const canvasTexture = new Texture(canvas)
  canvasTexture.needsUpdate = true
  // 精灵图材质
  const canvasMaterial = new SpriteMaterial()
  canvasMaterial.map = canvasTexture
  // 设置精灵图属性
  const canvasSprite = new Sprite(canvasMaterial)
  canvasSprite.name = name
  canvasSprite.modeltype = name
  // canvasSprite.data = data
  // 注意：这里z和y坐标是反的
  canvasSprite.position.set(threePoit.x, threePoit.y, threePoit.z)
  canvasSprite.scale.set(1000, 500, 1000)
  canvasSprite.rotateY(Math.PI / 2)

  return canvasSprite
}