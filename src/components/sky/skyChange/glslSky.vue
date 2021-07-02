<!--
 * @Description: 纯代码GLSL天空盒
 * @Author: xxm
 * @Date: 2021-06-22 15:10:27
-->
<template>
  <div>
    <light-change @changeSky='changeSky'></light-change>
    <div id="canvasSky"></div>
  </div>
</template>

<script>
import * as INIT from '@/utils/init.js'
import { Sky } from '@/components/sky/skyChange/glslSky.js'
import LightChange from '@/components/sky/skyChange/light-change.vue'
// import { Sky } from './Sky'
import { Scene, PerspectiveCamera, sRGBEncoding, Vector2 } from 'three'

export default {
  data() {
    return {
      scene: new Scene(),
      sky: '',
      camera: '',
      renderer: '',
      controls: ''
    }
  },
  components: {
    LightChange
  },
  mounted() {
    this.init()
  },
  methods: {
    // 初始化天空
    initSky() {
      this.sky = new Sky()
      this.sky.scale.setScalar(4000)
      console.log(this.sky, 'sky');
      this.sky.startTime = Date.now()
      this.scene.add(this.sky)
    },
    // 初始化场景
    init() {
      this.camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 100, 2000000)
      this.camera.position.set(0, 100, 2000)

      this.renderer = INIT.initRenderer()
      this.renderer.outputEncoding = sRGBEncoding;

      // 色调映射-对比度
      // export const NoToneMapping = 0;
      // export const LinearToneMapping = 1;
      // export const ReinhardToneMapping = 2;
      // export const CineonToneMapping = 3;
      // export const ACESFilmicToneMapping = 4;
      // export const CustomToneMapping = 5;
      // this.renderer.toneMapping = ACESFilmicToneMapping
      // this.renderer.toneMapping = 4
      // 映射强度
      // this.renderer.toneMappingExposure = 0.5

      const ele = document.getElementById('canvasSky')
      ele.appendChild(this.renderer.domElement)

      this.controls = INIT.initControls(this.camera, this.renderer)

      this.animate()
      
      this.initSky()

      window.addEventListener('resize', INIT.resizeScreen(this.renderer, this.camera))
    },
    animate() {
      requestAnimationFrame(this.animate)
      this.controls.update()
      this.updateTime()
      this.renderer.render(this.scene, this.camera)
    },
    changeSky(val) {
      let clientX = window.innerWidth - (window.innerWidth / 100) * val * 1.2;
      let height;
      if (val >= 12.5 && val <= 87.5) {
        height = window.innerHeight - (window.innerHeight / 50) * Math.abs((val - 50) * 1.33)
      } else {
        height = 50
      }
      const uniforms = this.sky.material.uniforms
      if (uniforms) {
        uniforms['iMouse'].value = new Vector2(clientX, height)
      }
    },
    updateTime() {
      const time = (Date.now() - this.sky.startTime) / 1000
      if (this.sky.material && this.sky.material.uniforms) {
        this.sky.material.uniforms.iTime.value = time
      }
    }
  }
}
</script>

<style>

</style>
