import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { TorusGeometry } from 'three';
const gsap = window.gsap;

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Overlay
 */
const overlayGeometry = new THREE.PlaneBufferGeometry(2, 2, 1, 1)
const overlayMaterial = new THREE.ShaderMaterial({
  transparent: true,
  uniforms:
  {
    uAlpha: { value: 1}
  },
  vertexShader: `
    void main()
    {
      gl_Position = vec4(position, 1.0);
    }
  `
  ,
  fragmentShader:
    `
      uniform float uAlpha;

      void main()
      {
        gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
      }
    `
})

const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
scene.add(overlay)

/**
 * Loader
 */
const loadingBarElement = document.querySelector('.loading-bar')

/**
 * Texture
 */
const loadingManager = new THREE.LoadingManager(
  // Loaded
  () =>
  {
    gsap.delayedCall(0.5,()=>{
      gsap.to(overlayMaterial.uniforms.uAlpha,{duration:3, value: 0})
      loadingBarElement.classList.add('ended')
      loadingBarElement.style.transform = ''
    })
  },
  //Progress
  (itemUrl, itemsLoaded, itemsTotal) =>
  {
    const progressRatio = itemsLoaded / itemsTotal;
    loadingBarElement.style.transform = `scaleX( ${progressRatio} )`
  }
)
const textureLoader = new THREE.TextureLoader(loadingManager)

function gcd (a, b) {
  return (b == 0) ? a : gcd (b, a%b);
}
var w = screen.width;
var h = screen.height;
var r = gcd (w,h);
// console.log(r, 'aspect :', w/r,":",h/r, "dimension :", w, h);

let imagesArrayUrl = [
  '/sans+titre-1.jpg',
  '/sans+titre-2.jpg',
  '/sans+titre-3.jpg',
  '/sans+titre-4.jpg',
  '/sans+titre-5.jpg',
  '/sans+titre-6.jpg',
  '/sans+titre-7.jpg',
  '/sans+titre-8.jpg',
  '/sans+titre-9.jpg',
  '/sans+titre-10.jpg',
  '/sans+titre-11.jpg',
  '/sans+titre-12.jpg',
  '/sans+titre-13.jpg',
  '/sans+titre-14.jpg',
  '/sans+titre-15.jpg',
  '/sans+titre-16.jpg',
  '/sans+titre-17.jpg',
  '/sans+titre-19.jpg',
  '/sans+titre-20.jpg',
  '/sans+titre-21.jpg',
  '/sans+titre-22.jpg',
  '/sans+titre-24.jpg',
  '/sans+titre-25.jpg',
  '/sans+titre-26.jpg',
  '/sans+titre-27.jpg',
  '/sans+titre-28.jpg',
  '/sans+titre-29.jpg',
  '/sans+titre-30.jpg',
]

/**
 * Create Objects
 */
 let xDistance = 2;
 let yDistance = 5;
 let zDistance = -5;
 //initial offset so does not start in middle.
 let xOffset = -10;
 let imgtext = []

 function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

 for(let i = 0; i < imagesArrayUrl.length; i++){
    // console.log(imagesArrayUrl[i])
    imgtext.push(textureLoader.load(imagesArrayUrl[i]))
    imgtext[i].generateMipmaps = false

    let geometry = new THREE.PlaneGeometry(16,9,10);
    let material = new THREE.MeshBasicMaterial({ map: imgtext[i] })
    //  let material = new THREE.MeshPhongMaterial({ map: imgtext[i] })
    let mesh  = new THREE.Mesh(geometry, material);
    let w = imgtext[i];
    console.log("mat w",w);

    material.side = THREE.DoubleSide
    // mesh.position.x = (xDistance * randomIntFromInterval(1, 2) * i) + xOffset;
    // mesh.position.z = (zDistance * randomIntFromInterval(1, 2) * i);
    // mesh.position.y = (yDistance * randomIntFromInterval(1, 2) * i);

    // mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 5 + 1;
    mesh.rotation.x = (randomIntFromInterval(-0.2, 0.2));
    mesh.rotation.y = (randomIntFromInterval(-0.2, 0.2));
    mesh.position.x = ( Math.random() * 300 - 100 );
    // console.log('posx', mesh.position.x);

    mesh.position.y = ( Math.random() * 300 - 100 );
    // console.log('posy', mesh.position.y);
    mesh.position.z = ( Math.random() * 200 - 200);

    // console.log('posz', mesh.position.z);

    // mesh.rotation.x = Math.random() * 0.5 * Math.PI;
    // mesh.rotation.y = Math.random() * 0.5 * Math.PI;
    // mesh.rotation.z = Math.random() * 2 * Math.PI;
    mesh.scale.x = Math.random() * 2 + 1;
    mesh.scale.y = Math.random() * 2 + 1;
    // mesh.scale.z = Math.random() * 2 + 1;
    mesh.updateMatrixWorld()
    scene.add(mesh);
 };

  // scene.add( new THREE.AmbientLight( 0xf40000, 1 ) );
  // const directionalLight = new THREE.DirectionalLight( 0x00FF00, 0.5 );
  // scene.add( directionalLight );
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Update EffectComposer
    effectComposer.setSize(sizes.width, sizes.height)
    effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


/**
 * Camera
 */
// Base camera
// const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 1, 3000)
// camera.position.z = 20
var fov = 45;
const camera = new THREE.PerspectiveCamera( fov, window.innerWidth / window.innerHeight, 0.05, 1000 );
camera.position.set(5,5,5); // Set position like this
camera.lookAt(new THREE.Vector3(0,0,0)); // Set look at coordinate like this
scene.add(camera)


// const helper = new THREE.CameraHelper( camera );
// scene.add( helper );
/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true // le smooth des mouvements
controls.dampingFactor = 0.05;
// controls.target = new THREE.Vector3(0,0, -800); // pour zoomer plus loins
controls.panSpeed = 35
controls.enableZoom = true

// controls.zoomSpeed = 1.2
controls.maxDistance = 1000
controls.update()


/**
 * GUI
 */
 const gui = new dat.GUI()

 const debugObject = {
  fogColor: 0x000000,
  fogNear: 40,
  fogFar: 100,
 }

 gui
  .add(camera.position, 'z')
  .min(-800)
  .max(800)
  .step(1)
  .name('camera z')

 gui
   .addColor(debugObject, 'fogColor')
   .onChange(()=>{
    scene.fog.color.set(debugObject.fogColor);
   })

 gui
   .add(debugObject, 'fogNear')
   .min(40)
   .max(100)
   .listen()
   .name('fogNear')
   .onChange(()=>{
    scene.fog.near = debugObject.fogNear;
  })

gui
   .add(debugObject, 'fogFar')
   .min(50)
   .max(1000)
   .listen()
   .name('fogFar')
   .onChange(()=>{
    scene.fog.far = debugObject.fogFar;
  })

/**
 * Fog
 */
let fogcolor = 0x616161;
let fogNear = 0.005;
let fogFar = 300;
// let fogDensity = 0.04;
// scene.fog = new THREE.FogExp2(fogcolor, fogDensity);
scene.fog = new THREE.Fog(fogcolor, fogNear,fogFar);


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * PostProcess
 */
const effectComposer = new EffectComposer( renderer );
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
effectComposer.setSize(sizes.width, sizes.height)

const renderPass = new RenderPass(scene, camera)
effectComposer.addPass(renderPass)

const dotScreenPass = new DotScreenPass()
dotScreenPass.enabled = false
effectComposer.addPass(dotScreenPass)

const glitchPass = new GlitchPass()
glitchPass.enabled = false
effectComposer.addPass(glitchPass)

const RGBShiftPath = new ShaderPass(RGBShiftShader)
RGBShiftPath.enabled = false
effectComposer.addPass(RGBShiftPath)

const GammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
effectComposer.addPass(GammaCorrectionPass)

// const unrealBloomPass = new UnrealBloomPass()
// effectComposer.addPass(unrealBloomPass)
// unrealBloomPass.strength = 0.3
// unrealBloomPass.radius = 0.8
// unrealBloomPass.threshold = 0.6
// unrealBloomPass.enable = false
// gui.add(unrealBloomPass, 'enabled').name('bloom')
// gui.add(unrealBloomPass, 'strength').min(0).max(2).step(0.001).name('bloom strength')
// gui.add(unrealBloomPass, 'radius').min(0).max(2).step(0.001).name('bloom radius')
// gui.add(unrealBloomPass, 'threshold').min(0).max(1).step(0.001).name('bloom threshold')

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()
    // Update camera
    // camera.position.x = Math.sin(cursor.x * Math.Pi * 2 )
    // camera.position.z = Math.cos(cursor.x * Math.Pi * 2 )
    // camera.position.y = cursor.y
    // camera.lookAt(new THREE.Vector3())

    // Render
    // renderer.render(scene, camera)
    effectComposer.render()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()