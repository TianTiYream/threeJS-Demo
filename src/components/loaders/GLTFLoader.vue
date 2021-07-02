<!--
 * @Description: 加载gltf模型
 * @Author: xxm
 * @Date: 2021-06-25 14:34:42
-->
<template>
  <div id="gltf"></div>
</template>

<script>
import { Scene, DirectionalLightHelper, Object3D, PCFSoftShadowMap, Mesh } from 'three'
import * as INIT from '@/utils/init.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

export default {
  data() {
    return {
      scene: new Scene()
    }
  },
  mounted() {
    const {renderer, camera} = INIT.initThree({scene: this.scene, domId: 'gltf'})
    renderer.shadowMap.enabled = true // 开启阴影
    renderer.shadowMap.type = PCFSoftShadowMap // 柔化阴影

    // camera.rotation.x = 0.52
    camera.lookAt(0, 200, 200)

    const help2 = INIT.initHelp({helpType: 'camera', option: camera})
    this.scene.add(help2)

    // const pointLight = new PointLight('#ffffff', 1, 1000)
    // pointLight.position.set(0, 0, 0)
    // pointLight.castShadow = true
    // this.scene.add(pointLight)

    const directLight = INIT.initDirectionalLight({position: {x: 0, y: 900, z: -1000}, openShadow: true})
    // directLight.position.set(0, 900, -1200)
    const target = new Object3D()
    target.position.set(0, 0, 400)
    this.scene.add(target)

    // const box = INIT.initTestBox({x: 0, y: 50, z: 300})
    // this.scene.add(box)

    directLight.target = target
    this.scene.add(directLight)

    const light1 = INIT.initDirectionalLight({position: {x: -200, y: 100, z: 200}})
    this.scene.add(light1)

    const light2 = INIT.initDirectionalLight({position: {x: 200, y: 100, z: 200}})
    this.scene.add(light2)

    const light3 = INIT.initDirectionalLight({position: {x: 200, y: 100, z: -200}})
    this.scene.add(light3)

    const light4 = INIT.initDirectionalLight({position: {x: -200, y: 100, z: -200}})
    this.scene.add(light4)

    console.log(this.scene, 'scene');


    const loader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/downLoadModel/draco/')
    loader.setDRACOLoader(dracoLoader)
    loader.load('downLoadModel/chinese-style-tea-table/source/chatai.glb', (gltf) => {
      console.log(gltf.scene, 'gltf');
      gltf.scene.traverse((obj) => {
        if (obj instanceof Mesh) {
          obj.castShadow = true
          obj.receiveShadow = true
        }
      })
      // gltf.scene.rotateX(0.52)
      // gltf.scene.rotateY(0.07)
      // gltf.scene.castShadow = true
      // gltf.scene.receiveShadow = true
      this.scene.add(gltf.scene)
      const lightHelp = new DirectionalLightHelper(directLight, 1000, '#ff0000')
      this.scene.add(lightHelp)
    }, (xhr) => {
       console.log((xhr.loaded / xhr.total * 100) + '% loaded')
    }, (err) => {
      console.log(err);
    })
  }
}
</script>

<style>

</style>
