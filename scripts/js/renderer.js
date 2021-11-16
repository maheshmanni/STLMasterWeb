class SceneObjects
{
    constructor(object, material, mesh)
    {
        this.object = object;
        this.material = material;
        this.mesh = mesh;
    }
}
var material;
var selectedObjColor;
var hasObjectsPicked = false;
const aSceneObjects = [];
const aBackgroundScene = [];
var renderer;
function Render() {
    const scene = new THREE.Scene();
    var gui = new dat.GUI();
    const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color( "rgb(128, 128, 128)"), 1.0);
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    const geometry = new THREE.BoxGeometry();
   // = getMaterial('standard', 'rgb(255, 217, 145)');
    const cube = new THREE.Mesh( geometry, material );
   cube.castShadow = true;
    cube.position.y = cube.geometry.parameters.height/2;
    //scene.add( cube );
	
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    function onDocumentMouseDown(event) {

        console.log("mouse down");
        const _y = event.clientY - 50;
        var vector = new THREE.Vector3(( event.clientX / window.innerWidth ) * 2 - 1, -( _y / window.innerHeight ) * 2 + 1, 0.5);
            vector = vector.unproject(camera);

            var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
            const objectsToIntersect = [];
            var index = 0;
            while(index < aSceneObjects.length)
            {
                objectsToIntersect.push(aSceneObjects[index].mesh);
                index++;
            }
            var intersects = raycaster.intersectObjects(objectsToIntersect);

            if(hasObjectsPicked == true)
            {
                material.color = selectedObjColor;
            }
            hasObjectsPicked = false;
            if (intersects.length > 0) {

                material = intersects[0].object.material;
                selectedObjColor = material.color;
                material.color = new THREE.Color( "rgb(255, 255, 0)");
                hasObjectsPicked = true;
            }
    }
    var fileButton = document.getElementById("fileButton");
    fileButton.addEventListener('change', function(e){

    var file = e.target.files[0];
    const fileExt = GetFileExtension(file.name);

  
    if(fileExt == 'obj' || fileExt == 'OBJ')
    {
        material = getMaterial('standard', 'rgb(255, 217, 145)');
        material.envMap = reflectionCube;
        var loader = new THREE.OBJLoader();
        var reader = new FileReader();
        reader.readAsText(file);
        reader.addEventListener('load', function(event) {
      var contents = event.target.result;
      var object = loader.parse(contents);
      
      if(object.children.length > 0)
      {
          const child = object.children[0];
        child.material = material;
        const sceneObj = new SceneObjects(object, material, child);
        aSceneObjects.push(sceneObj);
      }
      //currentObject = object;
   /*   object.traverse(function(child) {
        child.material = material;
        const sceneObj = new SceneObjects(object, material, new THREE.Mesh(child.geometry));
      aSceneObjects.push(sceneObj);
      } );*/
      scene.add(object);
      });
    }
    
    else
    {
        material = getMaterial('standard', 'rgb(255, 217, 145)');
        material.envMap = reflectionCube;

        var loader = new THREE.STLLoader();
        var tmppath = URL.createObjectURL(e.target.files[0]);
        loader.load( tmppath, function ( geometry ) {
        var mesh = new THREE.Mesh(geometry);
        mesh.material = material;
        const sceneObj = new SceneObjects(mesh, material, mesh);
        aSceneObjects.push(sceneObj);
        scene.add(mesh);  
        
        });
    }
      

});

const colorPickElemnent = document.getElementById("colorpicker");
colorPickElemnent.addEventListener('change', function(e) {

scene.background = 0;
renderer.setClearColor(colorPickElemnent.value, 1.0);
});

document.getElementById("mySidenav").addEventListener('click', function(e) {
  
    
    switch(e.target.id) {
        case '0':
            material.color = new THREE.Color( "rgb(255, 217, 145)");
            material.opacity = 1.0;
                material.transparent = false;
          break;
        case '1':
            
            material.color = new THREE.Color( "rgb(97%, 96%, 91%)" );
            material.opacity = 1.0;
                material.transparent = false;
          break;
        case '2':
            
            material.color = new THREE.Color( "rgb(80%, 49%, 19%)" );
            material.opacity = 1.0;
                material.transparent = false;
            break;
        case '3':
            material.color = new THREE.Color( 'red' );
            material.opacity = 1.0;
                material.transparent = false;
            break;
        case '4':
            material.color = new THREE.Color( 'blue' );
            material.opacity = 1.0;
            material.transparent = false;
            break;
        case '5':
            material.color = new THREE.Color( 'grey' );
            material.opacity = 1.0;
            material.transparent = false;
            break;
            case '6':
                
                material.color = new THREE.Color( "rgb(0, 255, 0)");
                material.opacity = 0.8;
                material.transparent = true;
              break;
            case '7':
                
                material.color = new THREE.Color( "rgb(0, 0, 255)");
                material.opacity = 0.8;
                material.transparent = true;
              break;
            case '8':
                
                material.color = new THREE.Color( "rgb(255, 0, 0)");
                material.opacity = 0.8;
                material.transparent = true;
                break;
            case '9':
                material.color = new THREE.Color( 'white' );
                material.opacity = 0.8;
                material.transparent = true;
                break;
            case '10':
                material.color = new THREE.Color( 'yellow' );
                material.opacity = 0.8;
                material.transparent = true;
                break;
            case '11':
                    Undo(scene);
                break;
            case '12':
                    DeleteAll(scene);
                break;
            case '13':
                scene.background = aBackgroundScene[0];
                break;
            case '14':
                scene.background = aBackgroundScene[1];
                break;
            case '15':
                scene.background = aBackgroundScene[2];
                break;
            case '16':
                scene.background = aBackgroundScene[3];
                break;
            case '17':
                scene.background = aBackgroundScene[4];
                break;
                  
        default:
            break;
      }
   
    return false; // avoiding navigation
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
  //  gui.add(pointLight, 'intensity', 1, 10);
    //gui.add(pointLight.position, 'y', 0, 20);
   // gui.add(material, 'shininess', 0, 1000);
   // scene.add(pointLight);
   // scene.add(pointLight);

    var plane = CreateGroundPlane(4);
    plane.rotation.x = Math.PI/2;
  //  scene.add(plane);
    var axes = THREE.AxisHelper(20);
   // scene.add(axes);
	//gui.add(axes, 'visible');
	/*var path = '/assets/cubemap/';
	var ext = '.jpg';

	var urls = [ path + 'posx' + ext, path + 'negx' + ext,
				path + 'posy' + ext, path + 'negy' + ext,
				path + 'posz' + ext, path + 'negz' + ext ];
  var reflectionCube = new THREE.CubeTextureLoader().load(urls);
    reflectionCube.format = THREE.RGBFormat;*/
    
    LoadCubemap();
    const reflectionCube = aBackgroundScene[0];
    //scene.background = reflectionCube;

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

function Undo(scene)
{
    if(aSceneObjects.length > 0)
    {

        scene.remove(aSceneObjects[aSceneObjects.length - 1].object);
        aSceneObjects.pop();  
        if(aSceneObjects.length > 0)
        {
            material = aSceneObjects[aSceneObjects.length - 1].material;
        } 
    }
}

function DeleteAll(scene)
{
    while(aSceneObjects.length > 0)
    {
        scene.remove(aSceneObjects[aSceneObjects.length - 1].object);
        aSceneObjects.pop();
    }
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

function getMaterial(type, color, reflectionCube) {
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
            selectedMaterial.metalness = 1.0;
            selectedMaterial.roughness = 0.0;
        
            //gui.add(material, 'metalness', 0, 1);
            //gui.add(material, 'roughness', 0, 1);
          
			break;
		default:
			selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
			break;
	}

	return selectedMaterial;
}

function ClearSelection()
{

}

function SelectObject()
{

}

function GetFileExtension(filePath)
{
    return filePath.split('.').pop();
}

function LoadCubemap()
{
    for(var index = 0; index < 5; ++index)
    {
        var path = '/assets/cubemap/';
        path += (index + 1) + '/';
        var ext = '.png';
    
        var urls = [ path + 'px' + ext, path + 'nx' + ext,
                    path + 'py' + ext, path + 'ny' + ext,
                    path + 'pz' + ext, path + 'nz' + ext ];
      var reflectionCube = new THREE.CubeTextureLoader().load(urls);
        reflectionCube.format = THREE.RGBFormat;
        aBackgroundScene.push(reflectionCube);
    }
    
}