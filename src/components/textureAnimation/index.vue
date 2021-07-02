<!--
 * @Description: 纹理动画
 * @Author: xxm
 * @Date: 2021-06-24 16:59:20
-->
<template>
  <div id="textureAnimation"></div>
</template>

<script>
import { Scene, CatmullRomCurve3, Vector3, TubeGeometry, TextureLoader, RepeatWrapping, Mesh, MeshPhongMaterial, Shape, ExtrudeGeometry } from 'three'
import * as INIT from '@/utils/init.js'

export default {
  data() {
    return {
      scene: new Scene(),
      Shape: ''
    }
  },
  mounted() {
    // 动画曲线
    const curve = new CatmullRomCurve3([
      new Vector3(-80, -40, 0),
      new Vector3(-70, 40, 0),
      new Vector3(70, 40, 0),
      new Vector3(80, -40, 0)
    ])
    const tubeGeometry = new TubeGeometry(curve, 100, 0.6, 50, false)
    const textureLoader = new TextureLoader()
    const texture = textureLoader.load('images/texture/run.png')

    const animateFn = () => {
      texture.offset.x -= 0.06
    }

    const { camera } = INIT.initThree({scene: this.scene, domId: 'textureAnimation', animateFn})

    camera.position.z = 480


    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping

    texture.repeat.x = 20

    const tubeMaterial = new MeshPhongMaterial({
      map: texture,
      transparent: true
    });

    const textureMesh = new Mesh(tubeGeometry, tubeMaterial)
    this.scene.add(textureMesh)

    // 3D心形
    const heart = this.addHeart(-103, -10, 0.3)
    const geometry = new ExtrudeGeometry(heart.Shape, heart.ExtrudeSettings);
    const heartMesh = new Mesh(geometry, new MeshPhongMaterial({
        color: heart.color
    }))
    heartMesh.position.set(heart.ShapeX, heart.ShapeY, heart.ShapeZ);
    heartMesh.rotation.set(heart.rx, heart.ry, heart.rz);
    heartMesh.scale.set(heart.s, heart.s, heart.s);
    this.scene.add(heartMesh)

    const heart2 = this.addHeart(125, -10, 0.3)
    const geometry2 = new ExtrudeGeometry(heart2.Shape, heart2.ExtrudeSettings);
    const heartMesh2 = new Mesh(geometry2, new MeshPhongMaterial({
        color: heart.color
    }))
    heartMesh2.position.set(heart2.ShapeX, heart2.ShapeY, heart2.ShapeZ);
    heartMesh2.rotation.set(heart2.rx, heart2.ry, heart2.rz);
    heartMesh2.scale.set(heart2.s, heart2.s, heart2.s);
    this.scene.add(heartMesh2)
  },
  methods: {
    addHeart(x, y, s) {
      const heart = {}
      heart.s = s
      heart.x = 0;
      heart.y = 0;
      heart.ShapeX = x;
      heart.ShapeY = y;
      heart.ShapeZ = 0;
      heart.rx = 0;
      heart.ry = 0;
      heart.rz = Math.PI;
      heart.Shape = new Shape()
      heart.ExtrudeSettings = {
        depth: 10,
        bevelEnabled: true,
        bevelSegments: 50,
        steps: 50,
        bevelSize: 20,
        bevelThickness: 30
      }
      heart.color = '#ff0000'
      this.makeShape(x, y, heart)
      return heart
    },
    makeShape(x, y, heart) {
      heart.Shape.moveTo(x + 25, y + 25);
      heart.Shape.bezierCurveTo(x + 25, y + 25, x + 20, y, x, y);
      heart.Shape.bezierCurveTo(x - 30, y, x - 30, y + 35, x - 30, y + 35);
      heart.Shape.bezierCurveTo(x - 30, y + 55, x - 10, y + 77, x + 25, y + 95);
      heart.Shape.bezierCurveTo(x + 60, y + 77, x + 80, y + 55, x + 80, y + 35);
      heart.Shape.bezierCurveTo(x + 80, y + 35, x + 80, y, x + 50, y);
      heart.Shape.bezierCurveTo(x + 35, y, x + 25, y + 25, x + 25, y + 25);
    }
  }
}
</script>

<style>

</style>
