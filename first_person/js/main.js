$(function() {
  var width,
      height,
      renderer,
      camera,
      scene,
      light,
      controls,
      clock,
      isMouseDown,
      x     = 0,
      y     = 0,
      fps   = 0,
      frame = 0,
      sec   = 0;

  init();

  function initCanvasSize() {
    var canvas = $('#canvas');
    width  = canvas.width();
    height = canvas.height();
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

  function startLoop() {
    loopPerFrame();
    loopPerSec();
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

  function initControl() {
    controls = new FirstPersonView({
      camera: camera,
    });
    clock = new THREE.Clock();
  }

  function loopPerFrame() {
    frame++;
    fps++;

    controls.update(clock.getDelta());
    updateStatusFrame();

    renderer.clear();
    renderer.render(scene, camera);
    window.requestAnimationFrame(loopPerFrame);
  }

  function loopPerSec() {
    setInterval(function() {
      updateStatusSec();
      updateStatusFps();
      fps = 0;
      sec++;
    }, 1000);
  }

  function updateStatusFps() {
    $('#status .fps .value').text(fps);
  }

  function updateStatusSec() {
    $('#status .sec .value').text(sec);
  }

  function updateStatusFrame() {
    $('#status .frame .value').text(frame);
  }

  function render() {
    $('#canvas').append(renderer.domElement);
  }

  function init() {
    initCanvasSize();
    initRenderer();
    initScene();
    initCamera();
    initLight();
    initFloor();
    initControl();
    startLoop();
    render();
  }
});
