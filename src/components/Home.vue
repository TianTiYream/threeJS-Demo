<!--
 * @Description: three学习demo
 * @Author: xxm
 * @Date: 2021-06-07 14:14:52
-->
<template>
  <div id="home">
    <el-row class="tac">
      <el-col :span="4">
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#fff"
          text-color="#000"
          active-text-color="#ffd04b">
          <el-submenu index="1">
            <template slot="title">
              <span>阴影</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1">
                <router-link to="/shadow">阴影辅助</router-link>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <span>天空</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="2-1">
                <router-link to="/sky">天空</router-link>
              </el-menu-item>
              <el-menu-item index="2-2">
                <router-link to="/skyBox">天空盒子</router-link>
              </el-menu-item>
              <el-menu-item index="2-3">
                <router-link to="/glslSky">纯代码天空随时间改变</router-link>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <span>纹理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="3-1">
                <router-link to="/uv">UV映射</router-link>
              </el-menu-item>
              <el-menu-item index="3-2">
                <router-link to="/grass">草地</router-link>
              </el-menu-item>
              <el-menu-item index="3-3">
                <router-link to="/textureAnimation">纹理动画</router-link>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <span>精灵图</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="4-1">
                <router-link to="/snow">雪花</router-link>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item index="5">
            <router-link to="/FPV">第一人称视角</router-link>
          </el-menu-item>
          <el-menu-item index="6">
            <router-link to="/guide">小视图</router-link>
          </el-menu-item>
          <el-menu-item index="7">
            <router-link to="/glsl">着色器</router-link>
          </el-menu-item>
          <el-submenu index="8">
            <template slot="title">
              <span>加载器</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="8-1">
                <router-link to="/gltfLoader">GLTF加载器</router-link>
              </el-menu-item>
               <el-menu-item index="8-2">
                <router-link to="/addIcon">模型添加图标</router-link>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-col>
      <el-col :span="20">
        <div id="container"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as INIT from '@/utils/init.js'

export default {
  name: 'Home',
  data() {
    return {
      // scene: new Scene()
    }
  },
  mounted() {
    // 初始化场景
    INIT.initThree({domId: "container"})
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>

<style>
body {
  margin: 0;
}
a {
  text-decoration: none;
}
.el-menu-item a {
  display: inline-block;
  width: 100%;
}
</style>