//Miss png
// 2 == atterisseur (Mettre au centre de la map)
// 3 == base nasa (en mettre plusieur ?)
// 4 == rover
// 5 == Observatoir (en mettre plusieur ?)



// EXEMPLE DE FONCTION DE GENERATION DE MAP



function generateMap(){

    const map = [
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,4,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,1,1,1,1,0,0,0],
        [0,0,0,1,2,1,1,0,0,0],
        [0,0,0,1,1,1,1,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,5,0,0],
        [0,3,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0]
    ];

    for(let i = 0; i < map.length ; i++){


        for( let j = 0; j < map[i].length; j++){
            
            switch (map[i][j]) {
                case 3:

                        const TextureLoader = new THREE.MTLLoader();

                        // Load 3d gun object
                        TextureLoader.setTexturePath('/assets/building_obj/');
                        TextureLoader.setPath('/assets/building_obj/');
                        TextureLoader.load('HDU_lowRez.mtl', function (materials) {

                                materials.preload();

                                const objLoader = new THREE.OBJLoader();

                                objLoader.setMaterials(materials);
                                objLoader.setPath('/assets/building_obj/');
                                objLoader.load('HDU_lowRez.obj', function (object) {
                        
                                    object.position.x -= -75 + i*50;
                                    object.position.z -= 100;

                                    const textureLoader = new THREE.TextureLoader();
                                    const map = textureLoader.load('/assets/building_obj/HDU_01.jpg');
                                    const material = new THREE.MeshPhongMaterial({map: map});
                                    
                                    object.traverse( function ( child ) {
                                        if ( child instanceof THREE.Mesh ) {
                                            child.material = material
                                        }
                                    });

                                    var geometry = new THREE.BoxGeometry( 160, 100, 100 );
                                    var material2 = new THREE.MeshBasicMaterial( {color: 0xffffff, transparent:true, opacity: 0} );
                                    var cube = new THREE.Mesh( geometry, material2 );


                                    cube.position.y = object.position.y
                                    cube.position.x = object.position.x
                                    cube.position.z = object.position.z

                                    objects.push( cube );
                                    scene.add( cube );
                                    
                                    object.scale.set(0.1, 0.1, 0.1);
                                    scene.add( object );
                        
                                });

                        });


                        // Load 3d gun object
                        TextureLoader.setTexturePath('/assets/building_obj/');
                        TextureLoader.setPath('/assets/building_obj/');
                        TextureLoader.load('HDU_lowRez_part2.mtl', function (materials) {

                                materials.preload();

                                const objLoader = new THREE.OBJLoader();

                                objLoader.setMaterials(materials);
                                objLoader.setPath('/assets/building_obj/');
                                objLoader.load('HDU_lowRez_part2.obj', function (object) {
                        
                                    object.position.x -= -75 + i*50;
                                    object.position.z -= 100;

                                    const textureLoader = new THREE.TextureLoader();
                                    const map = textureLoader.load('/assets/building_obj/HDU_02.jpg');
                                    const material = new THREE.MeshPhongMaterial({map: map});
                                    
                                    object.traverse( function ( child ) {
                                        if ( child instanceof THREE.Mesh ) {
                                            child.material = material
                                        }
                                    });
                                    
                                    object.scale.set(0.1, 0.1, 0.1);
                                    scene.add( object );

                                });

                        });



                    break;

                    case 2:

                        const LanderTextureLoader = new THREE.MTLLoader();
                    
                        // Load 3d gun object
                        LanderTextureLoader.setTexturePath('/assets/building_obj/');
                        LanderTextureLoader.setPath('/assets/building_obj/');
                        LanderTextureLoader.load('lander.mtl', function (materials) {

                                materials.preload();

                                const objLoader = new THREE.OBJLoader();

                                objLoader.setMaterials(materials);
                                objLoader.setPath('/assets/building_obj/');
                                objLoader.load('lander.obj', function (object) {
                        
                                    object.position.x -= -75 + i*50;
                                    object.position.z -= 100;
                                    
                                    object.scale.set(1, 1, 1);

                                    var geometry = new THREE.BoxGeometry( 120, 100, 100 );
                                    var material2 = new THREE.MeshBasicMaterial( {color: 0xffffff, transparent:true, opacity: 0} );
                                    var cube = new THREE.Mesh( geometry, material2 );


                                    cube.position.y = object.position.y
                                    cube.position.x = object.position.x
                                    cube.position.z = object.position.z

                                    objects.push( cube );
                                    scene.add( cube );

                                    scene.add( object );

                                });

                        });
                    
                    break;

                    case 4:

                        const VaisseauTextureLoader = new THREE.MTLLoader();
                    
                        // Load 3d gun object
                        VaisseauTextureLoader.setTexturePath('/assets/building_obj/');
                        VaisseauTextureLoader.setPath('/assets/building_obj/');
                        VaisseauTextureLoader.load('futuristic spacecraft_obj.mtl', function (materials) {

                                materials.preload();

                                const objLoader = new THREE.OBJLoader();

                                objLoader.setMaterials(materials);
                                objLoader.setPath('/assets/building_obj/');
                                objLoader.load('futuristic spacecraft_obj.obj', function (object) {
                        
                                    object.position.x -= -75 + i*50;
                                    object.position.z -= 100;
                                    
                                    object.scale.set(7, 7, 7);

                                    var geometry = new THREE.BoxGeometry( 100, 100, 100 );
                                    var material2 = new THREE.MeshBasicMaterial( {color: 0xffffff, transparent:true, opacity: 0} );
                                    var cube = new THREE.Mesh( geometry, material2 );


                                    cube.position.y = object.position.y
                                    cube.position.x = object.position.x
                                    cube.position.z = object.position.z

                                    objects.push( cube );
                                    scene.add( cube );

                                    scene.add( object );

                                });

                        });
                    
                    break;

                    case 5:

                            const objLoader = new THREE.OBJLoader();

                            objLoader.setPath('/assets/building_obj/');
                            objLoader.load('Observatory.obj', function (object) {
                    
                                object.position.x += 100;
                                
                                object.scale.set(0.1, 0.1, 0.1);

                                var geometry = new THREE.BoxGeometry( 100, 100, 100 );
                                var material2 = new THREE.MeshBasicMaterial( {color: 0xffffff, transparent:true, opacity: 0} );
                                var cube = new THREE.Mesh( geometry, material2 );

                                const textureLoader = new THREE.TextureLoader();
                                const map = textureLoader.load('/assets/building_obj/Observatory.jpg');
                                const material = new THREE.MeshPhongMaterial({map: map});
                                
                                object.traverse( function ( child ) {
                                    if ( child instanceof THREE.Mesh ) {
                                        child.material = material
                                    }
                                });

                                cube.position.y = object.position.y
                                cube.position.x = object.position.x
                                cube.position.z = object.position.z

                                objects.push( cube );
                                scene.add( cube );

                                scene.add( object );

                            });
                
                    break;
                        
                default:
                    break;
            }


        }


    }


}