/*
 * @Description: 
 * @Author: xxm
 * @Date: 2021-06-07 14:10:42
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/components/Home.vue'
import Shadow from '@/components/shadow/Shadow.vue'
import FPV from '@/components/viewPort/FPV/index.vue'
import Guide from '@/components/viewPort/guide/index.vue'
import SkyBox from '@/components/sky/skyBox/skyBox.vue'
import GlslSky from '@/components/sky/skyChange/glslSky.vue'
import UV from '@/components/texture/UV/index.vue'
import GLSL from '@/components/glsl/index.vue'
import Grass from '@/components/texture/grass/index.vue'
import TextureAnimation from '@/components/texture/textureAnimation/index.vue'
import Snow from '@/components/Sprites/Snow.vue'
import GltfLoader from '@/components/loaders/gltfLoader/GLTFLoader.vue'
import addIcon from '@/components/loaders/addIcon/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/shadow',
    name: 'Shadow',
    component: Shadow
  },
  {
    path: '/skyBox',
    name: 'skyBox',
    component: SkyBox
  },
  {
    path: '/glslSky',
    name: 'glslSky',
    component: GlslSky
  },
  {
    path: '/FPV',
    name: 'FPV',
    component: FPV
  },
  {
    path: '/guide',
    name: 'guide',
    component: Guide
  },
  {
    path: '/uv',
    name: 'uv',
    component: UV
  },
  {
    path: '/grass',
    name: 'grass',
    component: Grass
  },
  {
    path: '/textureAnimation',
    name: 'textureAnimation',
    component: TextureAnimation
  },
  {
    path: '/glsl',
    name: 'glsl',
    component: GLSL
  },
  {
    path: '/snow',
    name: 'snow',
    component: Snow
  },
  {
    path: '/gltfLoader',
    name: 'gltfLoader',
    component: GltfLoader
  },
  {
    path: '/addIcon',
    name: 'addIcon',
    component: addIcon
  }
]

const router = new VueRouter({routes})
export default router
