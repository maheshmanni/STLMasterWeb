function Render() {
    const scene = new THREE.Scene();
    var gui = new dat.GUI();
    const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );

    const renderer = new THREE.WebGLRenderer();
    //renderer.setClearColorHex(0xEEEEEE);
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    const geometry = new THREE.BoxGeometry();
    const material = getMaterial('standard', 'rgb(255, 217, 145)');
    const cube = new THREE.Mesh( geometry, material );
   cube.castShadow = true;
    cube.position.y = cube.geometry.parameters.height/2;
    //scene.add( cube );
	var loader = new THREE.OBJLoader();
    var fileButton = document.getElementById("fileButton");
    fileButton.addEventListener('change', function(e){

    var file = e.target.files[0];
    var reader = new FileReader();
    reader.readAsText(file);
    reader.addEventListener('load', function(event) {
      var contents = event.target.result;
      var object = loader.parse(contents);

      object.traverse(function(child) {
        child.material = material;
      } );
      scene.add(object);
//      render();
      });

});

	/*loader.load('https://firebasestorage.googleapis.com/v0/b/manni-technology.appspot.com/o/folder%2Flee-perry-smith-head-scan.obj?alt=media&token=54981eee-fa05-4dc2-a490-2ee006de0c78', function (object) {

		object.traverse(function(child) {
			child.material = material;
		} );
		scene.add(object);
	}
);*/
    var pointLight = CreateDirectionLight(1);
    pointLight.position.y = 2;
    pointLight.position.x = 2;
    pointLight.position.z = 2;
    gui.add(pointLight, 'intensity', 1, 10);
    gui.add(pointLight.position, 'y', 0, 20);
   // gui.add(material, 'shininess', 0, 1000);
   // scene.add(pointLight);
   // scene.add(pointLight);

    var plane = CreateGroundPlane(4);
    plane.rotation.x = Math.PI/2;
  //  scene.add(plane);
    var axes = THREE.AxisHelper(20);
    scene.add(axes);
	gui.add(axes, 'visible');
	var path = '/assets/cubemap/';
	var ext = '.jpg';

	var urls = [ path + 'posx' + ext, path + 'negx' + ext,
				path + 'posy' + ext, path + 'negy' + ext,
				path + 'posz' + ext, path + 'negz' + ext ];
  var reflectionCube = new THREE.CubeTextureLoader().load(urls);
    reflectionCube.format = THREE.RGBFormat;
    scene.background = reflectionCube;
	material.metalness = 1.0;
	material.roughness = 0.3;

	gui.add(material, 'metalness', 0, 1);
	gui.add(material, 'roughness', 0, 1);
	material.envMap = reflectionCube;
    camera.position.z = 5;
    const controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.update();
    renderer.shadowMap.enabled = true;
    renderer.render( scene, camera );

    function animate() {

        requestAnimationFrame( animate );

        // required if controls.enableDamping or controls.autoRotate are set to true
        controls.update();

        renderer.render( scene, camera );

    }
    animate();
}
Render();

function CreateGroundPlane(size) {

    var geometry = new THREE.PlaneGeometry(size, size);
    var material = new THREE.MeshPhongMaterial(
        {color: 0x0000ff, side : THREE.DoubleSide}
    );
    var mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    return mesh;
}

function CreatePointLight(internsity) {

    var light  = new THREE.PointLight(0xffffff, internsity);
    light.castShadow = true;
    return light;
}

function CreateDirectionLight(internsity) {

    var light  = new THREE.DirectionalLight(0xffffff, internsity);
    light.castShadow = true;
    return light;
}

function getMaterial(type, color) {
	var selectedMaterial;
	var materialOptions = {
		color: color === undefined ? 'rgb(255, 255, 255)' : color,
	};

	switch (type) {
		case 'basic':
			selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
			break;
		case 'lambert':
			selectedMaterial = new THREE.MeshLambertMaterial(materialOptions);
			break;
		case 'phong':
			selectedMaterial = new THREE.MeshPhongMaterial(materialOptions);
			break;
		case 'standard':
			selectedMaterial = new THREE.MeshStandardMaterial(materialOptions);
			break;
		default:
			selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
			break;
	}

	return selectedMaterial;
}
