/*
 * @Description: 单击获取模型信息
 * @Author: xxm
 * @Date: 2021-07-01 14:26:05
 */

import { Raycaster, Vector2 } from "three"

// 单击, clickTimer阻止单击与双击时间冲突
let clickTimer = null
const raycaster = new Raycaster()
const mouse = new Vector2() // 鼠标二维

// 获取选择的物体
export const getSelectedObj = (x, y, scene, camera) => {
  // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
  mouse.x = (x / window.innerWidth) * 2 - 1
  mouse.y = -(y / window.innerHeight) * 2 + 1
  // console.log(mouse, 'mouse', camera, scene);
  // 通过摄像机和鼠标位置更新射线
  raycaster.setFromCamera(mouse, camera)
  // 与射线相交的物体按距离由近到远排序
  const intersectObjects = raycaster.intersectObjects(scene.children, true)
  console.log(intersectObjects, 'intersectObjects');
  // 距离最近的物体
  return intersectObjects[0]
}

export const getModel = (event, scene, camera) => {
  let clickValue
  if (clickTimer) {
    window.clearTimeout(clickTimer)
    clickTimer = null
  }
  clickTimer = setTimeout(() => {
    const clientX = event.clientX
    const clientY = event.clientY
    clickValue = getSelectedObj(clientX, clientY, scene, camera)
    console.log(clickValue);
    return clickValue || false
  }, 300)
 
}