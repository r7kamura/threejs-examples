/**
* Create a first-person viewpoint controller for passed camera.
*
* mouse move  => move viewpoint to follow mouse pointer
* click Left  => move forward
* click Right => move backward
* Key Left    => rotate laterally
* Key Right   => rotate laterally
* Key Up      => turn up
* Key Down    => turn down
*
* Example:
*   var scene      = new THREE.Scene();
*   var camera     = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
*   var clock      = new THREE.Clock();
*   var controller = new FirstPersonController({ camera: camera });
*
*   scene.add(camera);
*   render();
*
*   function render() {
*     controller.update(clock.getDelta());
*     renderer.clear();
*     renderer.render(scene, camera);
*     window.requestAnimationFrame(render);
*   }
*
* @class Behave first-person viewpoint.
* @params args.camera THREE.camera
* @params [args.moveSpeed] scale of movement speed (default: 1000)
* @params [args.distance] distance from camera to its target point (default: 1000)
* @params [agrs.enableVertical] flag to allow move vertically
* */
var FirstPersonController = function self(args) {
  var camera         = args.camera;
  var moveSpeed      = args.moveSpeed || 1000;
  var distance       = args.distance || 1000;
  var enableVertical = args.enableVertical;

  var canvas       = document;
  var viewHalfX    = window.innerWidth  / 2;
  var viewHalfY    = window.innerHeight / 2;
  var moveForward  = false;
  var moveBackward = false;
  var moveLeft     = false;
  var moveRight    = false;
  var mouseX       = 0;
  var mouseY       = 0;
  var latitude     = 0;
  var longitude    = 0;
  var lookSpeed    = 0.01;
  var viewTarget   = new THREE.Vector3(0, 0, 100);

  bindKeyAndMouseEvents();

  /** @public */
  self.prototype.update = function(delta) {
    var moveDelta = delta * moveSpeed,
        lookDelta = delta * lookSpeed;

    if (moveForward)  camera.translateZ(-moveDelta);
    if (moveBackward) camera.translateZ( moveDelta);
    if (moveLeft)     camera.translateX(-moveDelta);
    if (moveRight)    camera.translateX( moveDelta);

    longitude += mouseX * lookDelta;
    latitude  -= mouseY * lookDelta;
    latitude   = Math.max(-90, Math.min(90, latitude));
    var latitudeRad  = latitude  * Math.PI / 180;
    var longitudeRad = longitude * Math.PI / 180;
    viewTarget.x = camera.position.x + distance * Math.cos(latitudeRad) * Math.cos(longitudeRad);
    viewTarget.z = camera.position.z + distance * Math.cos(latitudeRad) * Math.sin(longitudeRad);
    viewTarget.y = camera.position.y + distance * Math.sin(latitudeRad);
    camera.lookAt(viewTarget);
  }

  function onMouseDown(event) {
    event.preventDefault();
    event.stopPropagation();

    mouseDrag = true;
    switch(event.button) {
      case 0: moveForward  = true; break;
      case 2: moveBackward = true; break;
    }
  }

  function onMouseUp(event) {
    event.preventDefault();
    event.stopPropagation();

    mouseDrag = false;
    switch(event.button) {
      case 0: moveForward  = false; break;
      case 2: moveBackward = false; break;
    }
  }

  function onMouseMove(event) {
    event.preventDefault();
    event.stopPropagation();

    mouseX = event.pageX - viewHalfX;
    if (enableVertical)
      mouseY = event.pageY - viewHalfY;
  }

  function onKeyDown(event) {
    switch(keyString(event)) {
      case 'Up':    moveForward  = true; break;
      case 'Down':  moveBackward = true; break;
      case 'Left':  moveLeft     = true; break;
      case 'Right': moveRight    = true; break;
    }
  }

  function onKeyUp(event) {
    switch(keyString(event)) {
      case 'Up':    moveForward  = false; break;
      case 'Down':  moveBackward = false; break;
      case 'Left':  moveLeft     = false; break;
      case 'Right': moveRight    = false; break;
    }
  }

  function onContextMenu(event) {
    event.preventDefault();
    event.stopPropagation();
    // Do nothing
  }

  function bindKeyAndMouseEvents() {
    canvas.addEventListener('contextmenu', bind(this, onContextMenu), false);
    canvas.addEventListener('mousemove',   bind(this, onMouseMove),   false);
    canvas.addEventListener('mousedown',   bind(this, onMouseDown),   false);
    canvas.addEventListener('mouseup',     bind(this, onMouseUp),     false);
    canvas.addEventListener('keyup',       bind(this, onKeyUp),       false);
    canvas.addEventListener('keydown',     bind(this, onKeyDown),     false);

    function bind(scope, fn) {
      return function() {
        fn.apply(scope, arguments);
      };
    };
  }
};