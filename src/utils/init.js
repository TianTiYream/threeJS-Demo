/*
 * @Description: 初始化
 * @Author: xxm
 * @Date: 2021-06-18 16:41:15
 */
import {
  DirectionalLight, AmbientLight, PerspectiveCamera, WebGLRenderer, PCFSoftShadowMap, AxesHelper, CameraHelper,
  BoxGeometry, MeshLambertMaterial, Mesh, TextureLoader, MeshBasicMaterial, BackSide, Scene
} from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * @description: 初始化场景
 * @param {*}
 * @return {*}
 */
export const initScene = () => {
  return new Scene()
}

/**
 * @description: 适应屏幕大小
 * @param {WebGLRenderer} renderer
 * @param {PerspectiveCamera} camera
 * @return {*}
 */
export const resizeScreen = (renderer, camera, size={}) => ()=> {
  let width = window.innerWidth
  let height = window.innerHeight
  if (size.width) { width = size.width}
  if (size.height) { height = size.height}
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}


/**
 * @description: 初始化平行光
 * @param {String|0xNumber} color
 * @param {Object} position: {x: float, y: float, z: float}
 * @param {Boolean} openShadow
 * @param {Object} shadowConfig: {mapSize: {width: number, height: number},  camera: {near: float, far: float, left： float, right: float, top: float, bottom: float}}
 * @return {DirectionalLight}
 */
const shadowConfigDefault = {
  mapSize: {width: 512, height: 512}, 
  camera: {near: 0.5, far: 500, left: -200, right: 200, top: 200, bottom: -200}
}
export const initDirectionalLight = ({color='#ffffff', position={x: 300, y: 400, z: 500}, openShadow=false, shadowConfig=shadowConfigDefault} = {}) => {
  // 平行光
  const directionalLight = new DirectionalLight(color)
  directionalLight.position.set(position.x, position.y, position.z)
  // 阴影设置
  if (openShadow) {
    directionalLight.castShadow = true
    // 这两个值决定使用多少像素生成阴影 默认512
    directionalLight.shadow.mapSize.height = shadowConfig.mapSize.height
    directionalLight.shadow.mapSize.width = shadowConfig.mapSize.width
    // 阴影范围
    const {near, far, left, right, top, bottom} = shadowConfig.camera
    directionalLight.shadow.camera.near = near // 产生阴影的最近距离
    directionalLight.shadow.camera.far = far // 产生阴影的最远距离
    directionalLight.shadow.camera.left = left// 产生阴影距离位置的最左边位置
    directionalLight.shadow.camera.right = right // 最右边
    directionalLight.shadow.camera.top = top // 最上边
    directionalLight.shadow.camera.bottom = bottom // 最下面
  }
  return directionalLight
}


/**
 * @description: 初始化环境光 
 * @param {String} color
 * @return {AmbientLight}
 */
export const initAmbientLight = (color='#FFFFF0') => {
  const ambient = new AmbientLight(color)
  return ambient
}


/**
 * @description: 初始化相机
 * @param {Number} fov
 * @param {Number} far
 * @param {Object} position
 * @param {Array} up
 * @return {PerspectiveCamera}
 */
export const initCamera = ({fov=30, far=1000000, position={x: 0, y: 0, z: 200}, up=[0, 1, 0]} = {}) => {
  const camera = new PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 1, far)
  camera.position.set(position.x, position.y, position.z)
  camera.up.set(...up)
  return camera
}


/**
 * @description: 初始化渲染器
 * @param {Boolean} openShadow
 * @param {String|Number(16)} clearColor
 * @return {WebGLRenderer}
 */
export const initRenderer = ({openShadow=false, clearColor=0xeeeeee, width=window.innerWidth, height=window.innerHeight} = {}) => {
  const renderer = new WebGLRenderer({ antialias: true })
  renderer.setClearColor(clearColor)
  if (openShadow) {
    renderer.shadowMap.enabled = true // 开启阴影
    renderer.shadowMap.type = PCFSoftShadowMap // 柔化阴影
  }
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height)
  return renderer
}


/**
 * @description: 初始化辅助
 * @param {String} type
 * @param {any} option
 * @return {Object}
 */
export const initHelp = ({type='axes', option=200} = {}) => {
  if (type === 'axes') {
    const axesHelp = new AxesHelper(option)
    return axesHelp
  } else if (type === 'camera') {
    const helper = new CameraHelper(option)
    return helper
  }
  return '没有该辅助类型'
}


/**
 * @description: 初始化一个盒子，可以用于测试
 * @param {Object} position
 * @return {Mesh}
 */
export const initTestBox = (position) => {
  const boxGeometry = new BoxGeometry(30, 30, 30)
  const boxMaterial = new MeshLambertMaterial({color: 0xff00ff})
  const boxMesh = new Mesh(boxGeometry, boxMaterial)
  boxMesh.position.set(position.x, position.y, position.z)
  return boxMesh
}


/**
 * @description: 初始化控制器
 * @param {PerspectiveCamera} camera
 * @param {WebGLRenderer} renderer
 * @return {OrbitControls}
 */
export const initControls = (camera, renderer) => {
  const controls = new OrbitControls(camera, renderer.domElement)
  return controls
}


/**
 * @description: 动画
 * @param {WebGLRenderer} renderer
 * @param {Scene} scene
 * @param {PerspectiveCamera} camera
 * @param {OrbitControls} controls
 * @param {Function} fn
 * @return {*}
 */
export const animate = (renderer, scene, camera, controls, fn) => {
  requestAnimationFrame(() => animate(renderer, scene, camera, controls, fn))
  if (controls) {
    controls.update()
  }
  if (fn) {fn()}
  renderer.render(scene, camera)
}


/**
 * @description: 加载纹理贴图
 * @param {String} url
 * @return {MeshBasicMaterial}
 */
export const loadTexture = (url) => {
  const texture = new TextureLoader().load(url)
  const material = new MeshBasicMaterial({ map: texture, side: BackSide })
  return material
}


/**
 * @description: 初始化three
 * @param {*}
 * @return {*}
 */
export const initThree = ({scene=new Scene(), domId, animateFn}={}) => {
  // 光线、照相机、辅助坐标系
  // const scene = initScene()
  const light = initDirectionalLight()
  const camera = initCamera({position: {x: 100, y: 50, z: 1200}})
  const help = initHelp()

  scene.add(camera, help, light)

  // 测试盒子
  // const box = initTestBox({x: 0, y: 10, z: 0})
  // scene.add(box)

  // 渲染器
  const renderer = initRenderer()

  const ele = document.getElementById(domId)
  ele.appendChild(renderer.domElement)

  window.addEventListener('resize', resizeScreen(renderer, camera))

  // 控制器
  const controls = initControls(camera, renderer)

  // 动画
  animate(renderer, scene, camera, controls, animateFn)
  return {camera, renderer, controls, light}
}