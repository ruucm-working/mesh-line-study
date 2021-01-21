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
  '#eddcd2',
  '#fff1e6'
  // '#f0efeb',
  // '#ddbea9',
  // '#a5a58d',
  // '#b7b7a4'
]

var resolution = new THREE.Vector2(window.innerWidth, window.innerHeight)
var graph = new THREE.Object3D()
var coordinate = new THREE.Object3D()
scene.add(graph)
scene.add(coordinate)

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

function makeSolidLine (geo, c) {
  var g = new MeshLine()
  g.setGeometry(geo)

  var material = new MeshLineMaterial({
    useMap: false,
    color: new THREE.Color(colors[c]),
    opacity: 1,
    resolution: resolution,
    sizeAttenuation: false,
    lineWidth: 10
  })
  var mesh = new THREE.Mesh(g.geometry, material)
  coordinate.add(mesh)
}

function makeCoordinates () {
  const line = new THREE.Geometry()
  line.vertices.push(new THREE.Vector3(-30, -30, -30))
  line.vertices.push(new THREE.Vector3(30, -30, -30))
  makeSolidLine(line, 0)

  const line2 = new THREE.Geometry()
  line2.vertices.push(new THREE.Vector3(-30, -30, -30))
  line2.vertices.push(new THREE.Vector3(-30, 30, -30))
  makeSolidLine(line2, 0)

  const line3 = new THREE.Geometry()
  line3.vertices.push(new THREE.Vector3(-30, -30, -30))
  line3.vertices.push(new THREE.Vector3(-30, -30, 30))
  makeSolidLine(line3, 0)
}

function init () {
  const pos = new THREE.Vector3(10 - Math.random() * 20, 10 - Math.random() * 20, 10 - Math.random() * 20)
  const points = new Array(30).fill().map(() => pos.add(new THREE.Vector3(4 - Math.random() * 8, 4 - Math.random() * 8, 2 - Math.random() * 4)).clone())
  const curve = new THREE.CatmullRomCurve3(points).getPoints(1000)

  // make coordinates
  makeCoordinates()

  // create lines
  var line = new Float32Array(600)
  for (var j = 0; j < 200 * 3; j += 3) {
    line[j] = -30 + 0.1 * j
    line[j + 1] = -30 + 0.1 * j
    line[j + 2] = -30 + 0.1 * j
  }

  for (let i = 0; i < colors.length; i++) {
    makeLine(curve, i)
  }
  console.log('graph.children', graph.children)
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
  for (let i = 0; i < colors.length; i++) {
    const myLine = graph.children[i]
    myLine.material.uniforms.dashOffset.value += 0.0001 * (i + 1)
  }
}
