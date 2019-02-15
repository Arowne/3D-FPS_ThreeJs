var camera, scene, renderer, controls, clock, mixer, actions, activeAction, previousAction, model ;
var objects = [];
var guns = [];
var granades = [];
var textArray = [];
var bullets = [];
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
var modelGTLF;


var rays = [
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(1, 0, 1),
    new THREE.Vector3(1, 0, -1),
    new THREE.Vector3(0, 0, -1),
    new THREE.Vector3(-1, 0, -1),
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(-1, 0, 1)
];

var counter = 0;
var stopped = false;

var selectorContainer = document.getElementById( 'selector-container' );
var counterContainer = document.getElementById( 'counter-container' );

var stuff = {
    gun: '',
    granades: 3,
    bullet: 150,
    life: 50,
    experience: 0
};

var game = {

    started: false

};

var pnjDirection = {

    direction: 10
    
};


var vaisseau = {

    fly: false,
    uuid: null,
    object: null,
    cube: null,
    a: 0,

};

// BoardMenu


(function() {
    var SELECTOR_REPLAY_INTRO_BUTTONS = '#button-replay';
    var SELECTOR_BUTTON_NEWGAME = '.button-play';
    var SELECTOR_BUTTON_HOW_TO_PLAY = '.button-command';
    var SELECTOR_BUTTON_GAME_MENU = '.button-game-menu';
    var menu = $('.game');

    var timelineIntroScreen;

    function buildTimelines() {
        timelineIntroScreen = new TimelineMax({
            paused: false
        });

        timelineIntroScreen.staggerFrom('.screen-intro .button', 2, {
            css: {
                scale: 0
            },
            autoAlpha: 0,
            ease: Elastic.easeOut
        }, .1);
    }

    function playIntroButtons() {
        timelineIntroScreen.restart();
    }

    function reverseIntroButtons() {

        timelineIntroScreen.reverse();

    }

    function fadeToScreen(targetScreenClassName) {
        var _nameScreen;

        if (!targetScreenClassName) {
            _nameScreen = 'screen-intro';
        }

        _nameScreen = targetScreenClassName;

        var $elementTarget = $('.' + _nameScreen);
        var $elementActiveScreen = $('.active-screen');

        return TweenMax.to($elementActiveScreen, .4, {
            autoAlpha: 0,
            y: '+=10',
            onComplete: function() {

                $elementActiveScreen.removeClass('active-screen');

                TweenMax
                    .to($elementTarget, .4, {
                        y: '-=10',
                        autoAlpha: 1,
                        className: '+=active-screen'
                    });
            }
        });

    }

    // Initialize
    $(document).ready(buildTimelines);

    var audio = new Audio('assets/music/graveyard-shift-by-kevin-macleod.mp3');
    audio.play();

    $('#blocker').hide();
    $('#selector-container').hide();
    $('#command').hide();
    $('#menu-container').hide();
    $('#game-board').hide();
    $('.viseur').hide();

    // Bindings
    $(document).on('click', SELECTOR_REPLAY_INTRO_BUTTONS, function(event) {
        event.preventDefault();

        if (!$('.screen-intro').hasClass('active-screen')) {
            return;
        }

        playIntroButtons();
    });

    menu.on('click', SELECTOR_BUTTON_NEWGAME, function(event) {
       // console.log('hahaha');
        event.preventDefault();
      //  reverseIntroButtons();
        $('.game').hide(400, function() {


            $('.game').css('width', 0);
            $('#title').hide();
            $('.viseur').show();
            $('#blocker').show();
            $('#selector-container').show();
            $('#game-board').show();
            $('.life').append('<p class="life" style="color:#001229; font-size: 25px; position: absolute; margin: 0;">' + stuff['life'] + '</p>');
            document.getElementById('pbullet').innerHTML = stuff.bullet;
            $('.grenade').append('<p class="grenade">' + stuff['granades'] + '</p>');

            init();
            animate();
            audio.pause();

        });



        timelineIntroScreen.eventCallback('onReverseComplete', function() {
           // fadeToScreen('screen-game');

        });
    });

    menu.on('click', SELECTOR_BUTTON_HOW_TO_PLAY, function(event) {
        event.preventDefault();

        $('#main').hide(400, function() {

            $('#block-menu').css('display', 'flex');
            $('#title').hide();
            $('#command').show();


        });
    });

    menu.on('click', SELECTOR_BUTTON_GAME_MENU, function(event) {
        event.preventDefault();

        $('#command').hide(400, function() {

            $('#main').show();
            $('#title').show();

        });
    });

})();


//


// Set floor texture
function solLunaire(positionX, positionY,  positionZ) {


    // lights
    scene.add(new THREE.AmbientLight(0x736F6E));

    var directionalLight=new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position=camera.position;
    scene.add(directionalLight);

    const mtlLoader = new THREE.MTLLoader();
    mtlLoader.setTexturePath('/assets/obj_and_mtl/');
    mtlLoader.setPath('/assets/moon-floor/');
    mtlLoader.load('mountains.mtl', function (materials) {

        materials.preload();
        var textureLoader = new THREE.TextureLoader();
        var map = textureLoader.load('/assets/moon-floor/martian.png');
        var material = new THREE.MeshPhongMaterial({map: map});

        const objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath('/assets/moon-floor/');
        objLoader.load('mountains.obj', function (object) {

            object.traverse( function ( node ) {

                if ( node.isMesh ) node.material = material;

            } );

            object.position.set(-1420, -30, -1420);
            object.scale.set(16, 10, 9.5);


            let floor = []; 

            for(let j = 0; j <= 17; j++){

                floor[j] = [];

                for (let i = 0; i <= 17; i++){
                
                    floor[j][i] = object.clone();
                    
                    floor[j][i].position.set( i*160 -1420, -120, j*160 -1420);
                    scene.add(floor[j][i]);
    
                }

            }

        });

    });
    
}

// Init environnement
function init() {
    
    clock = new THREE.Clock();

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1500 );
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
    // var floorGeometry = new THREE.PlaneBufferGeometry( 2000, 2000, 100, 100 );
    // floorGeometry.MeshBasicMaterial
    // floorGeometry.rotateX( - Math.PI / 2 );

    // position = floorGeometry.attributes.position;
    
    // var floorMaterial = new THREE.MeshBasicMaterial( { color: 'red', wireframe: true} );
    // var floor = new THREE.Mesh( floorGeometry, floorMaterial );

    // scene.add( floor );

    
    renderer = new THREE.WebGLRenderer( { antialias: true } );

    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    renderer.gammaOutput = true;
    renderer.gammaFactor = 2.2;

    document.body.appendChild( renderer.domElement );
    
    //
    window.addEventListener( 'resize', onWindowResize, false );


    setGunChoice();
    
    //#Decommente ça si tu es un homme
    solLunaire();

}

// Resize canvas and camera
function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    
}

function animatePNJ( model, animations, animationName ) {

    var states = [ 'Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing' ];
    
    mixer = new THREE.AnimationMixer( model );
    actions = {};

    for ( var i = 0; i < animations.length; i++ ) {

        var clip = animations[ i ];
        var action = mixer.clipAction( clip );
        actions[ clip.name ] = action;

        if ( states.indexOf( clip.name ) >= 5 ) {

                action.clampWhenFinished = true;
                action.loop = THREE.LoopOnce;
                
        }

    }

    activeAction = actions[animationName];
    
    activeAction.play();
    
}


function animate() {


    requestAnimationFrame( animate );

    if(vaisseau.fly){


        if(vaisseau.object.position.y >= 50 ) {

            vaisseau.a += 10;
            vaisseau.object.position.y += 10;
            vaisseau.object.position.z += 159 + vaisseau.a;


        }
        else{

            vaisseau.object.position.y += 7;

        }


        if(vaisseau.object.position.z >= 1500){

            scene.remove(vaisseau.object);
            scene.remove(vaisseau.cube);

        }

    }

    if(model){

        model.position.z += pnjDirection.direction;
        
        for (let j = 0; j < bullets.length; j++) {

            if( bullets[j] === undefined ){ continue; }
    
            if( bullets[j].alive === false ){
    
                bullets[j].splice(j, 1);
    
            }
    
            bullets[j].position = bullets[j].position.sub(bullets[j].velocity);

            modelBB = new THREE.Box3().setFromObject(model);
            currentBulletBB = new THREE.Box3().setFromObject(bullets[j]);

            var bulletCollision = modelBB.intersectsBox(currentBulletBB);

            if(bulletCollision){
                
                animatePNJ( model, modelGTLF.animations, 'Death' );

                setTimeout(function(){

                    scene.remove(model);

                }, 800)

            }

        }

        for (let i = 0; i < objects.length; i++) {

            const object = objects[i];
            firstBB = new THREE.Box3().setFromObject(model);
            secondBB = new THREE.Box3().setFromObject(object);
        
            var collision = firstBB.intersectsBox(secondBB);

            if(collision){

                pnjDirection.direction > 0 ? pnjDirection.direction = -10 : pnjDirection.direction = +10;
                model.rotation.y += 3.14159;
                
            }
        }



    }

    if(stuff.gun){

        stuff.gun.position.y = controls.getObject().position.y;
        stuff.gun.position.x = controls.getObject().position.x;
        stuff.gun.position.z = controls.getObject().position.z;

        stuff.gun.rotation.set(

            controls.getObject().rotation.x,
            controls.getObject().rotation.y,
            controls.getObject().rotation.z

        )

        scene.add(stuff.gun);

    }

    
    //Set raycaster position to controls position ray casting detection;
    raycaster.ray.origin.copy( controls.getObject().position );
    raycaster.ray.origin.y -= 10;


    var dt = clock.getDelta();
    if ( mixer ) mixer.update( dt );
         
     
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


         if ( moveForward || moveBackward ) velocity.z -= direction.z * 1200.0 * delta;
         if ( moveLeft || moveRight ) velocity.x -= direction.x * 1200.0 * delta;
         
         controls.getObject().translateX( velocity.x * delta );
         controls.getObject().translateY( velocity.y * delta );
         controls.getObject().translateZ( velocity.z * delta );
         
         if(onObject){

             if ((i === 0 || i === 1 || i === 7) && direction.z === 1) {

                 direction.z = 0;
                 controls.getObject().position.z -= 15;
                 
                 if(game.started === false ){
                   
                    getObjcetIntersect(intersections, objects, selectorContainer, counterContainer, weaponChoice);
                 
                }
                 

             } 
             else if ((i === 3 || i === 4 || i === 5) && direction.z === -1) {

                 direction.z = 0;
                 controls.getObject().position.z += 15;
                 
                if(game.started === false ){
                    getObjcetIntersect(intersections, objects, selectorContainer, counterContainer, weaponChoice);
                 
                }

             }
             if ((i === 1 || i === 2 || i === 3) && direction.x === 1) {
                 
                 direction.x = 0;
                 controls.getObject().position.x -= 15;
                 
                 if(game.started === false ){
                   
                    getObjcetIntersect(intersections, objects, selectorContainer, counterContainer, weaponChoice);
                 
                }
                 
             } 
             else if ((i === 5 || i === 6 || i === 7) && direction.x === -1) {

                 direction.x = 0;
                 controls.getObject().position.x += 15;
                 if(game.started === false ){
                 
                    getObjcetIntersect(intersections, objects, selectorContainer, counterContainer, weaponChoice);
                    
                 }


             }

            if( vaisseau.uuid === intersections[0].object.uuid ){

                vaisseau.fly = true;
                
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
