/*
* @params
*   camera    => THREE.camera
*   moveSpeed => the scale of movement speed
*
* @feature
*   click Left  => move forward
*   click Right => move backward
*   Key Left    => rotate laterally
*   Key Right   => rotate laterally
*   Key Up      => turn up
*   Key Down    => turn down
* */
var FirstPerson = function self(args) {
  var camera       = args.camera;
  var moveSpeed    = args.moveSpeed || 1000;
  var distance     = args.distance || 1000;
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

  self.prototype.update = function(delta) {
    var moveDelta = moveSpeed * delta;

    if (moveForward)  camera.translateZ(-moveDelta);
    if (moveBackward) camera.translateZ( moveDelta);
    if (moveLeft)     camera.translateX(-moveDelta);
    if (moveRight)    camera.translateX( moveDelta);

    var lookDelta = delta * lookSpeed;
    longitude += mouseX * lookDelta;
    latitude  -= mouseY * lookDelta;
    latitude  = Math.max(-85, Math.min(85, latitude));

    var latitudeRad  = latitude  * Math.PI / 180;
    var longitudeRad = longitude * Math.PI / 180;
    viewTarget.x = camera.position.x + distance * Math.cos(latitudeRad) * Math.cos(longitudeRad);
    viewTarget.z = camera.position.z + distance * Math.cos(latitudeRad) * Math.sin(longitudeRad);
    viewTarget.y = camera.position.y + distance * Math.sin(latitudeRad);
    camera.lookAt({
      x: viewTarget.x,
      y: viewTarget.y,
      z: viewTarget.z
    });
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
