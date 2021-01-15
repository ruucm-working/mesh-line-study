import { THREE } from './orbit-controls'
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from 'three.meshline'

var container = document.getElementById('container')

var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(50, 10, 0)
var frustumSize = 1000

var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
container.appendChild(renderer.domElement)

var controls = new THREE.OrbitControls(camera, renderer.domElement)

var colors = [
  0xed6a5a,
  0xf4f1bb,
  0x9bc1bc,
  0x5ca4a9,
  0xe6ebe0,
  0xf0b67f,
  0xfe5f55,
  0xd6d1b1,
  0xc7efcf,
  0xeef5db,
  0x50514f,
  0xf25f5c,
  0xffe066,
  0x247ba0,
  0x70c1b3
]

var resolution = new THREE.Vector2(window.innerWidth, window.innerHeight)
var graph = new THREE.Object3D()
scene.add(graph)

init()
render()

function makeLine (geo, c) {
  var g = new MeshLine()
  g.setGeometry(geo)

  var material = new MeshLineMaterial({
    useMap: false,
    resolution,
    sizeAttenuation: false,
    transparent: true,
    depthTest: false,
    lineWidth: 25,
    color: new THREE.Color(colors[c]),
    dashArray: 0.1,
    dashRatio: 0.9

  })
  var mesh = new THREE.Mesh(g.geometry, material)
  mesh.raycast = MeshLineRaycast
  graph.add(mesh)
}

function init () {
  const pos = new THREE.Vector3(10 - Math.random() * 20, 10 - Math.random() * 20, 10 - Math.random() * 20)
  const points = new Array(30).fill().map(() => pos.add(new THREE.Vector3(4 - Math.random() * 8, 4 - Math.random() * 8, 2 - Math.random() * 4)).clone())
  const curve = new THREE.CatmullRomCurve3(points).getPoints(1000)

  // create lines
  var line = new Float32Array(600)
  for (var j = 0; j < 200 * 3; j += 3) {
    line[j] = -30 + 0.1 * j
    line[j + 1] = -30 + 0.1 * j
    line[j + 2] = -30 + 0.1 * j
  }

  makeLine(curve, 0)
}

onWindowResize()

function onWindowResize () {
  var w = container.clientWidth
  var h = container.clientHeight

  var aspect = w / h

  camera.left = -frustumSize * aspect / 2
  camera.right = frustumSize * aspect / 2
  camera.top = frustumSize / 2
  camera.bottom = -frustumSize / 2

  camera.updateProjectionMatrix()

  renderer.setSize(w, h)

  resolution.set(w, h)
}

window.addEventListener('resize', onWindowResize)

function render () {
  window.requestAnimationFrame(render)
  controls.update()
  animate()

  renderer.render(scene, camera)
}

function animate () {
  const myLine = graph.children[0]
  myLine.material.uniforms.dashOffset.value += 0.0001
}
