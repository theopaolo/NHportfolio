import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
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

 //initial offset so does not start in middle.
 let imgtext = []

 function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

 for(let i = 0; i < imagesArrayUrl.length; i++){
    imgtext.push(textureLoader.load(imagesArrayUrl[i]))
    imgtext[i].generateMipmaps = false

    let geometry = new THREE.PlaneGeometry(16,9,10);
    let material = new THREE.MeshBasicMaterial({ map: imgtext[i] })
    let mesh  = new THREE.Mesh(geometry, material);
    let w = imgtext[i];
    console.log("mat w",w);

    material.side = THREE.DoubleSide

    mesh.rotation.x = (randomIntFromInterval(-0.2, 0.2));
    mesh.rotation.y = (randomIntFromInterval(-0.2, 0.2));
    mesh.position.x = ( Math.random() * 300 - 100 );
    mesh.position.y = ( Math.random() * 300 - 100 );
    mesh.position.z = ( Math.random() * 200 - 200);
    mesh.scale.x = Math.random() * 2 + 1;
    mesh.scale.y = Math.random() * 2 + 1;
    mesh.updateMatrixWorld()
 };

  const geometry = new THREE.SphereGeometry( 5, 8 , 8 );
  const material = new THREE.MeshBasicMaterial();
  material.transparent = true
  material.opacity = 0.0
  const sphere = new THREE.Mesh( geometry, material );

 function randomSpherePoint(radius) {
  //pick numbers between 0 and 1
  let u = Math.random();
  let v = Math.random();
  // create random spherical coordinate
  let theta = 2 * Math.PI * u;
  let phi = Math.acos(2 * v - 1);
  return new THREE.Spherical(radius + 0.1, phi, theta);
}

let planes = [];
let imgsW = []
let theta = 0 ;
let phi = 0;

for (let i = 0; i < imagesArrayUrl.length; i++) {
  imgtext.push(textureLoader.load(imagesArrayUrl[i], imgSize))
  imgtext[i].generateMipmaps = false

  function imgSize(tex){
    imgsW.push(tex.image.width)
  }

  let geometry = new THREE.PlaneGeometry(16,9,10);
  let material = new THREE.MeshBasicMaterial({ map: imgtext[i] })
  material.side = THREE.DoubleSide

  let plane  = new THREE.Mesh(geometry, material);
  let positionSphere = new THREE.Spherical(50, phi, theta)
  const pt = positionSphere;
  plane.position.setFromSpherical(pt);
  plane.lookAt(plane.position.clone().setLength(3));
  phi += Math.acos(2 * 0.5 - 1) + 2
  theta += (1 * Math.PI) + 2

  planes.push(plane);

  sphere.add(plane);
}

scene.add(sphere)
/**
 * Create videoTextures
 */
let video = document.getElementById( 'video' );
video.load()
video.play();

let vidtexture = new THREE.VideoTexture( video );
let vidGeo = new THREE.PlaneBufferGeometry( 16, 9, 10);
let materialVideo = new THREE.MeshBasicMaterial( { map: vidtexture , side: THREE.DoubleSide } );
let vidMesh = new THREE.Mesh( vidGeo, materialVideo);

let positionSphere = new THREE.Spherical(30, phi, theta)
const pt = positionSphere;
vidMesh.position.setFromSpherical(pt);
vidMesh.lookAt(vidMesh.position.clone().setLength(3));
phi += Math.acos(2 * 0.5 - 1) + 2
theta += (1 * Math.PI) + 2

scene.add( vidMesh );

/**
* Sphere
*/

// const sphereGeometry = new THREE.SphereGeometry(5, 32, 32);
// const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 })
// const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
// scene.add(sphereMesh);

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
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true // le smooth des mouvements
controls.dampingFactor = 0.05;
controls.panSpeed = 35
controls.enableZoom = true

// controls.zoomSpeed = 1.2
controls.maxDistance = 1000
controls.update()


/**
 * GUI
 */


/**
 * Fog
 */


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
    const elapsedTime = clock.getElapsedTime()

    sphere.rotation.y += 0.001;
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()