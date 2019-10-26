import * as THREE from 'three'
import { AnaglyphEffect } from 'three/examples/jsm/effects/AnaglyphEffect'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import { getRandomStarField, autoResize, renderLoop } from './utils'
import bearModelName from './assets/bear.glb'

const container = document.createElement('div')
document.body.appendChild(container)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 100)
camera.position.x = 0.15
camera.position.y = 1.5
camera.position.z = 2
camera.focalLength = 3

const pointLight = new THREE.PointLight(0xffffff, 5)
pointLight.position.set(1, 1, 2)
scene.add(pointLight)

var skyBox = new THREE.BoxGeometry(120, 120, 120)
var textureCube = new THREE.MeshBasicMaterial({
  map: getRandomStarField(600, 2048, 2048),
  side: THREE.BackSide
})
var sky = new THREE.Mesh(skyBox, textureCube)
scene.add(sky)
scene.background = textureCube

const loader = new GLTFLoader()
loader.load(bearModelName, gltf => {
  scene.add(gltf.scene)
}, undefined, error => console.error(error))

const renderer = new THREE.WebGLRenderer()
renderer.setPixelRatio(window.devicePixelRatio)
container.appendChild(renderer.domElement)
const effect = new AnaglyphEffect(renderer)
effect.setSize(window.innerWidth || 2, window.innerHeight || 2)

autoResize(camera, effect)

let mouseX = camera.position.x
let mouseY = camera.position.y
document.addEventListener('mousemove', event => {
  mouseX = (event.clientX - (window.innerWidth / 2)) / 100
  mouseY = (event.clientY - (window.innerHeight / 2)) / 100
}, false)

renderLoop(() => {
  camera.position.x = mouseX
  camera.position.y = mouseY
  camera.lookAt(new THREE.Vector3(scene.position.x, scene.position.y + 1, scene.position.z))
  effect.render(scene, camera)
})
