var camera, scene, renderer, controls;
var objects = [];
var guns = [];
var granades = [];
var textArray = [];
var raycaster;
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;
var prevTime = performance.now();
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();
var vertex = new THREE.Vector3();
var color = new THREE.Color();
var weaponChoice = "gun";
var rays = [
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(1, 0, 1),
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(1, 0, -1),
    new THREE.Vector3(0, 0, -1),
    new THREE.Vector3(-1, 0, -1),
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(-1, 0, 1)
];

var counter = 0;
var stopped = false;

var selectorContainer = document.getElementById( 'selector-container' );
var counterContainer = document.getElementById( 'counter-container' );

var stuff = {
    gun: '',
    grenade: '',
    life: 50,
    speed: ''
}

var game = {

    started: false

};

init();
animate();

// Set floor texture
function solLunaire(positionX, positionY,  positionZ) {

    const mtlLoader = new THREE.MTLLoader();
    mtlLoader.setTexturePath('/assets/obj_and_mtl/');
    mtlLoader.setPath('/assets/obj_and_mtl/');
    mtlLoader.load('altarStone.mtl', function (materials) {

        materials.preload();

        const objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath('/assets/obj_and_mtl/');
        objLoader.load('moon_near_side.obj', function (object) {

            object.position.set(-920, -30, -920);
            object.scale.set(2.05, 2.05, 2.05);
            object.rotateX( - Math.PI / 2 );


            let floor = []; 

            for(let j = 0; j <= 13; j++){

                floor[j] = [];

                for (let i = 0; i <= 13; i++){
                
                    floor[j][i] = object.clone();
                    
                    floor[j][i].position.set( i*160 -920, -30, j*160 -920);
                    scene.add(floor[j][i]);
    
                }

            }

        });

    });
    
}

// Init environnement
function init() {
    
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x000000);

    // Blockeur settings//
    controls = new THREE.PointerLockControls( camera );

    var blocker = document.getElementById( 'blocker' );
    var instructions = document.getElementById( 'instructions' );

    instructions.addEventListener( 'click', function () {

        controls.lock();

    }, false );

    controls.addEventListener( 'lock', function () {
        instructions.style.display = 'none';

        blocker.style.display = 'none';
        counterContainer.innerHTML = "";

    } );


    controls.addEventListener( 'unlock', function () {

        blocker.style.display = 'block';
        instructions.style.display = '';

    } );



    counterContainer.addEventListener( 'click', function () {
        
        controls.lock();

    }, false );


    scene.add( controls.getObject() );


    var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
    light.position.set( 0.5, 1, 0.75 );
    scene.add( light );

    var onKeyDown = function ( event ) {
        switch ( event.keyCode ) {
            case 38: // up
            case 90: // w
                moveForward = true;
                break;
            case 37: // left
            case 81: // a
                moveLeft = true;
                break;
            case 40: // down
            case 83: // s
                moveBackward = true;
                break;
            case 39: // right
            case 68: // d
                moveRight = true;
                break;
            case 32: // space
                if ( canJump === true ) velocity.y += 350;
                canJump = false;
                break;
        }
    };
    
    var onKeyUp = function ( event ) {
        switch ( event.keyCode ) {
            case 38: // up
            case 90: // w
                moveForward = false;
                break;
            case 37: // left
            case 81: // a
                moveLeft = false;
                break;
            case 40: // down
            case 83: // s
                moveBackward = false;
                break;
            case 39: // right
            case 68: // d
                moveRight = false;
                break;
        }
    };

    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );

    raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

    // // floor
    var floorGeometry = new THREE.PlaneBufferGeometry( 2000, 2000, 100, 100 );
    floorGeometry.MeshBasicMaterial
    floorGeometry.rotateX( - Math.PI / 2 );

    position = floorGeometry.attributes.position;
    
    var floorMaterial = new THREE.MeshBasicMaterial( { color: 'red', wireframe: true} );
    var floor = new THREE.Mesh( floorGeometry, floorMaterial );

    scene.add( floor );

    
    renderer = new THREE.WebGLRenderer( { antialias: true } );

    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    
    //
    window.addEventListener( 'resize', onWindowResize, false );

    setGunChoice();
    
    //#Decommente ça si tu es un homme
    // solLunaire();

}

// Resize canvas and camera
function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    
}

function animate() {

    
    requestAnimationFrame( animate );

     //Set raycaster position to controls position ray casting detection;
     raycaster.ray.origin.copy( controls.getObject().position );
     raycaster.ray.origin.y -= 10;
     raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(), 0, 10);
         
     
    for (let i = 0; i < rays.length; i++){

         raycaster.set(controls.getObject().position , rays[i]);

         var intersections = raycaster.intersectObjects( objects );
         var onObject = intersections.length > 0;
         var time = performance.now();
         var delta = ( time - prevTime ) / 1000;

         velocity.x -= velocity.x * 10.0 * delta;
         velocity.z -= velocity.z * 10.0 * delta;
         velocity.y -= 8.8 * 60.0 * delta; // 100.0 = mass

         direction.z = Number( moveForward ) - Number( moveBackward );
         direction.x = Number( moveLeft ) - Number( moveRight );
         direction.normalize(); // this ensures consistent movements in all directions


         if ( moveForward || moveBackward ) velocity.z -= direction.z * 500.0 * delta;
         if ( moveLeft || moveRight ) velocity.x -= direction.x * 500.0 * delta;
         
         controls.getObject().translateX( velocity.x * delta );
         controls.getObject().translateY( velocity.y * delta );
         controls.getObject().translateZ( velocity.z * delta );
         
         if(onObject && intersections[0].distance <= 10){

             if ((i === 0 || i === 1 || i === 7) && direction.z === 1) {

                 direction.z = 0;
                 controls.getObject().position.z -= 10;
                 
                 if(game.started === false ){
                   
                    getCurrentChoice(intersections, objects, selectorContainer, counterContainer, weaponChoice);
                 
                }
                 

             } 
             else if ((i === 3 || i === 4 || i === 5) && direction.z === -1) {

                 direction.z = 0;
                 controls.getObject().position.z += 10;
                 
                if(game.started === false ){
                    console.log(game.started);
                    getCurrentChoice(intersections, objects, selectorContainer, counterContainer, weaponChoice);
                 
                }

             }
             if ((i === 1 || i === 2 || i === 3) && direction.x === 1) {
                 
                 direction.x = 0;
                 controls.getObject().position.x -= 10;
                 
                 if(game.started === false ){
                   
                    getCurrentChoice(intersections, objects, selectorContainer, counterContainer, weaponChoice);
                 
                }
                 
             } 
             else if ((i === 5 || i === 6 || i === 7) && direction.x === -1) {

                 direction.x = 0;
                 controls.getObject().position.x += 10;
                 if(game.started === false ){
                 
                    getCurrentChoice(intersections, objects, selectorContainer, counterContainer, weaponChoice);
                    
                 }


             }

         }



         if ( controls.getObject().position.y < 10 ) {

             velocity.y = 0;
             controls.getObject().position.y = 10;
             canJump = true;
             
         }


         prevTime = time;

    }

    renderer.render( scene, camera );
}
