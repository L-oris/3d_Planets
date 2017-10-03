//global variables
let textMesh;

//create new scene
const scene = new THREE.Scene()

//add camera and set its position
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200)
camera.position.z = 50

//add light to scene
const light = new THREE.AmbientLight( 0xFFFFFF )
scene.add(light)


//create planets mesh
function createPlanet(size,pathToTexture){
  const geometry = new THREE.SphereGeometry(size, 32, 32)
  const material = new THREE.MeshPhongMaterial()
  material.map = new THREE.TextureLoader().load(pathToTexture)
  return new THREE.Mesh( geometry, material )
}

// == EARTH ==
const earthMesh = createPlanet(12,'./assets/earthmap4k.jpg')
scene.add( earthMesh )
// == MOON ==
const moonMesh = createPlanet(4,'./assets/moonmap4k.jpg')
//make moon rotating around center point
moonMesh.position.x = -25
const pivot = new THREE.Object3D()
pivot.add(moonMesh);
scene.add(pivot);
// == MARS ==
const marsMesh = createPlanet(20,'./assets/marsmap1k.jpg')
marsMesh.position.set(40, 55, -100)
scene.add( marsMesh )


//create text mesh
const fontLoader = new THREE.FontLoader()
fontLoader.load('./assets/fonts/helvetiker_regular.typeface.json', function(font){
	const textGeometry = new THREE.TextGeometry( 'Loris!', {
		font: font,
		size: 18,
		height: 5,
		curveSegments: 12,
		bevelEnabled: false,
	});
  textGeometry.center()
  const textMaterial = new THREE.MeshBasicMaterial({color: 0x8a782})
  textMesh = new THREE.Mesh(textGeometry,textMaterial)
  textMesh.position.set(0, -50, -60)
  scene.add(textMesh)
})



//add skybox background
const imagePrefix = "./assets/"
const urls = [ 'space.jpg', 'space.jpg', 'space.jpg', 'space.jpg', 'space.jpg', 'space.jpg' ]
const skyBox = new THREE.CubeTextureLoader().setPath(imagePrefix).load(urls)
scene.background = skyBox

//create and set size of renderer
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)

//allow user to move the camera
const orbit = new THREE.OrbitControls(camera, renderer.domElement)
orbit.enableZoom = false


//add controls to allow user customizing scene's parameters
const controls = new function(){
  this.guiEarthRotationX = 0.005
  this.guiEarthRotationY = 0.005
  this.guiMoonRotationX = 0
  this.guiMoonRotationY = 0.01
  this.guiTextColor = 0x8a782
}
const gui = new dat.GUI()
gui.add(controls, 'guiEarthRotationX', 0, .2)
gui.add(controls, 'guiEarthRotationY', 0, .2)
gui.add(controls, 'guiMoonRotationX', 0, .2)
gui.add(controls, 'guiMoonRotationY', 0, .2)
gui.addColor(controls, 'guiTextColor').onChange(function(e){
  textMesh.material.color = new THREE.Color(e)
})

//render
const render = function() {
  requestAnimationFrame(render)
  //make earth rotating
  earthMesh.rotation.x += controls.guiEarthRotationX
  earthMesh.rotation.y += controls.guiEarthRotationY
  // make moon rotating around earth
  pivot.rotation.x += controls.guiMoonRotationX
  pivot.rotation.y += controls.guiMoonRotationY

  renderer.render(scene, camera)
}
render()

//append whole thing to DOM
document.body.appendChild(renderer.domElement)
