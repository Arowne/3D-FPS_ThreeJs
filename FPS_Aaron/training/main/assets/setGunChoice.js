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

        textArray.push(text);
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
                object.position.y += 10;
                gunArray[i] = object.position.x;

                var geometry = new THREE.SphereGeometry( 20, 20, 20 );
                var material = new THREE.MeshBasicMaterial( {color: 0xffffff, transparent:true, opacity: 0} );
                var cube = new THREE.Mesh( geometry, material );

                switch (i) {
                    case 0:
                    
                        const textureLoader2 = new THREE.TextureLoader();
                        const map2 = textureLoader2.load('/assets/gun_obj/laser_gun_spec.png');
                        const material2 = new THREE.MeshPhongMaterial({map: map2});

                        object.traverse( function ( child ) {
                            if ( child instanceof THREE.Mesh ) {
                                child.material = material2
                            }
                        });

                        object.scale.set(0.2, 0.2, 0.2);

                        break;
                    
                    case 1:
                        
                        object.scale.set(4, 4, 4);
                        object.rotation.y = 90 * Math.PI / 180;

                        break;

                    case 2:

                        object.traverse( function ( child ) {
                            if ( child instanceof THREE.Mesh ) {
                                child.material.color.setHex(0xDAA520);
                            }
                        });


                        object.scale.set(0.3, 0.3, 0.3);
                        object.rotation.y = 90 * Math.PI / 180;
                        break;
                    
                    case 3:
                        
                        object.traverse( function ( child ) {
                            if ( child instanceof THREE.Mesh ) {
                                child.material.color.setHex(0xDAA520);
                            }
                        });


                        object.scale.set(0.3, 0.3, 0.3);
                        break;


                    default:
                        break;
                }

                cube.position.y = object.position.y
                cube.position.x = object.position.x
                cube.position.z = object.position.z

                objects.push( cube );
                scene.add( cube );
                
                guns.push( object );
                scene.add( object );
    
            });
        }

    });

}

function unsetGunChoice(){

    for (let i = 0; i < guns.length; i++) {
        
        scene.remove(guns[i]);
        scene.remove(objects[i]);

        if(textArray[i]){

            scene.remove(textArray[i]);

        }
        
    }

}

function getCurrentChoice(intersections, objects, selectorContainer, counterContainer){

    stopped = false;
    counterContainer.innerHTML = "0";
    for (let i = 0; i < objects.length; i++) {

        const analyseObject = objects[i];
        const currentUuid = intersections[0].object.uuid;
        const counterHTML = document.getElementById('counter');
        
        
        if( analyseObject.uuid === currentUuid ){

            selectorContainer.style.display = 'block';
            counterContainer.style.display = '';
            controls.unlock();


            setInterval(function(){
                
                if(counterContainer.innerHTML == '') {
                    counter = 0;
                    stopped = true;

                }

                if(stopped === false){

                    counter += 1;
                    counterContainer.innerHTML = counter;
                    
                    if( counter === 10 ){
    
                        stuff.gun = guns[i];
                        guns[i].position.y += 50;
                        objects[i].position.y += 50;
                        unsetGunChoice();
                        controls.lock();
                    }

                }

            }, 1000);

        }
    }

}