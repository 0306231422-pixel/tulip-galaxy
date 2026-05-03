import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// ================= SCENE =================
const scene = new THREE.Scene()

// 🌟 GROUP TỔNG (QUAN TRỌNG)
const flowerGroup = new THREE.Group()
scene.add(flowerGroup)

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
const tulipGroup = new THREE.Group()

function createTulipPetal(angleOffset = 0, open = 0.6) {
  const geo = new THREE.BufferGeometry()
  const count = 5000

  const pos = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const t = Math.random()

    const width = Math.sin(Math.PI * t) * (1 - t * 0.4)
    const u = (Math.random() - 0.5) * width

    const y = t * 1.7

    const base = 0.2 + 0.35 * Math.sin(Math.PI * t) * (1 - t * 0.6)
    const bend = Math.pow(t, 1.5) * (0.6 * open)
    const closeTop = Math.pow(t, 3) * 0.4

    const z = base + bend - closeTop
    const x = u * 1.3

    const edge = Math.sin(u * 10) * 1 * t

    const cos = Math.cos(angleOffset)
    const sin = Math.sin(angleOffset)

    const finalX = (x + edge) * cos - z * sin
    const finalZ = (x + edge) * sin + z * cos

    pos[i*3]   = finalX
    pos[i*3+1] = y
    pos[i*3+2] = finalZ

    const shade = 0.5 + t * 0.5

    colors[i*3]   = 1
    colors[i*3+1] = 0.35 + 0.35 * shade
    colors[i*3+2] = 0.6 + 0.25 * shade
  }

  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const mat = new THREE.PointsMaterial({
    size: 0.02,
    vertexColors: true,
    transparent: true,
    opacity: 0.95
  })

  return new THREE.Points(geo, mat)
}

// 🌷 petals
tulipGroup.add(createTulipPetal(0, 0.4))
tulipGroup.add(createTulipPetal(2.1, 0.4))
tulipGroup.add(createTulipPetal(-2.1, 0.4))
tulipGroup.add(createTulipPetal(1.0, 0.7))
tulipGroup.add(createTulipPetal(-1.0, 0.7))
tulipGroup.add(createTulipPetal(Math.PI, 0.7))

// 👉 add vào group tổng
flowerGroup.add(tulipGroup)


// ================= 🌿 STEM =================
function createStem() {
  const geo = new THREE.BufferGeometry()
  const count = 4000

  const pos = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const t = Math.random()
    const y = -2 + t * 2

    const radius =
      0.1 * (1 - t) +
      0.015 * Math.sin(t * 100) +
      Math.random() * 0.005

    const angle = Math.random() * Math.PI * 2

    let x = radius * Math.cos(angle)
    let z = radius * Math.sin(angle)

    const bendX = Math.sin(t * Math.PI) * 0.14
    const bendZ = Math.sin(t * Math.PI * 0.5) * 0.1

    x += bendX
    z += bendZ

    x += (Math.random() - 0.5) * 0.1
    z += (Math.random() - 0.5) * 0.1

    pos[i*3]   = x
    pos[i*3+1] = y
    pos[i*3+2] = z

    colors[i*3]   = 0.2
    colors[i*3+1] = 0.6 + 0.4 * (1 - t)
    colors[i*3+2] = 0.3
  }

  geo.setAttribute('position', new THREE.BufferAttribute(pos,3))
  geo.setAttribute('color', new THREE.BufferAttribute(colors,3))

  const mat = new THREE.PointsMaterial({
    size: 0.022,
    vertexColors: true,
    transparent: true,
    opacity: 0.95
  })

  return new THREE.Points(geo, mat)
}

const stem = createStem()
flowerGroup.add(stem)


// ================= 🍃 LEAF =================
function createLeaf(side = 1) {
  const geo = new THREE.BufferGeometry()
  const count = 3000

  const pos = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)

  const attachT = 0.5

  for (let i = 0; i < count; i++) {
    const t = Math.random()
    const w = (Math.random() - 0.5)

    const length = 1.2
    const width = 0.8 * Math.sin(Math.PI * t)

    let x = side * width * w
    let y = -2 + attachT * 2 + t * length
    let z = 0

    const stemT = attachT + t * 0.3

    x += Math.sin(stemT * Math.PI) * 0.2
    z += Math.sin(stemT * Math.PI * 0.5) * 0.1

    x += side * Math.pow(t, 1) * 1.5
    z -= Math.pow(t, 1.5) * 0.2

    const twist = 0.5 * t
    const cosT = Math.cos(twist)
    const sinT = Math.sin(twist)

    const xTwist = x * cosT - z * sinT
    const zTwist = x * sinT + z * cosT

    const noise = Math.sin(w * 10) * 0.02 * t

    pos[i*3]   = xTwist + noise
    pos[i*3+1] = y
    pos[i*3+2] = zTwist

    const shade = 0.6 + 0.4 * t

    colors[i*3]   = 0.2
    colors[i*3+1] = 0.7 + 0.3 * shade
    colors[i*3+2] = 0.3
  }

  geo.setAttribute('position', new THREE.BufferAttribute(pos,3))
  geo.setAttribute('color', new THREE.BufferAttribute(colors,3))

  const mat = new THREE.PointsMaterial({
    size: 0.022,
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    depthWrite: false
  })

  return new THREE.Points(geo, mat)
}

const leaf1 = createLeaf(1)
const leaf2 = createLeaf(-1.2)

leaf1.rotation.y = 0.3
leaf2.rotation.y = -0.3

flowerGroup.add(leaf1)
flowerGroup.add(leaf2)


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


// ================= ☄️ METEOR =================
const meteors = []
const METEOR_DIRECTION = new THREE.Vector3(1, -0.3, 0.2).normalize()

function randomSpawnPosition() {
  const radius = 120
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
        gl_PointSize = size * (200.0 / -mvPosition.z);
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
    pos: randomSpawnPosition(),
    speed: 0.06 + Math.random()*0.03,
    data: positions,
    sizes,
    geo
  }

  scene.add(trail)
  meteors.push({ meteor, trail })
}

for (let i = 0; i < 20; i++) createMeteor()

// ================= ✨ FLOWER EFFECT (SAFE) =================
function createFlowerEffect() {

  const group = new THREE.Group()

 // 🌟 glow bao phủ toàn bộ hoa (sphere)
const glowGeo = new THREE.BufferGeometry()
const glowCount = 4000
const glowPos = new Float32Array(glowCount * 3)

for (let i = 0; i < glowCount; i++) {

  // random sphere
  const r = 1.5 + Math.random() * 0.8
  const theta = Math.random() * Math.PI * 2
  const phi = Math.acos(Math.random() * 2 - 1)

  glowPos[i*3]   = r * Math.sin(phi) * Math.cos(theta)
  glowPos[i*3+1] = r * Math.cos(phi) + 0.8   // 🔥 dịch lên theo chiều cao hoa
  glowPos[i*3+2] = r * Math.sin(phi) * Math.sin(theta)
}

glowGeo.setAttribute('position', new THREE.BufferAttribute(glowPos, 3))

  glowGeo.setAttribute('position', new THREE.BufferAttribute(glowPos, 3))

  const glowMat = new THREE.PointsMaterial({
    size: 0.025,
    color: 0xff99cc,
    transparent: true,
    opacity: 0.25,          // 🔥 thấp để không che nền
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  const glow = new THREE.Points(glowGeo, glowMat)
  group.add(glow)

  // 🌸 hạt bay nhẹ quanh hoa
  const particleGeo = new THREE.BufferGeometry()
  const count = 800
  const pos = new Float32Array(count * 3)
  const velocity = []

  for (let i = 0; i < count; i++) {

    const angle = Math.random() * Math.PI * 2
    const radius = 0.5 + Math.random() * 0.8

    pos[i*3]   = Math.cos(angle) * radius
    pos[i*3+1] = Math.random() * 2
    pos[i*3+2] = Math.sin(angle) * radius

    velocity.push({
      x: (Math.random()-0.5)*0.002,
      y: 0.002 + Math.random()*0.003,
      z: (Math.random()-0.5)*0.002
    })
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))

  const particleMat = new THREE.PointsMaterial({
    size: 0.02,
    color: 0xffffff,
    transparent: true,
    opacity: 0.6,
    depthWrite: false
  })

  const particles = new THREE.Points(particleGeo, particleMat)
  group.add(particles)

  return { group, particles, velocity }
}

const flowerEffect = createFlowerEffect()
flowerGroup.add(flowerEffect.group)

// ================= ANIMATE =================
function animate(time){
  requestAnimationFrame(animate)

  controls.update()

  // 🌟 XOAY TOÀN BỘ CÂY
  flowerGroup.rotation.y += 0.002

  // 🌬️ đung đưa nhẹ
  flowerGroup.rotation.x = Math.sin(time * 0.0005) * 0.05

  // ✨ update particle bay
const pos = flowerEffect.particles.geometry.attributes.position.array

for (let i = 0; i < flowerEffect.velocity.length; i++) {

  pos[i*3]   += flowerEffect.velocity[i].x
  pos[i*3+1] += flowerEffect.velocity[i].y
  pos[i*3+2] += flowerEffect.velocity[i].z

  // reset khi bay quá cao
  if (pos[i*3+1] > 2.5) {
    pos[i*3] = (Math.random()-0.5) * 1.5
    pos[i*3+1] = 0
    pos[i*3+2] = (Math.random()-0.5) * 1.5
  }
}

flowerEffect.particles.geometry.attributes.position.needsUpdate = true

// 🌟 glow pulse nhẹ
flowerEffect.group.children[0].material.opacity =
  0.2 + Math.sin(time * 0.002) * 0.1

  starMat.opacity = 0.8 + Math.sin(time * 0.001) * 0.1

  meteors.forEach(obj=>{
    const m = obj.meteor
    const p = m.data
    const s = m.sizes

    m.pos.addScaledVector(METEOR_DIRECTION, m.speed)

    if (m.pos.length() > 140) {
      m.pos.copy(randomSpawnPosition())
    }

    for (let i = p.length/3 - 1; i > 0; i--) {
      p[i*3] = p[(i-1)*3]
      p[i*3+1] = p[(i-1)*3+1]
      p[i*3+2] = p[(i-1)*3+2]
    }

    p[0] = m.pos.x
    p[1] = m.pos.y
    p[2] = m.pos.z

    for (let i = 0; i < s.length; i++) {
      const t = i / s.length
      s[i] = (1 - t) * 0.8
    }

    obj.meteor.geo.attributes.position.needsUpdate = true
    obj.meteor.geo.attributes.size.needsUpdate = true
  })

  renderer.render(scene, camera)
}

animate()