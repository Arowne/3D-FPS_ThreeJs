function setGunChoice(){

    // Orientation text
    const textLoader = new THREE.FontLoader();
    const textMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff
    });

    textLoader.load( '/assets/fonts/A-Space.json', function ( font ) {

        const textFont = new THREE.TextGeometry( 'CHOOSE YOUR GUN', {
            font: font,
            size: 12,

        } );
        
        text = new THREE.Mesh( textFont, textMaterial );
        text.position.z -= 120;
        text.position.x -= 100;
        text.position.y += 40;

        text.scale.set(1, 1, 0.02)

        scene.add(text);
        
    });

    // Gun setting
    const gunArray = ["laser_gun", "mwpnfltgn", "XCom_laserRifle_obj", "XCom_rifle_obj"];
    const Dust_explorerLoader = new THREE.MTLLoader();

    Dust_explorerLoader.setTexturePath('/assets/gun_obj/');
    Dust_explorerLoader.setPath('/assets/gun_obj/');
    Dust_explorerLoader.load('mwpnfltgn.mtl', function (materials) {

        materials.preload();

        for (let i = 0; i < gunArray.length; i++) {

            const objLoader = new THREE.OBJLoader();

            objLoader.setMaterials(materials);
            objLoader.setPath('/assets/gun_obj/');
            objLoader.load(gunArray[i] + '.obj', function (object) {
    
                // object.scale.set(2.05, 2.05, 2.05);
                object.position.x -= -75 + i*50;
                object.position.z -= 100;
                gunSelector[i] = object.position.x;

                var geometry = new THREE.BoxGeometry( 20, 20, 20 );
                var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
                var cube = new THREE.Mesh( geometry, material );

                switch (gunArray[i]) {
                    case "laser_gun":
                    
                        object.traverse( function ( child ) {
                            if ( child instanceof THREE.Mesh ) {
                                child.material.color.setHex(0xDAA520);
                            }
                        });

                        object.scale.set(0.3, 0.3, 0.3);

                        break;
                    
                    case "mwpnfltgn":
                        
                        object.scale.set(5, 5, 5);
                        object.rotation.y = 90 * Math.PI / 180;

                        break;

                    case "XCom_laserRifle_obj":

                        const textureLoader = new THREE.TextureLoader();
                        const map = textureLoader.load('https://s3.pixers.pics/pixers/700/FO/48/23/80/59/700_FO48238059_a2f8e49af0f6f9a7a6ab146755068fbf.jpg');
                        const material = new THREE.MeshPhongMaterial({map: map});

                        object.traverse( function ( child ) {
                            if ( child instanceof THREE.Mesh ) {
                                child.material = material
                            }
                        });

                        object.scale.set(0.4, 0.4, 0.4);
                        object.rotation.y = 90 * Math.PI / 180;
                        break;
                    
                    case "XCom_rifle_obj":
                        
                        const textureLoader2 = new THREE.TextureLoader();
                        const map2 = textureLoader2.load('https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/1200px-Flag_of_the_United_States.svg.png');
                        const material2 = new THREE.MeshPhongMaterial({map: map2});

                        object.traverse( function ( child ) {
                            if ( child instanceof THREE.Mesh ) {
                                child.material = material2
                            }
                        });


                        object.scale.set(0.4, 0.4, 0.4);
                        object.rotation.y = 0 * Math.PI / 180;
                        break;


                    default:
                        break;
                }
                
                cube.position.x = object.position.x
                cube.position.z = object.position.z
                cube.position.y = object.position.y
                scene.add( cube );

                objects.push(cube);

                scene.add(object);
    
            });
        }

    });

}