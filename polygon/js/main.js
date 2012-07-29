(function() {
  var renderer,
      camera,
      scene,
      clock,
      controller,
      canvas,
      stats;

  (function self() {
    document.body ?
      init() :
      setTimeout(self, 1);
  })();

  function init() {
    initCanvas();
    initRenderer();
    initScene();
    initCamera();
    initLight();
    initSky();
    initController();
    initStats();
    initFloor();
    initObjects();
    appendCanvas();
    render();
  }

  function initObjects() {
    var geometry = new THREE.Geometry();

    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    geometry.vertices.push(new THREE.Vector3(0, 0, 100));
    geometry.vertices.push(new THREE.Vector3(0, 100, 0));

    var face = new THREE.Face3(0, 1, 2);
    face.normal = new THREE.Vector3(0, 0, 1);
    geometry.faces.push(face);

    scene.add(
      new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({ color: 0xFFFFFF })
      )
    );
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
            color: ((x + z) % 2 === 0) ? 0x666666 : 0xDDDDDD
          })
        );
        tile.position.set(
          x * size,
          0,
          z * size
        );
        scene.add(tile);
      }
    }
  }

  function initCanvas() {
    canvas = document.getElementById('canvas');
  }

  function initRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColorHex(0xFFFFFF, 1.0);
  }

  function initCamera() {
    camera = new THREE.PerspectiveCamera(
      50,
      canvas.clientWidth / canvas.clientHeight,
      1,
      10000
    );
    camera.position.x = -1000;
    camera.position.y = 100;
    camera.position.z = 0;
    camera.up.x = 0;
    camera.up.y = 1;
    camera.up.z = 0;
    camera.lookAt({
      x: 0,
      y: 1000,
      z: 0
    });
    scene.add(camera);
  }

  function initScene() {
    scene = new THREE.Scene();
  }

  function initLight() {
    var light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    light.position.set(0, 1000, 0);
    scene.add(light);
  }

  function initSky() {
    var sky = new THREE.Mesh(
      new THREE.SphereGeometry(4000, 20, 20),
      new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        map: THREE.ImageUtils.loadTexture("images/sky.png")
      })
    );
    sky.flipSided = true;
    scene.add(sky);
    scene.fog = new THREE.FogExp2(0xFFFFFF, 0.0002);
  }

  function initController() {
    controller = new FirstPersonController({ camera: camera });
    clock = new THREE.Clock();
  }

  function initStats() {
    stats = new Stats();
    document.getElementById('stats-outer').appendChild(stats.domElement);
  }

  function render() {
    stats.update();
    controller.update(clock.getDelta());
    renderer.clear();
    renderer.render(scene, camera);
    window.requestAnimationFrame(render);
  }

  function appendCanvas() {
    canvas.appendChild(renderer.domElement);
  }
})();