<!--
 * @Description: 在模型上添加小图标
 * @Author: xxm
 * @Date: 2021-07-01 11:25:52
-->
<template>
  <div id="addIcon" @click="mouseClick"></div>
</template>

<script>
import * as INIT from '@/utils/init.js'
import { Scene, Mesh, Object3D, PCFSoftShadowMap, sRGBEncoding, MeshBasicMaterial, TextureLoader, PlaneGeometry, DoubleSide } from 'three'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { getSelectedObj } from '@/utils/getModel.js'
import { createCompanyIcon } from '@/utils/createTextIcon.js'


export default {
  data() {
    return {
      scene: new Scene(),
      camera: null,
      points: [
        { 
          hospital: {
            position: {x: 4635.6621312723855, y: 2319.3809133848825, z: -8099.6650390625},
            text: '医院',
            name: 'hospital'
          }
        }
      ]
    }
  },
  mounted() {
    // 初始化场景
    const {camera, renderer} = INIT.initThree({scene: this.scene, domId: "addIcon"})
    this.camera = camera
    this.camera.position.z = 2000
    this.camera.position.x = 2000
    this.camera.position.y = 400
    this.camera.rotation.x = -0.5
    this.camera.far = 20000000

    renderer.shadowMap.enabled = true // 开启阴影
    renderer.shadowMap.type = PCFSoftShadowMap // 柔化阴影
    renderer.outputEncoding = sRGBEncoding

    const shadowConfigDefault = {
      mapSize: {width: 4096, height: 4096}, 
      camera: {near: 0.5, far: 5000000, left: -20000, right: 20000, top: 20000, bottom: -20000}
    }
    const light1 = INIT.initDirectionalLight({color:'#F9DD97', position: {x: -370000, y: 342000, z: 100000}, openShadow: true, shadowConfig: shadowConfigDefault})
    this.scene.add(light1)

    const targetObject = new Object3D();
    targetObject.position.set(-5000, 0, -8000)
    this.scene.add(targetObject)

    light1.target = targetObject

    const light2 = INIT.initDirectionalLight({color:'#F9DD97', position: {x: -370000, y: -420, z: 100000}})
    this.scene.add(light2)
    light2.target = targetObject

    const light3 = INIT.initDirectionalLight({position: {x: -5000, y: 22000, z: 12000}})
    this.scene.add(light3)
    light3.target = targetObject

    const light4 = INIT.initDirectionalLight({position: {x: 5000, y: 22000, z: -12000}})
    this.scene.add(light4)

    const loader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/downLoadModel/draco/')
    loader.setDRACOLoader(dracoLoader)
     loader.load('downLoadModel/ccity_building_set_1/scene.gltf', (gltf) => {
      this.setShadow(gltf.scene)
      this.scene.add(gltf.scene)
      this.addMeshIcon()

      console.log(this.scene, 'scene');

      // const shadowHelp = INIT.initHelp({helpType: 'camera', option: light1.shadow.camera})
      // console.log(shadowHelp, 'shadow');
      // this.scene.add(shadowHelp)
    }, (xhr) => {
       console.log((xhr.loaded / xhr.total * 100) + '% loaded')
    }, (err) => {
      console.log(err);
    })
  },
  methods: {
    // 单击获取模型内部物体信息
    mouseClick(event) {
      const clientX = event.clientX
      const clientY = event.clientY
      const clickValue = getSelectedObj(clientX, clientY, this.scene, this.camera)
      console.log(clickValue, 'clickValue');
    },
    // 设置阴影
    setShadow(scene) {
      scene.traverse((obj) => {
        if (obj instanceof Mesh) {
          obj.castShadow = true
        }
        if (obj.name === 'BD_ConcreteBlock1_RoadsGround_0') {
          obj.castShadow = false
          obj.receiveShadow = true
        }
      })
    },
    // 添加图标
    addIcon() {
      const {position, text, name} = this.points[0].hospital
      const icon = createCompanyIcon(position, text, name)
      this.scene.add(icon)
    },
    // 添加图标
    addMeshIcon() {
      // 初始化一个加载器
      const that = this;
      const geometry = new PlaneGeometry(800, 500)
      const imgText = new TextureLoader().load('images/fonts/hospital.png');
      const material = new MeshBasicMaterial({
        map: imgText,
        side: DoubleSide
      })
      const textMesh = new Mesh(geometry, material)
      const {position, name} = that.points[0].hospital
      console.log(textMesh, 'text');
      textMesh.position.set(position.x, position.y, position.z)
      textMesh.name = name
      that.scene.add(textMesh)
    }
  }
}
</script>

<style>

</style>
