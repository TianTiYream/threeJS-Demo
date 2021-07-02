<!--
 * @Description: 雪花飘舞精灵图
 * @Author: xxm
 * @Date: 2021-06-25 11:08:10
-->
<template>
  <div id="snow"></div>
</template>

<script>
import { AdditiveBlending, BufferGeometry, Float32BufferAttribute, Points, PointsMaterial, Scene, TextureLoader, FogExp2 } from 'three'
import * as INIT from '@/utils/init.js'

export default {
  data() {
    return {
      scene: new Scene(),
      vertices: [], // 点坐标数组
      materials: [], // 材质数组
      geometry: new BufferGeometry()
    }
  },
  mounted() {
    this.scene.fog = new FogExp2( 0x000000, 0.0008 );

    const textureLoader = new TextureLoader()
    const sprite1 = textureLoader.load('images/sprites/snowflake1.png')
    const sprite2 = textureLoader.load('images/sprites/snowflake2.png')
    const sprite3 = textureLoader.load('images/sprites/snowflake3.png')
    const sprite4 = textureLoader.load('images/sprites/snowflake4.png')
    const sprite5 = textureLoader.load('images/sprites/snowflake5.png')

    this.initPointsPos()

    this.geometry.setAttribute('position', new Float32BufferAttribute(this.vertices, 3))

    const parameters = [
      [[ 1.0, 0.2, 0.5 ], sprite2, 20 ],
      [[ 0.95, 0.1, 0.5 ], sprite3, 15 ],
      [[ 0.90, 0.05, 0.5 ], sprite1, 10 ],
      [[ 0.85, 0, 0.5 ], sprite5, 8 ],
      [[ 0.80, 0, 0.5 ], sprite4, 5 ]
    ]
    this.initMaterials(parameters)
    
    const mouseX = 0
    const mouseY = 0
    const camera = INIT.initCamera({fov: 75, far: 2000, position: {x: 0, y: 0, z: 1000}})

    const renderer = INIT.initRenderer({clearColor: 0x000000})

    const animateFn = () => {
      const time = Date.now() * 0.00005

      camera.position.x += ( mouseX - camera.position.x ) * 0.05;
      camera.position.y += ( - mouseY - camera.position.y ) * 0.05;
      camera.lookAt(this.scene.position)

      for (let index = 0; index < this.scene.children.length; index++) {
        const object = this.scene.children[index];
        if (object instanceof Points) {
          object.rotation.y = time * (index < 4 ? index + 1 : - (index + 1))
        }
      }
      for ( let i = 0; i < this.materials.length; i ++ ) {
        const color = parameters[ i ][ 0 ];
        const h = ( 360 * ( color[ 0 ] + time ) % 360 ) / 360;
        this.materials[ i ].color.setHSL( h, color[ 1 ], color[ 2 ] );

      }
    }
    
    const controls = null

    INIT.animate(renderer, this.scene, camera, controls, animateFn)

    const ele = document.getElementById('snow')
    ele.appendChild(renderer.domElement)

    window.addEventListener('resize', INIT.resizeScreen(renderer, camera))
  },
  methods: {
    // 10000个雪花位置坐标
    initPointsPos() {
      for (let i = 0; i < 10000; i++) {
        const x = Math.random() * 2000 - 1000
        const y = Math.random() * 2000 - 1000
        const z = Math.random() * 2000 - 1000
        this.vertices.push(x, y, z)
      }
    },
    // 添加雪花材质
    initMaterials(parameters) {
      for (let index = 0; index < parameters.length; index++) {
        const color = parameters[index][0]
        const sprite = parameters[index][1]
        const size = parameters[index][2]
        
        this.materials[index] = new PointsMaterial({size, map: sprite, blending: AdditiveBlending, depthTest: false, transparent: true})
        this.materials[index].color.setHSL(color[0], color[1], color[2])
        
        const particles = new Points(this.geometry, this.materials[index])

        particles.rotation.x = Math.random() * 6
        particles.rotation.y = Math.random() * 6
        particles.rotation.z = Math.random() * 6

        this.scene.add(particles)
      }
    }
  }
}
</script>

<style>

</style>
