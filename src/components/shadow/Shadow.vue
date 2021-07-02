<template>
  <div id="shadow"></div>
</template>

<script>
import { AmbientLight, AxesHelper, BoxGeometry, DirectionalLight, CameraHelper, DirectionalLightHelper, Mesh, MeshLambertMaterial,
  MeshStandardMaterial, PerspectiveCamera, PCFSoftShadowMap, PlaneBufferGeometry, Scene, WebGLRenderer, DoubleSide } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default {
  name: 'Shadow',
  data() {
    return {
      scene: new Scene(),
      camera: new PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 10000),
      renderer: new WebGLRenderer({antialias: true}),
      directionalLight: new DirectionalLight(0xffffff),
      ambientLight: new AmbientLight(0xffffff),
      helper: new AxesHelper(500),
      lightHelper: null,
      cameraHelper: null,
      controls: null
    }
  },
  mounted() {
    this.init()

    window.addEventListener('resize', () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      // 照相机保持原有比例
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.render(this.scene, this.camera)
    })

    this.renderUpdate()
  },
  methods: {
    init () {
      const box = new BoxGeometry(30, 30, 30)
      const boxMaterial = new MeshStandardMaterial({color: 0xff0000})
      const boxMesh = new Mesh(box, boxMaterial)
      boxMesh.castShadow = true

      this.scene.add(boxMesh)

      const plane = new PlaneBufferGeometry(200, 200)

      const planeMaterial = new MeshLambertMaterial({color: 0xffffff, side: DoubleSide})

      const planeMesh = new Mesh(plane, planeMaterial)
      planeMesh.position.set(0, -15, 0)
      planeMesh.rotation.set(-Math.PI / 2, 0, 0)
      planeMesh.receiveShadow = true

      this.scene.add(planeMesh)

      this.camera.position.set(1000, 50, 1500)
      this.camera.lookAt(this.scene.position)
      this.scene.add(this.camera)

      this.directionalLight.position.set(260, 600, 520)
      this.directionalLight.castShadow = true

      this.directionalLight.shadow.mapSize.width = 1024;
			this.directionalLight.shadow.mapSize.height = 1024;
      
      const d = 300

      this.directionalLight.shadow.camera.top = d
      this.directionalLight.shadow.camera.bottom = -d
      // this.directionalLight.shadow.camera.near = -100
      this.directionalLight.shadow.camera.far = 1000
      this.directionalLight.shadow.camera.left = -d
      this.directionalLight.shadow.camera.right = d

      this.scene.add(this.directionalLight)

      this.scene.add(this.helper)

      // this.cameraHelper2 = new CameraHelper(this.camera)
      // this.scene.add(this.cameraHelper2)


      this.cameraHelper = new CameraHelper(this.directionalLight.shadow.camera)
      this.scene.add(this.cameraHelper)

      this.lightHelper = new DirectionalLightHelper(this.directionalLight, 500, '#f0ff00')
      this.scene.add(this.lightHelper)

      this.controls = new OrbitControls(this.camera, this.renderer.domElement)

      this.renderer.setClearColor('#fefefe')
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.renderer.shadowMap.enabled = true // 开启阴影
      this.renderer.shadowMap.type = PCFSoftShadowMap // 柔化阴影

      console.log(this.scene, 'scene')
      this.renderer.render(this.scene, this.camera)


      const renderEle = document.getElementById('shadow')
      renderEle.appendChild(this.renderer.domElement)

      this.controls.update()

    },
    renderUpdate() {
      this.controls.update()
      this.renderer.render(this.scene, this.camera)
      requestAnimationFrame(this.renderUpdate)
    }
  }
}
</script>

<style>

</style>