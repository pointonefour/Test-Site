// src/main.js
import * as THREE from 'three';
import {vertexShader, fragmentShader} from './backgroundShader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff88, wireframe: true });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const toggleBtnn = document.getElementById('toggleBtn');
toggleBtn.addEventListener('click', () => {
  cube.material.wireframe = !cube.material.wireframe;
});

const bgGeometry = new THREE.PlaneGeometry(2,2);
const bgMaterial= new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
        uTime: {value: 0.0},
        uColor1: {value: new THREE.Color(0x2a2a72)},
        uColor2: {value: new THREE.Color(0xff6b6b)}
    },
    depthWrite: false,
    depthTest: false,
    side: THREE.DoubleSide
});
const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
const bgScene = new THREE.Scene();
const bgCamera = new THREE.Camera(); // No perspective—just flat
bgScene.add(bgMesh);

// Animate
function animate(time) {
    requestAnimationFrame(animate);

    //update shader time
    bgMaterial.uniforms.uTime.value = time*0.001
    controls.update();

    //render bg first
    renderer.autoClear=false;
    renderer.clear();
    renderer.render(bgScene, bgCamera);
    renderer.render(scene, camera);
}
animate();

// Handle Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});