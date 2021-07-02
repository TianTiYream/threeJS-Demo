<!--
 * @Description: 着色器
 * @Author: xxm
 * @Date: 2021-06-23 08:55:34
-->
<template>
  <div>
    <div id="glsl"></div>
    <script id="vertexShader" type="x-shader/x-vertex">

        precision mediump float;
        precision mediump int;

        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;

        attribute vec3 position;

        varying vec3 vPosition;

        void main() {

            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

        }

    </script>
    <script id="fragmentShader" type="x-shader/x-fragment">

        precision mediump float;
        precision mediump int;

        uniform float ratio;

        varying vec3 vPosition;

        void main() {
            vec3 center = vec3( 0.0,0.0,0.0 );
            float dist = distance(vPosition,center)/100.0; 
            dist = clamp(dist,0.0,1.0); 
            float color = 1.0-dist ; 
            gl_FragColor =  vec4( color*ratio, color*ratio,0.0,dist );

        }

    </script>

    <script id="vertex-shader-1" type="x-shader/x-vertex">
      precision mediump float;
      precision mediump int;

      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;

      attribute vec3 position;
      varying vec3 vPosition;


      void main(){
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }
    </script>
    <script id="fragment-shader-9" type="x-shader/x-fragment">
      precision mediump float;
      precision mediump int;

      uniform vec2 resolution;

      vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ){
        return a + b*cos( 6.28318*(c*t+d) );
      }
      void main() {
        vec2 p = gl_FragCoord.xy / resolution.xy;
        vec3 col = pal( p.x, vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.33,0.67) );
        if( p.y>(1.0/7.0) ) col = pal( p.x, vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.10,0.20) );
        if( p.y>(2.0/7.0) ) col = pal( p.x, vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.3,0.20,0.20) );
        if( p.y>(3.0/7.0) ) col = pal( p.x, vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,0.5),vec3(0.8,0.90,0.30) );
        if( p.y>(4.0/7.0) ) col = pal( p.x, vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,0.7,0.4),vec3(0.0,0.15,0.20) );
        if( p.y>(5.0/7.0) ) col = pal( p.x, vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(2.0,1.0,0.0),vec3(0.5,0.20,0.25) );
        if( p.y>(6.0/7.0) ) col = pal( p.x, vec3(0.8,0.5,0.4),vec3(0.2,0.4,0.2),vec3(2.0,1.0,1.0),vec3(0.0,0.25,0.25) );
        float f = fract(p.y*7.0);
        col *= smoothstep( 0.49, 0.47, abs(f-0.5) );
        col *= 0.5 + 0.5*sqrt(4.0*f*(1.0-f));
    
        gl_FragColor = vec4(col,1.0);
      }
    </script>
  </div>
</template>

<script>
import {RawShaderMaterial, Mesh, Scene, PlaneGeometry, Vector2} from 'three'
import * as INIT from '@/utils/init.js'

export default {
  data () {
    return {
      scene: new Scene()
    }
  },
  mounted() {
    const width = window.innerWidth
    const height = window.innerHeight
    const geometry = new PlaneGeometry(width, height)
    const material = new RawShaderMaterial({ 
      uniforms: {
          // ratio: {
          //     value: 0.0
          // },
          resolution: {
             value: new Vector2(width, height)
          }
      },
      vertexShader: document.getElementById('vertex-shader-1').textContent,
      fragmentShader: document.getElementById('fragment-shader-9').textContent, 
    })
    const plane = new Mesh(geometry, material);
    // plane.rotateX(-Math.PI / 2); 
    this.scene.add(plane);

    // let next = 0;
    // const animate = function () {
    //     next = next + 0.01;
    //     if (next > 1)
    //         next = 0;
    //     plane.material.uniforms.ratio.value = next;
    // };

    // INIT.initThree({scene: this.scene, domId: 'glsl', animateFn: animate})
    INIT.initThree({scene: this.scene, domId: 'glsl'})
  }
}
</script>

<style>

</style>