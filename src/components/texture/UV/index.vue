<!--
 * @Description: UV映射案例
 * @Author: xxm
 * @Date: 2021-06-22 11:30:44
-->
<template>
  <div id="uv"></div>
</template>

<script>
import * as INIT from '@/utils/init.js'
import { BoxGeometry, Mesh, MeshBasicMaterial, MeshPhongMaterial, Scene, SphereGeometry, TextureLoader, Vector2 } from 'three'

export default {
  data() {
    return {
      scene: new Scene()
    }
  },
  mounted() {
    const radius = 100
    const cubeSize = 200
    // 初始化场景
    const {renderer} = INIT.initThree({scene: this.scene, domId: "uv"})
    renderer.setClearColor('#D8BFD8')

    const textureLoader = new TextureLoader()
    const imgPath = 'images/sky2/'
    const imgUlrs = ['+x.png', '-x.png', '+y.png', '-y.png', '+z.png', '-z.png']
    // const imgUlrs = ['right.png', 'left.png', 'up.png', 'down.png', 'front.png', 'back.png']

    const materials = imgUlrs.map(item => {
      return INIT.loadTexture(imgPath + item)
    })

    // 贴图到球体
    const earthBallGeometry = new SphereGeometry(radius, 50, 50)
    const earthMarterial = new MeshBasicMaterial({
      map: textureLoader.load( "images/sky2/-z.png" )
    })
    const earthMesh = new Mesh(earthBallGeometry, earthMarterial)
    earthMesh.position.x = -500

    this.scene.add(earthMesh)

     // 贴图到立方体
    const cubeGeometry = new BoxGeometry(cubeSize, cubeSize, cubeSize)
    const cubeMesh = new Mesh(cubeGeometry, materials)
    cubeMesh.position.x = -200

    this.scene.add(cubeMesh)

    const earthMarterial2 = new MeshBasicMaterial({
      map: textureLoader.load( "images/texture/earth_atmos_2048.jpg" )
    })

    // 世界气象图贴图到立方体
    const cubeGeometry2 = new BoxGeometry(cubeSize, cubeSize, cubeSize)
    const cubeMesh2 = new Mesh(cubeGeometry2, earthMarterial2)
    cubeMesh2.position.x = 100

    this.scene.add(cubeMesh2)

    // 世界气象图贴图到球体
    const earthBallGeometry2 = new SphereGeometry(radius, 50, 50)
    const earthMesh2 = new Mesh(earthBallGeometry2, earthMarterial2)
    earthMesh2.position.x = 400

    this.scene.add(earthMesh2)

    // 立体气象图
    const earthMarterial3 = new MeshPhongMaterial({
      map: textureLoader.load( "images/texture/earth_atmos_2048.jpg" ), // 普通颜色纹理贴图 
      normalMap: textureLoader.load( "images/texture/EarthNormal.png" ), // 法线贴图
      normalScale: new Vector2(1.2, 1.2) // 设置深浅程度， 默认值(1, 1)
    })

    const earthBallGeometry3 = new SphereGeometry(radius, 50, 50)
    const earthMesh3 = new Mesh(earthBallGeometry3, earthMarterial3)
    earthMesh3.position.x = 700

    this.scene.add(earthMesh3)
  }
}
</script>

<style>

</style>
