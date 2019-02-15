function setLevel(){

    // personage
    var loader = new THREE.GLTFLoader();
    loader.load( '/assets/models/gltf/RobotExpressive/RobotExpressive.glb', function( gltf ) {
                            
        model = gltf.scene;
        gltf.scene.scale.set(30, 30, 30);
        model.position.z -= 1000;
        model.position.y -= 100;
        model.position.x += 500;
        modelGTLF = gltf;
        scene.add( model );

        animatePNJ( model, gltf.animations, 'Walking' );
                            
    }, undefined, function( e ) {
        console.error( e );
    } );

}