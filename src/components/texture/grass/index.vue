<!--
 * @Description: 草地贴图
 * @Author: xxm
 * @Date: 2021-06-24 16:25:21
-->
<template>
  <div id="grass"></div>
</template>

<script>
import * as INIT from '@/utils/init.js'
import {MeshLambertMaterial, PlaneGeometry, RepeatWrapping, Scene, TextureLoader, Mesh, sRGBEncoding} from 'three'

export default {
  data() {
    return {
      scene: new Scene()
    }
  },
  mounted() {
    const {renderer} = INIT.initThree({scene: this.scene, domId: 'grass'})

    renderer.outputEncoding = sRGBEncoding

    // 创建一个地面
    const geometry = new PlaneGeometry(1000, 1000) // 矩形平面

    // 加载草地纹理贴图
    const texture = new TextureLoader().load('images/texture/grass2.jpg')

    // 设置阵列
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping

    // UV两个方向重复数量
    texture.repeat.set(10, 10)

    const marterial = new MeshLambertMaterial({
      map: texture
    })

    const mesh = new Mesh(geometry, marterial)

    this.scene.add(mesh)
    mesh.rotateX(-Math.PI / 4);
  }
}
</script>

<style>

</style>