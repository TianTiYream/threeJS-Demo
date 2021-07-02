<template>
  <div id="sky"></div>
</template>

<script>
import * as THREE from 'three'
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Sky } from './Sky.js';
import { PerspectiveCamera, Scene, WebGLRenderer, Vector3 } from 'three';

export default {
  name: 'Sky',
  data() {
    return {
      camera: '',
      scene: '',
      renderer: '',
      sky: '',
      sun: ''
    }
  },
  mounted() {
    this.init()

    this.render()
  },
  methods: {
    initSky() {
      this.sky = new Sky()
      this.sky.scale.setScalar(450000)
      this.scene.add(this.sky)

      this.sun = new Vector3()

      // GUI
      const effectController = {
        turbidity: 10,
        rayleigh: 3,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.7,
        elevation: 2,
        azimuth: 180,
        exposure: this.renderer.toneMappingExposure
      }

      const guiChanged = () => {

        const uniforms = this.sky.material.uniforms
        uniforms[ 'turbidity' ].value = effectController.turbidity;
        uniforms[ 'rayleigh' ].value = effectController.rayleigh;
        uniforms[ 'mieCoefficient' ].value = effectController.mieCoefficient;
        uniforms[ 'mieDirectionalG' ].value = effectController.mieDirectionalG;

        const phi = THREE.MathUtils.degToRad( 90 - effectController.elevation );
				const theta = THREE.MathUtils.degToRad( effectController.azimuth );
        // setFromSphericalCoords 从球坐标中的radius、phi和theta设置该向量。
        // phi - polar angle from the y (up) axis. Default is 0.
        // theta - equator angle around the y (up) axis. Default is 0.
        this.sun.setFromSphericalCoords( 1, phi, theta );

        uniforms[ 'sunPosition' ].value.copy( this.sun );

        this.renderer.toneMappingExposure = effectController.exposure;
        this.renderer.render( this.scene, this.camera );
      }
      const gui = new GUI();
      gui.add(effectController, 'turbidity', 0.0, 20.0, 0.1).onChange(guiChanged) // 光线浑浊度
      gui.add(effectController, 'rayleigh', 0.0, 4, 0.001).onChange(guiChanged) // 散射强度
      gui.add(effectController, 'mieCoefficient', 0.0, 0.1, 0.001).onChange(guiChanged) // 水平光圈大小强度
      gui.add(effectController, 'mieDirectionalG', 0.0, 1, 0.001).onChange(guiChanged) // 水平光圈范围
      gui.add(effectController, 'elevation', 0, 90, 0.1).onChange(guiChanged) // 高度，海拔
      gui.add(effectController, 'azimuth',  - 180, 180, 0.1).onChange(guiChanged) // 太阳水平位置改变，-180deg ~ 180deg
      gui.add(effectController, 'exposure', 0, 1, 0.0001).onChange(guiChanged) // 太阳光曝光强度
      
      guiChanged()
    },

    init() {
      this.camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 100, 2000000)
      this.camera.position.set(0, 100, 2000)

      this.scene = new Scene()

      // const helper = new GridHelper(10000, 2, 0xffffff, 0xffffff)
      // this.scene.add(helper)

      this.renderer = new WebGLRenderer()
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(window.innerWidth, window.innerHeight)

			this.renderer.outputEncoding = THREE.sRGBEncoding;
      console.log(this.renderer, 'render');

      // 色调映射-对比度
      // export const NoToneMapping = 0;
      // export const LinearToneMapping = 1;
      // export const ReinhardToneMapping = 2;
      // export const CineonToneMapping = 3;
      // export const ACESFilmicToneMapping = 4;
      // export const CustomToneMapping = 5;
      // this.renderer.toneMapping = ACESFilmicToneMapping
      this.renderer.toneMapping = 4
      // 映射强度
      this.renderer.toneMappingExposure = 0.5

      const ele = document.getElementById('sky')
      ele.appendChild(this.renderer.domElement)

      const controls = new OrbitControls(this.camera, this.renderer.domElement)
      controls.addEventListener('change', this.render)
      // 禁止缩放
      controls.enableZoom = false
      // 禁止平移
      controls.enablePan = false

      this.initSky()

      console.log(this.scene, 'scene');

      window.addEventListener('resize', this.onWindowResize)
    },

    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()

      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.render()
    },

    render() {
      this.renderer.render(this.scene, this.camera)
    }
  }
}
</script>

<style>

</style>