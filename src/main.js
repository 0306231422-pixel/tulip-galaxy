import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// ================= SCENE =================
const scene = new THREE.Scene()

// gradient background
const canvas = document.createElement('canvas')
canvas.width = 512
canvas.height = 512
const ctx = canvas.getContext('2d')

const gradient = ctx.createRadialGradient(256,256,50,256,256,256)
gradient.addColorStop(0, "#0a0a2a")
gradient.addColorStop(1, "#000005")

ctx.fillStyle = gradient
ctx.fillRect(0,0,512,512)

scene.background = new THREE.CanvasTexture(canvas)

// ================= CAMERA =================
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
camera.position.set(0,2,8)

// ================= RENDER =================
const renderer = new THREE.WebGLRenderer({ antialias:true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// ================= CONTROL =================
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// ================= LIGHT =================
scene.add(new THREE.AmbientLight(0xffffff, 0.6))

// ================= 🌷 TULIP =================
// ================= 🌷 TULIP REALISTIC (POINTS) =================
const tulipGroup = new THREE.Group()

function createTulipPetal(angleOffset = 0) {
  const geo = new THREE.BufferGeometry()
  const count = 4000

  const pos = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const t = Math.random() // chiều cao
    const theta = Math.random() * Math.PI * 2

    // 🌷 form tulip chuẩn (giọt nước bóp + mở đầu)
    const radius =
      0.3 +
      0.25 * Math.sin(Math.PI * t) * // phình giữa
      (1 - t * 0.7)                 // thu nhỏ lên đỉnh

    const x = radius * Math.cos(theta)
    const z = radius * Math.sin(theta)
    const y = t * 1.5

    // xoay tạo cánh
    const cos = Math.cos(angleOffset)
    const sin = Math.sin(angleOffset)

    pos[i*3]   = x * cos - z * sin
    pos[i*3+1] = y
    pos[i*3+2] = x * sin + z * cos

    // màu gradient hồng
    colors[i*3]   = 1
    colors[i*3+1] = 0.4 + Math.random()*0.2
    colors[i*3+2] = 0.6 + t * 0.2
  }

  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const mat = new THREE.PointsMaterial({
    size: 0.025,
    vertexColors: true
  })

  return new THREE.Points(geo, mat)
}

// 🌷 3 cánh hoa ôm lại
tulipGroup.add(createTulipPetal(0))
tulipGroup.add(createTulipPetal(0.8))
tulipGroup.add(createTulipPetal(-0.8))

scene.add(tulipGroup)


// ================= 🌿 STEM (POINTS) =================
function createStem() {
  const geo = new THREE.BufferGeometry()
  const count = 2000
  const pos = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const y = -2 + Math.random() * 2
    const angle = Math.random() * Math.PI * 2
    const r = 0.03

    pos[i*3] = r * Math.cos(angle)
    pos[i*3+1] = y
    pos[i*3+2] = r * Math.sin(angle)

    // màu xanh gradient
    colors[i*3] = 0.2
    colors[i*3+1] = 0.8 + Math.random()*0.2
    colors[i*3+2] = 0.3
  }

  geo.setAttribute('position', new THREE.BufferAttribute(pos,3))
  geo.setAttribute('color', new THREE.BufferAttribute(colors,3))

  const mat = new THREE.PointsMaterial({
    size: 0.02,
    vertexColors: true
  })

  return new THREE.Points(geo, mat)
}

const stem = createStem()
scene.add(stem)


// ================= 🍃 LEAF (POINTS) =================
function createLeaf(side = 1) {
  const geo = new THREE.BufferGeometry()
  const count = 2000
  const pos = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const t = Math.random()
    const width = 0.5 * (1 - t)

    const x = side * width * Math.sin(t * Math.PI)
    const y = -1 + t * 1.5
    const z = 0.2 * Math.cos(t * Math.PI)

    pos[i*3] = x
    pos[i*3+1] = y
    pos[i*3+2] = z

    colors[i*3] = 0.2
    colors[i*3+1] = 0.9
    colors[i*3+2] = 0.3
  }

  geo.setAttribute('position', new THREE.BufferAttribute(pos,3))
  geo.setAttribute('color', new THREE.BufferAttribute(colors,3))

  const mat = new THREE.PointsMaterial({
    size: 0.025,
    vertexColors: true
  })

  return new THREE.Points(geo, mat)
}

scene.add(createLeaf(1))
scene.add(createLeaf(-1))

// ================= 🌌 STARS =================
const starGeo = new THREE.BufferGeometry()
const starCount = 20000
const starPos = new Float32Array(starCount * 3)

for (let i = 0; i < starCount; i++) {
  const r = Math.random() * 80
  const theta = Math.random() * Math.PI * 2
  const phi = Math.acos(Math.random() * 2 - 1)

  starPos[i*3] = r * Math.sin(phi) * Math.cos(theta)
  starPos[i*3+1] = r * Math.sin(phi) * Math.sin(theta)
  starPos[i*3+2] = r * Math.cos(phi)
}

starGeo.setAttribute('position', new THREE.BufferAttribute(starPos,3))

const starTex = new THREE.TextureLoader().load(
  'https://threejs.org/examples/textures/sprites/circle.png'
)

const starMat = new THREE.PointsMaterial({
  size: 0.05,
  map: starTex,
  transparent: true,
  color: 0xffffff,
  depthWrite: false
})

const stars = new THREE.Points(starGeo, starMat)
scene.add(stars)


// ================= ☄️ METEOR SYSTEM (WIDE SPACE + SMALL) =================
const meteors = []

// hướng bay cố định (cùng chiều)
const METEOR_DIRECTION = new THREE.Vector3(1, -0.3, 0.2).normalize()

function randomSpawnPosition() {
  const radius = 120 // 🌌 phủ toàn thiên hà
  const theta = Math.random() * Math.PI * 2
  const phi = Math.acos(Math.random() * 2 - 1)

  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.sin(phi) * Math.sin(theta),
    radius * Math.cos(phi)
  )
}

function createMeteor() {
  const len = 60
  const positions = new Float32Array(len * 3)
  const sizes = new Float32Array(len)

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  const texture = new THREE.TextureLoader().load(
    'https://threejs.org/examples/textures/sprites/circle.png'
  )

  const mat = new THREE.ShaderMaterial({
    uniforms: {
      pointTexture: { value: texture },
      color: { value: new THREE.Color().setHSL(Math.random(), 1, 0.7) }
    },
    vertexShader: `
      attribute float size;
      varying float vAlpha;
      void main() {
        vAlpha = size;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (200.0 / -mvPosition.z); // 🔻 nhỏ lại
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform sampler2D pointTexture;
      uniform vec3 color;
      varying float vAlpha;
      void main() {
        vec4 tex = texture2D(pointTexture, gl_PointCoord);
        gl_FragColor = vec4(color, tex.a * vAlpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  const trail = new THREE.Points(geo, mat)

  const meteor = {
    pos: randomSpawnPosition(), // 🌌 spawn toàn không gian
    speed: 0.06 + Math.random()*0.03,
    data: positions,
    sizes,
    geo
  }

  scene.add(trail)
  meteors.push({ meteor, trail })
}

// tạo sẵn nhiều sao băng
for (let i = 0; i < 20; i++) {
  createMeteor()
}


// ================= ANIMATE =================
function animate(time){
  requestAnimationFrame(animate)

  controls.update()
  tulipGroup.rotation.y += 0.002

  starMat.opacity = 0.8 + Math.sin(time * 0.001) * 0.1

  meteors.forEach(obj=>{
  const m = obj.meteor
  const p = m.data
  const s = m.sizes

  // bay cùng 1 hướng
  m.pos.addScaledVector(METEOR_DIRECTION, m.speed)

  // nếu đi quá xa → spawn lại random
  if (m.pos.length() > 140) {
    m.pos.copy(randomSpawnPosition())
  }

  // trail
  for (let i = p.length/3 - 1; i > 0; i--) {
    p[i*3] = p[(i-1)*3]
    p[i*3+1] = p[(i-1)*3+1]
    p[i*3+2] = p[(i-1)*3+2]
  }

  p[0] = m.pos.x
  p[1] = m.pos.y
  p[2] = m.pos.z

  // 💧 giọt nước (nhỏ hơn)
  for (let i = 0; i < s.length; i++) {
    const t = i / s.length
    s[i] = (1 - t) * 0.8  // 🔻 nhỏ lại rõ rệt
  }

  obj.meteor.geo.attributes.position.needsUpdate = true
  obj.meteor.geo.attributes.size.needsUpdate = true
})


  renderer.render(scene, camera)
}

animate()