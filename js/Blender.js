import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'

const scenePath = 'assets/blender/skull.gltf'
const BarSize = 400;

// Load 3D Scene
var scene = new THREE.Scene();

// Load Camera Perspektive
var camera = new THREE.PerspectiveCamera( 25, (window.innerWidth - BarSize) / window.innerHeight, 1, 20000 );
camera.position.set( 1, 1, 20 );

// Load a Renderer
var renderer = new THREE.WebGLRenderer({ canvas:document.querySelector("#background"),alpha: false });
renderer.setClearColor( 0xC5C5C3 );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize(window.innerWidth - BarSize, window.innerHeight);
document.body.appendChild(renderer.domElement);
var controls = new OrbitControls(camera, renderer.domElement);

function putTHingsInside(file) {
// Load Light
var ambientLight = new THREE.AmbientLight(0xcccccc);
scene.add(ambientLight);
var directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(0, 1, 1).normalize();
scene.add(directionalLight);
console.log(file)
// glTf 2.0 Loader
    var loader = new GLTFLoader();
    loader.load(file, function (gltf) {
        var object = gltf.scene;
        gltf.scene.scale.set(2, 2, 2);
        gltf.scene.position.x = 0;				    //Position (x = right+ left-)
        gltf.scene.position.y = 0;				    //Position (y = up+, down-)
        gltf.scene.position.z = 0;				    //Position (z = front +, back-)

        scene.add(gltf.scene);
    });
    render();
    animate();
}

function animate() {
    render();
    requestAnimationFrame( animate );
}

function render() {
    renderer.render( scene, camera );
}
function get_files(){
    var files = []
    $.ajax({
        type: "GET",
        url: "get_files.php",
        json : true,
        dataType: "json",
        async : false,
        cache: false,
        success: function(f) {
            for (var fi in f) {
                $("#SideBar").append("<button id='" + f[fi].slice(0, -5) + "' class='gltfs'></button>")
                files.push(f[fi].slice(0, -5));
            }
        }
    });
    return files;
}
function clearScene() {
    for( var i = scene.children.length - 1; i >= 0; i--) {
        var obj = scene.children[i];
        scene.remove(obj);
    }
}
$(document).ready(function() {
    var files = get_files()
    console.log(files)
    for (var f in files) {
        (function (f) {
        $("#SideBar").on("click", "#" + files[f], (function () {
                clearScene();
                putTHingsInside("/Logics/assets/blender/" + files[f] + ".gltf");
            }))
            })(f)
        $("#" + files[f]).css("background-image", "url('assets/blenderImages/" + files[f] + ".png')")
    }
})