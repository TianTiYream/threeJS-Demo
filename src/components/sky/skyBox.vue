<!--
 * @Description: 天空盒
 * @Author: xxm
 * @Date: 2021-06-21 14:01:04
-->
<template>
  <div id="skyBox"></div>
</template>

<script>
import * as INIT from '@/utils/init.js'
import { Scene, BoxGeometry, Mesh } from 'three'

export default {
  data() {
    return {
      scene: new Scene()
    }
  },
  mounted() {
    const imgPath = 'images/sky2/'
    const imgUlrs = ['+x.png', '-x.png', '+y.png', '-y.png', '+z.png', '-z.png']
    // const imgUlrs = ['right.png', 'left.png', 'up.png', 'down.png', 'front.png', 'back.png']

    const materials = imgUlrs.map(item => {
      return INIT.loadTexture(imgPath + item)
    })
    const skyGeomertry = new BoxGeometry(5120, 5120, 5120)
    const skyMesh = new Mesh(skyGeomertry, materials)

    const rotate = () => {
      skyMesh.rotation.y += 0.001
    }

    INIT.initThree({scene: this.scene, domId: 'skyBox', animateFn: rotate})

    this.scene.add(skyMesh)

    // this.scene.background = new CubeTextureLoader()
    // .setPath( 'images/' )
    // .load( [
      // '+x.png',
      // '-x.png',
      // '+y.png',
      // '-y.png',
      // '+z.png',
      // '-z.png'
    // ] );
    // this.scene.background.center = new Vector2(0.5, 0.5)
  },
  methods: {

  }
}
</script>

<style>

</style>