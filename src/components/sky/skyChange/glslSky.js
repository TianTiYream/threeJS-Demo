/*
 * @Description: shaderToy天空
 * @Author: xxm
 * @Date: 2021-06-23 10:08:07
 */

import { Mesh, ShaderMaterial, UniformsUtils, BackSide, BoxGeometry, Vector2 } from 'three'

const width = window.innerWidth
const height = window.innerHeight

class Sky extends Mesh {
  constructor() {
    const shader = Sky.SkyShader
    const material = new ShaderMaterial({
      name: 'SkyShader',
      fragmentShader: shader.fragmentShader,
      vertexShader: shader.vertexShader,
      uniforms: UniformsUtils.clone(shader.uniforms),
      side: BackSide,
      depthWrite: false
    })

    super(new BoxGeometry(1, 1, 1), material)
  }
}

Sky.prototype.isSky = true

Sky.SkyShader = {
	uniforms: {
		// 着色器输入
    // uniform vec3  iResolution;           // viewport resolution (in pixels)
    // uniform float iTime;                 // shader playback time (in seconds)
    // uniform float iTimeDelta;            // render time (in seconds)
    // uniform int   iFrame;                // shader playback frame
    // uniform float iChannelTime[4];       // channel playback time (in seconds)
    // uniform vec3  iChannelResolution[4]; // channel resolution (in pixels)
    // uniform vec4  iMouse;                // mouse pixel coords. xy: current (if MLB down), zw: click
    // uniform sampleiChannel0..3;          // input channel. XX = 2D/Cube
    // uniform vec4  iDate;                 // (year, month, day, time in seconds)
    // uniform float iSampleRate;           // sound sample rate (i.e., 44100)
    'iResolution': {
      type: 'v2',
      value: new Vector2(width, height)
    },// viewport resolution (in pixels)
    'iTime': {
      type: 'f',
      value: 1.0
    },    // shader playback time (in seconds)
    'iMouse': {
      value: new Vector2(0, 0)
    }// mouse pixel coords. xy: current (if MLB down), zw: click
	},
	fragmentShader: `
	uniform vec3  iResolution;           // viewport resolution (in pixels)
	uniform float iTime;                 // shader playback time (in seconds)
	uniform vec4  iMouse;                // mouse pixel coords. xy: current (if MLB down), zw: click

	const vec3 rayleighCoeff = vec3(0.27, 0.5, 1.0) * 1e-5;
	const float mieCoeff = 1e-6;
	
	#define pi 3.14159265359
	#define d0(x) abs(x) + 1e-8
	
	vec3 totalCoeff = rayleighCoeff + mieCoeff;
	
	vec3 scatter(vec3 coeff, float depth){
		return coeff * depth;
	}
	
	vec3 absorb(vec3 coeff, float depth){
		return exp2(scatter(coeff, -depth));
	}
	
	float calculateSceneDepth(float depth){
		depth = depth * 2.0 - 0.1;
			depth = max(depth + 0.01, 0.01);
			
			return depth * depth * (3.0 - 2.0 * depth);
	}
	
	float calcParticleThickness(float depth){

		depth = calculateSceneDepth(depth);
			depth = 1.0 / depth;
			
		return 50000.0 * depth;   
	}
	
	float rayleighPhase(vec2 p, vec2 lp){
		return 0.375 * (1.0 + pow(1.0 - distance(p, lp), 2.0) / log(2.0));
	}
	
	float rand(vec2 n) { 
		return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
	}
	
	float noise(vec2 p){
		vec2 ip = floor(p);
		vec2 u = fract(p);
		u = u*u*(3.0-2.0*u);
		
		float res = mix(
			mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
			mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
		return res*res;
	}
	
	#define NUM_OCTAVES 5
	
	float fbm(vec2 x) {
		float v = 0.0;
		float a = 0.5;
		vec2 shift = vec2(100);
		// Rotate to reduce axial bias
			mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
			
			float time = iTime * 0.075;
			
		for (int i = 0; i < NUM_OCTAVES; ++i) {
			v += a * noise(x + time);
			x = rot * x * 2.0 + shift;
			a *= 0.5;
					x += time;
		}
		return v;
	}
	
	vec3 calcClouds(vec2 p, vec2 lp, vec3 background, vec3 scatteredSunlight, vec3 scatteredSkylight, float depth, float rawDepthLight)
	{
			const int steps = 10;
			const float invSteps = 1.0 / float(steps);
			
			float stepsize = 1.0;
			
			p = p * 2.0 - 1.0;
			p *= 5.0;
			p /= depth;
			
			lp = lp * 2.0 - 1.0;
			lp *= 5.0;
			lp /= rawDepthLight;
	
			vec2 deltaPos = normalize(p - lp) * invSteps * stepsize;
			float transmittance = 1.0;
			float scattering = 0.0;
			
			const float cloudDensity = 800000.0;
			
			#define cloud clamp((fbm(p) - 0.25) * 10.0, 0.0, 1.0)
			
			float oldOD = cloud * cloudDensity;
			
			for (int i = 0; i < steps; i++){
			p -= deltaPos;
					
					float opticalDepth = cloud * cloudDensity;
					
					transmittance += opticalDepth;
					
			}
			
			const float anisatropicCoeff = 1.0 / (pi * 4.0);
			
			vec3 cloudAbsorb = absorb(vec3(mieCoeff), transmittance * stepsize);
			
			vec3 scatterCloud = scatter(vec3(mieCoeff), oldOD);
			vec3 sunScatter = scatterCloud * scatteredSunlight * pi;
			vec3 skyScatter = scatterCloud * scatteredSkylight * anisatropicCoeff;
			
			vec3 viewAbsorb = absorb(vec3(mieCoeff), oldOD);
			
			return background * viewAbsorb + (sunScatter * cloudAbsorb + skyScatter);
	}
	
	vec3 calcAtmosphericScatter(vec2 p, vec2 lp){
			const float ln2 = log(2.0);
			
			const float up = 0.6;
			
			float opticalDepth = calcParticleThickness(p.y);
			float opticalDepthLight = calcParticleThickness(lp.y);
			float opticalDepthUp = calcParticleThickness(up);
			
			vec3 scatterView = scatter(totalCoeff, opticalDepth);
			vec3 absorbView = absorb(totalCoeff, opticalDepth);
			
			vec3 scatterLight = scatter(totalCoeff, opticalDepthLight);
			vec3 absorbLight = absorb(totalCoeff, opticalDepthLight);
			
			vec3 scatterUp = scatter(totalCoeff, opticalDepthUp);
			vec3 absorbUp = absorb(totalCoeff, opticalDepthUp); 
			
			vec3 absorbSun = abs(absorbLight - absorbView) / d0((scatterLight - scatterView) * ln2);
			vec3 scatterSun = scatterView * rayleighPhase(p, lp);
			vec3 absorbUpv = abs(absorbLight - absorbUp) / d0((scatterLight - scatterUp) * ln2);
			vec3 scatterUpv = scatterUp * rayleighPhase(vec2(up), lp);
			
			vec3 skylight = scatterUpv * absorbUpv;
			
			vec3 sunSpot = smoothstep(0.01, 0.009, distance(p, lp)) * absorbView * pi;
			
			float rawDepth = calculateSceneDepth(p.y);
			float rawDepthLight = calculateSceneDepth(lp.y);
			float cloudMult = rawDepth <= 0.05 ? 0.0 : clamp((rawDepth - 0.05) * pi * 2.0, 0.0, 1.0);
			
			vec3 color = (scatterSun * absorbSun + sunSpot);
			vec3 clouds = calcClouds(p, lp, color, absorbLight, skylight, rawDepth, rawDepthLight);
			
			color = mix(color, clouds, cloudMult);
			
			return color * pi;
	}
	
	vec3 jodieReinhardTonemap(vec3 c){
			float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
			vec3 tc = c / (c + 1.0);
	
			return mix(c / (l + 1.0), tc, tc);
	}

	float random(vec2 ab) 
	{
		float f = (cos(dot(ab ,vec2(21.9898,78.233))) * 43758.5453);
		return fract(f);
	}
	float noiseStar(in vec2 xy) 
	{
		vec2 ij = floor(xy);
		vec2 uv = xy-ij;
		uv = uv*uv*(3.0-2.0*uv);
		

		float a = random(vec2(ij.x, ij.y ));
		float b = random(vec2(ij.x+1., ij.y));
		float c = random(vec2(ij.x, ij.y+1.));
		float d = random(vec2(ij.x+1., ij.y+1.));
		float k0 = a;
		float k1 = b-a;
		float k2 = c-a;
		float k3 = a-b-c+d;
		return (k0 + k1*uv.x + k2*uv.y + k3*uv.x*uv.y);
	}
	
	void main()
	{
		vec2 uv = gl_FragCoord.xy / max(iResolution.x, iResolution.y);
		vec2 lp = iMouse.xy / max(iResolution.x, iResolution.y);
					 lp = lp.x == 0.0 ? vec2(0.2, 0.15) : lp;

		if (lp.y <= 0.03) {
			float time = iTime;
			float color = pow(noiseStar(gl_FragCoord.xy), 40.0) * 20.0;
			float r1 = noiseStar(gl_FragCoord.xy*noiseStar(vec2(sin(time*0.01))));
			float r2 = noiseStar(gl_FragCoord.xy*noiseStar(vec2(cos(time*0.01), sin(time*0.01))));
			float r3 = noiseStar(gl_FragCoord.xy*noiseStar(vec2(sin(time*0.05), cos(time*0.05))));
			gl_FragColor = vec4(vec3(color*r1, color*r2, color*r3), 1.0);
		} else {
			vec3 color = vec3(0.0);
			color = calcAtmosphericScatter(uv, lp);
			color = jodieReinhardTonemap(color);
			
			gl_FragColor = vec4(pow(color, vec3(0.4545)), 1.0);
		}
	}
	`,
	vertexShader: `
			precision mediump float;
      precision mediump int;

      // uniform mat4 modelViewMatrix;
      // uniform mat4 projectionMatrix;

      // attribute vec3 position;
      varying vec3 vPosition;


      void main(){
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }
	`
}

export {Sky}
