import { THREE } from './orbit-controls'
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from 'three.meshline'

var container = document.getElementById('container')

var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
// var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 1000)
camera.position.set(50, 10, 0)
var frustumSize = 1000

var raycaster
raycaster = new THREE.Raycaster()
var mouse = new THREE.Vector2(); var INTERSECTED

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
    // opacity: 1,
    // resolution: resolution,
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
  console.log('curve', curve)

  // create lines
  var line = new Float32Array(600)
  for (var j = 0; j < 200 * 3; j += 3) {
    line[j] = -30 + 0.1 * j
    line[j + 1] = -30 + 0.1 * j
    line[j + 2] = -30 + 0.1 * j
    // line[j + 1] = 5 * Math.cos(0.01 * j)
    // line[j + 2] = -20
  }

  console.log('line', line)
  makeLine(curve, 0)

  // x, y, z coordinate
  // var line = new THREE.Geometry()
  // line.vertices.push(new THREE.Vector3(-30, -30, -30))
  // line.vertices.push(new THREE.Vector3(30, -30, -30))
  // makeLine(line, 3)

  // var line = new THREE.Geometry()
  // line.vertices.push(new THREE.Vector3(-30, -30, -30))
  // line.vertices.push(new THREE.Vector3(-30, 30, -30))
  // makeLine(line, 3)

  // var line = new THREE.Geometry()
  // line.vertices.push(new THREE.Vector3(-30, -30, -30))
  // line.vertices.push(new THREE.Vector3(-30, -30, 30))
  // makeLine(line, 3)
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
function onDocumentMouseMove (event) {
  event.preventDefault()

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
}

window.addEventListener('resize', onWindowResize)
document.addEventListener('mousemove', onDocumentMouseMove, false)

function render () {
  window.requestAnimationFrame(render)
  controls.update()
  animate()

  // find intersections
  // raycaster.setFromCamera(mouse, camera)
  // var intersects = raycaster.intersectObjects(scene.children[0].children)
  // if (intersects.length > 0) {
  //   INTERSECTED = intersects[0].object
  //   // console.log('find it', INTERSECTED)
  //   // INTERSECTED.material.opacity = 0.5
  //   // INTERSECTED.scale.x += 0.01
  //   // INTERSECTED.scale.y += 0.01
  //   // INTERSECTED.scale.z += 0.01
  //   // INTERSECTED.position.x += 0.1
  //   // INTERSECTED.position.y += 0.1
  //   // INTERSECTED.position.y += 0.0
  //   // INTERSECTED.position.y += 5 * Math.cos(0.01)
  //   // console.log('mouse', mouse)

  //   var line = new Float32Array(600)
  //   for (var j = 0; j < 200 * 3; j += 3) {
  //     line[j] = -30 + 0.1 * j
  //     line[j + 1] = (mouse.x + mouse.y) * 50 * Math.cos(0.01 * j)
  //     // line[j + 2] = -20
  //   }
  //   var g = new MeshLine()
  //   g.setGeometry(line)
  //   INTERSECTED.geometry = g
  // }

  renderer.render(scene, camera)
}

function animate () {
  // console.log('animte')
  // console.log('graph', graph)
  const myLine = graph.children[0]
  // console.log('myLine.material.uniforms', myLine.material.uniforms)
  // myLine.material.dashOffset.value -= 10
  // myLine.material.uniforms.dashOffset.value -= 10
  // myLine.material.uniforms.lineWidth.value += 1
  myLine.material.uniforms.dashOffset.value += 0.0001
}

// import '../styles/index.scss'
// import { Ball } from './ball'

// if (process.env.NODE_ENV === 'development') {
//   require('../index.html')
// }

// console.log('imported Ball', Ball)

// class App {
//   constructor () {
//     this.canvas = document.createElement('canvas')
//     this.ctx = this.canvas.getContext('2d')
//     document.body.appendChild(this.canvas)

//     window.addEventListener('resize', this.resize.bind(this), false)
//     this.resize()

//     this.ball = new Ball(60, 1)

//     window.requestAnimationFrame(this.animate.bind(this))
//   }

//   resize () {
//     this.stageWidth = document.body.clientWidth
//     this.stageHeight = document.body.clientHeight

//     this.canvas.width = this.stageWidth * 2
//     this.canvas.height = this.stageHeight * 2
//     this.ctx.scale(2, 2)
//   }

//   animate (t) {
//     this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight)
//     window.requestAnimationFrame(this.animate.bind(this))

//     this.ball.draw(this.ctx, this.stageWidth, this.stageHeight)
//   }
// }

// window.onload = () => {
//   new App()
// }
