import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {VRButton} from 'three/examples/jsm/webxr/VRButton.js';
import {XRControllerModelFactory} from 'three/examples/jsm/webxr/XRControllerModelFactory.js';

class SceneInit {
  constructor({rootEl}) {
    this.canvas = document.createElement('canvas');
    this.root = rootEl;
    this.width = rootEl.clientWidth;
    this.height = rootEl.clientHeight;
    this.background = 0x666666;
    this.raycaster = null;
    this.controller = null;
    this.controllerGrip = null;
    this.tempMatrix = new THREE.Matrix4();
    this.userData = null;
    this.buildedControler = null;
    this.model = null;

    this.init();
    this.bindEvents();
    this.animate();
  }

  init() {
    this.initScene();
    this.initLights();
    this.initCamera();
    this.initRenderer();
    this.initControls();

    this.root.appendChild(this.canvas);
  }

  initScene() {
    this.scene = new THREE.Scene();
  }

  initLights() {
    const ambient = new THREE.AmbientLight(0xFFFFFF, 0.9);
    const point = new THREE.PointLight(0xCCCCCC, 0.1, 10);
    const directional = new THREE.DirectionalLight(0xFFFFFF, 0.5);

    this.scene.add(ambient);
    this.scene.add(point);
    this.scene.add(directional);
  }

  initCamera() {
    const aspect = this.width / this.height;

    this.camera = new THREE.PerspectiveCamera(
      45,
      aspect,
      1,
      1000
    );

    this.camera.position.z = 0.89;
    this.camera.position.x = -18.58;
    this.camera.position.y = 7.34;
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }

  initRenderer() {
    this.raycaster = new THREE.Raycaster();
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.xr.enabled = true;
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(this.background, 1);
    this.canvas = this.renderer.domElement;
  }

  initControls() {
    let _this = this;

    this.controls = new OrbitControls(
      this.camera,
      this.canvas
    );

    this.controls.minPolarAngle = (Math.PI * 1) / 6;
    this.controls.maxPolarAngle = (Math.PI * 3) / 4;
    this.controls.smooth = true;
    this.controls.smoothspeed = 0.95;
    this.controls.maxDistance = 20;
    this.controls.minDistance = 12;
    this.controls.update();

    this.controller = this.renderer.xr.getController(0);
    this.controller.addEventListener('selectstart', this.onSelectStart);
    this.controller.addEventListener('selectend', this.onSelectEnd);

    this.controller.addEventListener('connected', function (event) {
      _this.buildedControler = _this.buildController(event.data);
      this.add(_this.buildedControler);
    });

    this.controller.addEventListener('disconnected', function () {
      this.remove(this.children[0]);
    });

    this.scene.add(this.controller);

    let controllerModelFactory = new XRControllerModelFactory();
    this.controllerGrip = this.renderer.xr.getControllerGrip(0);
    this.controllerGrip.add(controllerModelFactory.createControllerModel(this.controllerGrip));
    this.scene.add(this.controllerGrip);

    document.body.appendChild(VRButton.createButton(this.renderer));
  }

  buildController(data) {
    let geometry, material, gaze_cursor;

    switch (data.targetRayMode) {

      case 'tracked-pointer':
        geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, -1], 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute([0.5, 0.5, 0.5, 0, 0, 0], 3));

        material = new THREE.LineBasicMaterial({
          vertexColors: true,
          blending: THREE.AdditiveBlending
        });

        return new THREE.Line(geometry, material);

      case 'gaze':
        geometry = new THREE.RingBufferGeometry(0.02, 0.04, 32).translate(0, 0, -1);
        material = new THREE.MeshBasicMaterial({opacity: 0.6, transparent: true});
        gaze_cursor = new THREE.Mesh(geometry, material);
        gaze_cursor.name = 'gaze_cursor';

        return gaze_cursor;
    }
  }

  onSelectStart() {
    this.userData.isSelecting = true;
  }

  onSelectEnd() {
    this.userData.isSelecting = false;
  }

  render() {
    let intersects = [];
    let min = null;

    this.tempMatrix.identity().extractRotation(this.controller.matrixWorld);
    this.raycaster.ray.origin.setFromMatrixPosition(this.controller.matrixWorld);
    this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(this.tempMatrix);


    if (!!this.model && !!this.model.children) {
      intersects = this.raycaster.intersectObjects(this.model.children);

      if (intersects.length) {

        min = intersects.reduce(function (prev, curr) {
          return prev.distance < curr.distance ? prev : curr;
        });

        !!min && min.object.name.startsWith('floor_prefix_') ? this.toggleCursor(true) : this.toggleCursor();
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  toggleCursor(turnOn) {
    if (!!this.buildedControler && !!this.buildedControler.material) {

      if (turnOn) {
        this.buildedControler.material.color.setHex(0x46cc2b);
        this.buildedControler.material.opacity = 1;

      } else {
        this.buildedControler.material.color.setHex(0xc0c7bf);
        this.buildedControler.material.opacity = 0.6;
      }
    }
  }

  animate() {
    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  loadModel(model, callback) {
    this.loader = new GLTFLoader();

    this.loader.load(model, (gltf) => {
      if (typeof callback === 'function') {
        callback(gltf.scene);
      }

      this.model = gltf.scene;
      this.scene.add(this.model);
    });
  }

  add(model) {
    this.scene.add(model);
  }

  remove(objName) {
    const object = this.scene.getObjectByName(objName);

    if (object) {
      this.scene.remove(object);
    }
  }

  onResize() {
    this.width = this.root.clientWidth;
    this.height = this.root.clientHeight;

    this.renderer.setSize(this.width, this.height);

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  bindEvents() {
    window.addEventListener('resize', () => this.onResize());
  }
}

const sceneInit = args => new SceneInit(args);

export default sceneInit;
