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
    initFloor();
    initSky();
    initTerrain();
    // initGround();
    initController();
    initStats();
    appendCanvas();
    render();
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

  function initGround() {
    var height     = 256,
        width      = 256,
        worldWidth = 256,
        worldDepth = 256,
        size       = heights * width,
        heights    = [],
        perlin     = new ImprovedNoise(),
        length,
        i,
        x,
        y,
        geometry,
        texture;

    // this processing may be unnecessary
    // initialize 2 dimensions array with 0
    for (i = 0; y < size; i++) {
      y = ~~(i / width);
      x = i % width;
      heights[i] += Math.abs(perlin.noise(x, y, 1));
    }

    geometry = new THREE.PlaneGeometry(
      7500,
      7500,
      worldWidth - 1,
      worldDepth - 1
    );
    for (i = 0, length = geometry.vertices.length; i < length; i ++ ) {
      geometry.vertices[i].y = heights[i] * 10;
    }

    texture = new THREE.Texture(
      generateTexture(
        heights,
        worldWidth,
        worldDepth
      ),
      new THREE.UVMapping(),
      THREE.ClampToEdgeWrapping,
      THREE.ClampToEdgeWrapping
    );
    texture.needsUpdate = true;

    scene.add(
      new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({ map: texture })
      )
    );
  }

  function initTerrain() {
    var size     = 256,
        heights  = [],
        geometry = new THREE.Geometry(),
        delta,
        x,
        y,
        xLength,
        yLength;

    // initialize 2 dimensions array with 0
    for (y = 0; y <= size; y++) {
      heights[y] = [];
      for (x = 0; x <= size; x++) {
        heights[y][x] = 0;
      }
    }

    // change the edge values
    heights[0][0]       = randomDelta(size);
    heights[0][size]    = randomDelta(size);
    heights[size][0]    = randomDelta(size) + size;
    heights[size][size] = randomDelta(size) + size;

    // create hights map with random delta
    for (median = size / 2; median >= 1; median /= 2) {
      for (y = 0; y <= size; y += median * 2) {
        for (x = median; x <= size; x += median * 2) {
          heights[y][x] = (
            heights[y][x - median] +
            heights[y][x + median]
          ) / 2 + randomDelta(median);
        }
      }

      for (y = median; y <= size; y += median * 2) {
        for (x = 0; x <= size; x += median * 2) {
          heights[y][x] = (
            heights[y - median][x] +
            heights[y + median][x]
          ) / 2 + randomDelta(median);
        }
      }

      for (y = median; y <= size; y += median * 2) {
        for (x = median; x <= size; x += median * 2) {
          heights[y][x] = (
            heights[y - median][x] +
            heights[y + median][x] +
            heights[y][x - median] +
            heights[y][x + median]
          ) / 4 + randomDelta(median);
        }
      }
    }

    // create vertex and faces
    for (y = 0, yLength = heights.length; y < yLength; y++) {
      for (x = 0, xLength = heights[y].length; x < xLength; x++) {
        geometry.vertices.push(
          new THREE.Vector3(y, heights[y][x], x)
        );

        if (y != yLength - 1 && x != xLength - 1) {
          geometry.faces.push(
            new THREE.Face3(
              (x + 0) + (y + 0) * yLength,
              (x + 1) + (y + 0) * yLength,
              (x + 0) + (y + 1) * yLength
            )
          );
          geometry.faceVertexUvs[0].push([
            new THREE.UV((x + 0) / size, (y + 0) / size),
            new THREE.UV((x + 1) / size, (y + 0) / size),
            new THREE.UV((x + 0) / size, (y + 1) / size)
          ]);
        }

        if (y != 0 && x != 0) {
          geometry.faces.push(
            new THREE.Face3(
              (x + 0) + (y + 0) * yLength,
              (x - 1) + (y + 0) * yLength,
              (x + 0) + (y - 1) * yLength
            )
          );
          geometry.faceVertexUvs[0].push([
            new THREE.UV((x + 0) / size, (y + 0) / size),
            new THREE.UV((x - 1) / size, (y + 0) / size),
            new THREE.UV((x + 0) / size, (y - 1) / size)
          ]);
        }
      }
    }
    geometry.computeFaceNormals();

    scene.add(
      new THREE.Mesh(
        geometry,
        new THREE.MeshLambertMaterial({ color: 0x339900 })
      )
    );

    function randomDelta(size) {
      return (Math.random() - 0.5) * size;
    }
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