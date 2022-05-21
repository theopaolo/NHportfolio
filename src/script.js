import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js'
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

let myImages = [
  '/sans+titre-2.jpg',
  '/sans+titre-1.jpg',
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
  '/sans+titre-31.jpg',
  '/sans+titre-32.jpg',
  '/sans+titre-33.jpg',
  '/sans+titre-34.jpg',
  '/sans+titre-35.jpg',
  '/sans+titre-36.jpg',
  '/sans+titre-37.jpg',
  '/sans+titre-38.jpg',
  '/sans+titre-39.jpg',
  '/sans+titre-41.jpg',
  '/sans+titre-42.jpg',
  '/sans+titre-43.jpg',
  '/sans+titre-44.jpg',
  '/sans+titre-45.jpg',
  '/sans+titre-46.jpg',
  '/sans+titre-47.jpg',
]

/**
 * Create Objects
 */
let planeGeometry = new THREE.PlaneGeometry(16, 9);
let phi = 0
let theta = 0
let goldNum = 1.618033988749895
let myVideos = document.querySelectorAll('.video')
let sphere = new THREE.SphereGeometry( 50, 32, 16 )

function fiboSphere(imgLght, iter, mesh, size) {
  theta = 2 * Math.PI * iter / goldNum
  phi = Math.acos(1-2 * (iter + 0.5)/imgLght)
  let positionSphere = new THREE.Spherical(size, phi, theta)

  mesh.position.setFromSpherical(positionSphere);
  mesh.lookAt(mesh.position.clone().setLength(3));

  scene.add(mesh);
}

function imgSphere(elArr){
  let imgLght = elArr.length
  let i = 0
  for(let image of elArr){
    // Load images as texture
    let imgText = textureLoader.load(image)
    imgText.generateMipmaps = false

    // Create planeMaterial and map images texture
    let planeMaterial = new THREE.MeshBasicMaterial({ map: imgText })
    planeMaterial.side = THREE.DoubleSide
    let planeMesh  = new THREE.Mesh(planeGeometry, planeMaterial);
    i += 1

    // Create sphere using finonacci
    fiboSphere(imgLght, i, planeMesh, 50)
  }
}

imgSphere(myImages)

function vidSphere(elArr){
  let y = 0
  let imgLght = elArr.length

  for(let vid of elArr){
    vid.play()
    let vidTexture = new THREE.VideoTexture(vid)
    console.log(vid);
    // Create planeMaterial and map images texture
    let planeMaterial = new THREE.MeshBasicMaterial({ map: vidTexture })
    planeMaterial.side = THREE.DoubleSide
    let planeMesh  = new THREE.Mesh(planeGeometry, planeMaterial);

    y += 1

    // Create sphere using finonacci
    fiboSphere(imgLght, y, planeMesh, 35)
  }
}

vidSphere(myVideos)


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
var fov = 45;
const camera = new THREE.PerspectiveCamera( fov, window.innerWidth / window.innerHeight, 0.05, 1000 );
camera.position.set(80,80,80); // Set position like this
scene.add(camera)

/**
 * Controls
 */
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true // le smooth des mouvements
// controls.dampingFactor = 0.05;
// controls.enablePan = false
// controls.enableZoom = true

// // controls.zoomSpeed = 1.2
// controls.maxDistance = 1000
// controls.update()

/**
 * TrackBall
 */
  const trackballcontrols = new TrackballControls(camera, canvas)

  trackballcontrols.staticMoving = false
  trackballcontrols.dynamicDampingFactor = 0.05;
  trackballcontrols.noPan = true
  trackballcontrols.rotateSpeed = 0.5;
  trackballcontrols.zoomSpeed = 0.5;

  trackballcontrols.maxDistance = 200
  trackballcontrols.minDistance = 0

  trackballcontrols.update()

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    // mesh.rotation.y += 0.001;
    // Update controls
    // controls.update()
    trackballcontrols.update()
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()