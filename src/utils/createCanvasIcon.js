/*
 * @Description: 创建图标
 * @Author: xxm
 * @Date: 2021-06-18 16:36:15
 */
import {SpriteMaterial, TextureLoader, RepeatWrapping, Sprite} from 'three'

/**
 * 添加设备模块
 */
// 创建图标
let sprite = null // 精灵图
const spriteMaterial = new SpriteMaterial() // 精灵图材质
const loader = new TextureLoader() // 加载材质
let groundTexture = null
export function createCarpetOne(threePoit, data, name) {
  var material = spriteMaterial.clone()
  groundTexture = loader.load(threePoit.src)
  groundTexture.wrapS = groundTexture.wrapT = RepeatWrapping
  groundTexture.repeat.set(1, 1)
  groundTexture.anisotropy = 16
  material.map = groundTexture // 设置材质
  const a = 8
  const b = (a / 54) * 76
  sprite = new Sprite(material)
  sprite.scale.set(a, b, 10)
  sprite.position.set(threePoit.x, threePoit.y + 5, threePoit.z)
  sprite.name = name
  sprite.renderOrder = 10
  sprite.modeltype = name
  sprite.data = data
  return sprite
}