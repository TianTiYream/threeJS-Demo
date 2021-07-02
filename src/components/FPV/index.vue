<template>
  <div>
    <canvas id="mainCanvas"></canvas>
  </div>
</template>

<script>
import * as THREE from 'three'
import { ArrowHelper } from 'three';

export default {
  name: 'FPV',
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      leftPress: null,
      cube: null,
      left: null,
      right: null,
      front: null,
      back: null,
      arrowFront: null,
      arrowBack: null,
      arrowFrontX: null,
      arrowFrontZ: null,
      arrowLeft: null,
    }
  },
  mounted() {
    this.init();
    this.helper();
    this.createBoxer();
    this.animate();
    const that = this
    window.onmousemove = function (event) {
        event.preventDefault();
        // console.log(event, 'event');
        if (that.leftPress) {
            that.cube.rotateOnWorldAxis(
                new THREE.Vector3(0, 1, 0),
                event.movementX / 500
            );
            that.cube.rotateOnAxis(
                new THREE.Vector3(1, 0, 0),
                event.movementY / 500
            );
        }
    };

    window.onmousedown = function (event) {
        event.preventDefault();
        that.leftPress = true;

    };

    window.onmouseup = function (event) {
        event.preventDefault();
        that.leftPress = false;
    }

    window.onkeydown = function (event) {
        switch (event.keyCode) {
            case 65: // a
                that.left = true;
                break;
            case 68: // d
                that.right = true;
                break;
            case 83: // s
                that.back = true;
                break;
            case 87: // w
                that.front = true;
                break;
        }
    };

    window.onkeyup = function (event) {
        switch (event.keyCode) {
            case 65: // a
                that.left = false;
                break;
            case 68: // d
                that.right = false;
                break;
            case 83: // s
                that.back = false;
                break;
            case 87: // w
                that.front = false;
                break;
        }
    };
  },
  methods: {
    init() {
      // 初始化场景
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xffffff);

      // 创建渲染器
      this.renderer = new THREE.WebGLRenderer({
          canvas: document.getElementById("mainCanvas"),
          antialias: true, // 抗锯齿
          alpha: true
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight);

      // 创建透视相机
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.camera.position.set(0, 40, 30);
      this.camera.lookAt(0, 0, 0);

      // 参数初始化
      // const mouse = new THREE.Vector2();
      // const raycaster = new THREE.Raycaster();

      // 环境光
      var ambientLight = new THREE.AmbientLight(0x606060);
      this.scene.add(ambientLight);
      // 平行光
      var directionalLight = new THREE.DirectionalLight(0xBCD2EE);
      directionalLight.position.set(1, 0.75, 0.5).normalize();
      this.scene.add(directionalLight);
    },

    helper() {
        var grid = new THREE.GridHelper(100, 20, 0xFF0000, 0x000000);
        grid.material.opacity = 0.1;
        grid.material.transparent = true;
        this.scene.add(grid);

        var axesHelper = new THREE.AxesHelper(30);
        this.scene.add(axesHelper);
    },

    animate() {
        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
        // getWorldDirection 返回一个表示该物体在世界空间中Z轴正方向的矢量
        // normalize 将该向量转换为单位向量
        // setDirection ArrowHelper类设置方向
        this.arrowFront.setDirection(this.cube.getWorldDirection(new THREE.Vector3()).normalize());
        this.arrowFront.position.copy(this.cube.position);

        // negate 向量取反
        this.arrowBack.setDirection(this.cube.getWorldDirection(new THREE.Vector3()).negate().normalize());
        this.arrowBack.position.copy(this.cube.position);

        const cubeDir = this.cube.getWorldDirection(new THREE.Vector3())
        this.arrowLeft.setDirection(cubeDir.cross(new THREE.Vector3(0, 10, 0)).normalize());
        this.arrowLeft.position.copy(this.cube.position);

        let vect = this.cube.getWorldDirection(new THREE.Vector3()).normalize()
        this.arrowFrontX.setDirection(new THREE.Vector3(1, 0, 0))
        this.arrowFrontX.setLength(vect.dot(new THREE.Vector3(15, 0, 0)))
        this.arrowFrontX.position.copy(this.cube.position)

        this.arrowFrontZ.setDirection(new THREE.Vector3(0, 0, 1))
        this.arrowFrontZ.setLength(vect.dot(new THREE.Vector3(0, 0, 15)))
        this.arrowFrontZ.position.copy(this.cube.position)

        // 前后向量
        let vect1 = this.cube.getWorldDirection(new THREE.Vector3())
        // 左右向量
        let vect2 = this.cube.getWorldDirection(new THREE.Vector3()).cross(new THREE.Vector3(0, 1, 0))
        // console.log(vect1.z.cross(vect1.y), 'vect1');

        // let vectZ = new THREE.Vector3(0, 0, vect1.z)
        // let vectY = new THREE.Vector3(0, vect1.y, 0)

        if (this.front) {
          // this.cube.translateZ(-1)
          // this.cube.position.z -= 1
          this.cube.position.z -= vect1.dot(new THREE.Vector3(0, 0, 15)) * 0.01
          this.cube.position.x -= vect1.dot(new THREE.Vector3(15, 0, 0)) * 0.01
        }
        if (this.back) {
          // this.cube.translateZ(1)
          // this.cube.position.z += 1
          this.cube.position.z += vect1.dot(new THREE.Vector3(0, 0, 15)) * 0.01
          this.cube.position.x += vect1.dot(new THREE.Vector3(15, 0, 0)) * 0.01
        }
        if (this.left) {
          // this.cube.translateX(-1)
          // this.cube.position.x -= 1
          this.cube.position.z += vect2.dot(new THREE.Vector3(0, 0, 15)) * 0.01
          this.cube.position.x += vect2.dot(new THREE.Vector3(15, 0, 0)) * 0.01
        }
        if (this.right) {
          // this.cube.translateX(1)
          // this.cube.position.x += 1
          this.cube.position.z -= vect2.dot(new THREE.Vector3(0, 0, 15)) * 0.01
          this.cube.position.x -= vect2.dot(new THREE.Vector3(15, 0, 0)) * 0.01
        }
    },

    createBoxer() {
        var geometry = new THREE.BoxGeometry(5, 5, 5);
        var mats = []
        mats.push(new THREE.MeshPhongMaterial({color: 0x00ff00}))
        mats.push(new THREE.MeshPhongMaterial({color: 0xff0000}))
        // var material = new THREE.MeshPhongMaterial({color: 0x00ff00});
        this.cube = new THREE.Mesh(geometry, mats);
        for (let j = 0; j < geometry.groups.length; j++) {
          if (j === 4) {
            geometry.groups[j].materialIndex = 1;
          } else {
            geometry.groups[j].materialIndex = 0
          }
        }
        this.scene.add(this.cube);

        this.arrowFront = new ArrowHelper(this.cube.getWorldDirection(new THREE.Vector3()), this.cube.position, 15, 0xFF0000)
        this.scene.add(this.arrowFront)
        this.arrowBack = new ArrowHelper(this.cube.getWorldDirection(new THREE.Vector3()).negate(), this.cube.position, 15, 0x00FF00)
        this.scene.add(this.arrowBack)


        let cubeDirec = this.cube.getWorldDirection(new THREE.Vector3())

        this.arrowLeft = new ArrowHelper(cubeDirec.cross(new THREE.Vector3(0, 10, 0)), this.cube.position, 15, 0xff00ff)
        this.scene.add(this.arrowLeft)


        this.arrowFrontX = new ArrowHelper(cubeDirec.setY(0), this.cube.position, cubeDirec.dot(new THREE.Vector3(0, 0, 15)), 0x0000ff)
        this.scene.add(this.arrowFrontX)

        this.arrowFrontZ = new ArrowHelper(cubeDirec.setY(0), this.cube.position, cubeDirec.dot(new THREE.Vector3(15, 0, 0)), 0xB5B5B5)
        this.scene.add(this.arrowFrontZ)
    }
  },
}
</script>

<style>

</style>