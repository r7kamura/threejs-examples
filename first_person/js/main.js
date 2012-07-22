(function() {
  var width,
      height,
      renderer,
      camera,
      scene,
      light,
      view,
      clock,
      isMouseDown,
      canvas,
      x = 0,
      y = 0;

  (function self() {
    if (document.body) {
      init();
    } else {
      setTimeout(self, 1);
    }
  })();

  function initCanvasSize() {
    canvas = document.getElementById('canvas');
    width  = canvas.clientWidth;
    height = canvas.clientHeight;
  }

  function initRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setClearColorHex(0xFFFFFF, 1.0);
  }

  function initCamera() {
    camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000);
    camera.position.x = -1000;
    camera.position.y = 100;
    camera.position.z = 0;
    camera.up.x = 0;
    camera.up.y = 1;
    camera.up.z = 0;
    camera.lookAt({
      x: 0,
      y: 100,
      z: 0
    });
    scene.add(camera);
  }

  function initScene() {
    scene = new THREE.Scene();
  }

  function initLight() {
    light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    light.position.set(0, 1000, 0);
    scene.add(light);
  }

  function initFloor() {
    var sideNum = 10,
        size    = 100,
        tile;

    for (var x = -sideNum; x < sideNum; x++) {
      for (var z = -sideNum; z < sideNum; z++) {
        tile = new THREE.Mesh(
          new THREE.PlaneGeometry(size, size, 1, 1),
          new THREE.MeshLambertMaterial({
            color: ((x + z) % 2 == 0) ? 0x666666 : 0xDDDDDD
          })
        )
        tile.position.set(
          x * size,
          0,
          z * size
        );
        scene.add(tile);
      }
    }
  }

  function initView() {
    view = new FirstPersonView({
      camera: camera,
    });
    clock = new THREE.Clock();
  }

  function render() {
    view.update(clock.getDelta());

    renderer.clear();
    renderer.render(scene, camera);
    window.requestAnimationFrame(render);
  }

  function appendCanvas() {
    canvas.appendChild(renderer.domElement);
  }

  function init() {
    initCanvasSize();
    initRenderer();
    initScene();
    initCamera();
    initLight();
    initFloor();
    initView();
    appendCanvas();
    render();
  }
})();