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
FirstPerson = function(args) {
  // initialize

  this.camera    = args.camera;
  this.moveSpeed = args.moveSpeed || 1000;
  this.distance  = args.distance || 1000;

  this.canvas       = document;
  this.viewHalfX    = window.innerWidth  / 2;
  this.viewHalfY    = window.innerHeight / 2;
  this.moveForward  = false;
  this.moveBackward = false;
  this.mouseX       = 0;
  this.mouseY       = 0;
  this.latitude     = 0;
  this.longitude    = 0;
  this.lookSpeed    = 0.01;
  this.viewTarget   = new THREE.Vector3(0, 0, 100);

  // public

  this.update = function(delta) {
    var moveDelta = this.moveSpeed * delta;

    if (this.moveForward)  this.camera.translateZ(-moveDelta);
    if (this.moveBackward) this.camera.translateZ( moveDelta);
    if (this.moveLeft)     this.camera.translateX(-moveDelta);
    if (this.moveRight)    this.camera.translateX( moveDelta);

    var lookDelta = delta * this.lookSpeed;
    this.longitude += this.mouseX * lookDelta;
    this.latitude  -= this.mouseY * lookDelta;
    this.latitude  = Math.max(-85, Math.min(85, this.latitude));

    var latitudeRad  = this.latitude  * Math.PI / 180;
    var longitudeRad = this.longitude * Math.PI / 180;
    this.viewTarget.x = this.camera.position.x + this.distance * Math.cos(latitudeRad) * Math.cos(longitudeRad);
    this.viewTarget.z = this.camera.position.z + this.distance * Math.cos(latitudeRad) * Math.sin(longitudeRad);
    this.viewTarget.y = this.camera.position.y + this.distance * Math.sin(latitudeRad);
    this.camera.lookAt({
      x: this.viewTarget.x,
      y: this.viewTarget.y,
      z: this.viewTarget.z
    });
  }

  // private

  this.onMouseDown = function(event) {
    event.preventDefault();
    event.stopPropagation();

    this.mouseDrag = true;
    switch(event.button) {
      case 0: this.moveForward  = true; break;
      case 2: this.moveBackward = true; break;
    }
  }

  this.onMouseUp = function(event) {
    event.preventDefault();
    event.stopPropagation();

    this.mouseDrag = false;
    switch(event.button) {
      case 0: this.moveForward  = false; break;
      case 2: this.moveBackward = false; break;
    }
  }

  this.onMouseMove = function(event) {
    event.preventDefault();
    event.stopPropagation();

    this.mouseX = event.pageX - this.viewHalfX;
    this.mouseY = event.pageY - this.viewHalfY;
  }

  this.onKeyDown = function(event) {
    switch(keyString(event)) {
      case 'Up':    this.moveForward  = true; break;
      case 'Down':  this.moveBackward = true; break;
      case 'Left':  this.moveLeft     = true; break;
      case 'Right': this.moveRight    = true; break;
    }
  }

  this.onKeyUp = function(event) {
    switch(keyString(event)) {
      case 'Up':    this.moveForward  = false; break;
      case 'Down':  this.moveBackward = false; break;
      case 'Left':  this.moveLeft     = false; break;
      case 'Right': this.moveRight    = false; break;
    }
  }

  this.onContextMenu = function(event) {
    event.preventDefault();
    event.stopPropagation();
    // Do nothing
  }

  this.bindKeyAndMouseEvents = function() {
    this.canvas.addEventListener('contextmenu', bind(this, this.onContextMenu), false);
    this.canvas.addEventListener('mousemove',   bind(this, this.onMouseMove),   false);
    this.canvas.addEventListener('mousedown',   bind(this, this.onMouseDown),   false);
    this.canvas.addEventListener('mouseup',     bind(this, this.onMouseUp),     false);
    this.canvas.addEventListener('keyup',       bind(this, this.onKeyUp),       false);
    this.canvas.addEventListener('keydown',     bind(this, this.onKeyDown),     false);

    function bind(scope, fn) {
      return function() {
        fn.apply(scope, arguments);
      };
    };
  }

  this.bindKeyAndMouseEvents();
};