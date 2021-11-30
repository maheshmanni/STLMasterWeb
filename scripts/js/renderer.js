class SceneObjects
{
    constructor(object, material, mesh, bb)
    {
        this.object = object;
        this.material = material;
        this.mesh = mesh;
        this.bb = bb;
    }
}
var material;
var selectedObjColor;
var hasObjectsPicked = false;
const aSceneObjects = [];
const aBackgroundScene = [];

var mBoundingBox;
var MeasureText = [];
var mBBGeom;
const sceneBoundingBox = [];
var renderer;
var gui;
var lightCube;
var mSelectedMaterial;
function Render() {
    const scene = new THREE.Scene();
    gui = new dat.GUI();
   // mSelectedMaterial = getMaterial('standard', 'rgb(255, 217, 145)', lightCube);
   // gui.add(mSelectedMaterial, 'metalness', 0, 1);
   // gui.add(mSelectedMaterial, 'roughness', 0, 1);
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
                mSelectedMaterial = material;
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
        material = getMaterial('standard', 'rgb(255, 217, 145)', lightCube);
        material.envMap = lightCube;
        mSelectedMaterial = material;
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
        child.geometry.computeBoundingBox();

        var boundingBox = child.geometry.boundingBox.clone();
        const sceneObj = new SceneObjects(object, material, child, boundingBox);

        
        aSceneObjects.push(sceneObj);
        UpdateBB();
     
        
      }
      scene.add(object);
      DeleteBB(scene);
      });
    }
    
    else
    {
        material = getMaterial('standard', 'rgb(255, 217, 145)', lightCube);
        material.envMap = lightCube;

        mSelectedMaterial = material;
        var loader = new THREE.STLLoader();
        var tmppath = URL.createObjectURL(e.target.files[0]);
        loader.load( tmppath, function ( geometry ) {
        var mesh = new THREE.Mesh(geometry);
        geometry.computeBoundingBox();
        mesh.material = material;
        const sceneObj = new SceneObjects(mesh, material, mesh, geometry.boundingBox.clone());
        aSceneObjects.push(sceneObj);
        UpdateBB();
        scene.add(mesh);  
        DeleteBB(scene);

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
            case '18':
                DrawBB(scene);
                break;
                  
        default:
            break;
      }
   
    return false; // avoiding navigation
});


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

function CreateBoundingBox()
{

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

function UpdateBB()
{
    if(aSceneObjects.length == 0)
    {
        return;
    }
    mBoundingBox = aSceneObjects[0].bb;
    for(let i = 1; i < aSceneObjects.length; ++i)
    {
        mBoundingBox.min.x = Math.min(aSceneObjects[i].bb.min.x, mBoundingBox.min.x);
        mBoundingBox.min.y = Math.min(aSceneObjects[i].bb.min.y, mBoundingBox.min.y);
        mBoundingBox.min.z = Math.min(aSceneObjects[i].bb.min.z, mBoundingBox.min.z);

        mBoundingBox.max.x = Math.max(aSceneObjects[i].bb.max.x, mBoundingBox.max.x);
        mBoundingBox.max.y = Math.max(aSceneObjects[i].bb.max.y, mBoundingBox.max.y);
        mBoundingBox.max.z = Math.max(aSceneObjects[i].bb.max.z, mBoundingBox.max.z);
    }
}

function DeleteBB(scene)
{
    if(MeasureText.length == 0)
        return;
    scene.remove(mBBGeom);
    while(MeasureText.length > 0)
    {
        scene.remove(MeasureText[MeasureText.length - 1]);
        MeasureText.pop();
    }
}

function DrawBB(scene)
{
    if(MeasureText.length > 0)
    {
        DeleteBB(scene);
        return;
    }
    let boundingBox = mBoundingBox;
    const midPos = new THREE.Vector3((boundingBox.min.x + boundingBox.max.x)/ 2, (boundingBox.min.y + boundingBox.max.y)/ 2,
    (boundingBox.min.z + boundingBox.max.z)/ 2);
    const width = Math.sqrt(Math.pow(boundingBox.min.x - boundingBox.max.x, 2));
    const height = Math.sqrt(Math.pow(boundingBox.min.y - boundingBox.max.y, 2));
    const length = Math.sqrt(Math.pow(boundingBox.min.z - boundingBox.max.z, 2));

    const geometry = new THREE.BoxGeometry( width, height, length );
    geometry.translate(midPos.x, midPos.y, midPos.z);
    //const material1 = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    //mBBGeom = new THREE.Mesh( geometry, material1 );
   // material1.wireframe = true;
    //material1.transparent = true;
    //material1.opacity = 0.1;
    //scene.add( mBBGeom );

    //const geometry1 = new THREE.SphereGeometry( 100, 100, 100 );

const wireframe = new THREE.EdgesGeometry( geometry );

const line = new THREE.LineSegments( wireframe );

scene.add( line );

    const diagnoalLength = Math.sqrt(Math.pow(boundingBox.min.x - boundingBox.max.x, 2.0) 
    + Math.pow(boundingBox.min.y - boundingBox.max.y, 2.0) + Math.pow(boundingBox.min.z - boundingBox.max.z, 2.0));
    let scale = diagnoalLength / 10.0;
    CreateText('W = ' + width.toFixed(2).toString(), scene, new THREE.Vector3(midPos.x, midPos.y, boundingBox.max.z), '', scale);
    CreateText('H = ' + height.toFixed(2).toString(), scene, new THREE.Vector3(boundingBox.min.x, midPos.y, midPos.z), 'z', scale);
    CreateText('L = ' + length.toFixed(2).toString(), scene, new THREE.Vector3(boundingBox.max.x, midPos.y, midPos.z), 'y', scale);

}

function CreateText(str, scene, pos, rot, scale)
{
    const loader = new THREE.FontLoader();

    loader.load( './assets/fonts/gentilis_regular.typeface.json', function ( font ) {

	const geometry = new THREE.TextGeometry( str, {
		font: font,
		size: scale,
		height: 0.1,
		curveSegments: 1,
		bevelEnabled: false,
		bevelThickness: 10,
		bevelSize: 8,
		bevelOffset: 0,
		bevelSegments: 5
	} );
    
    if(rot == 'y')
    {
        geometry.rotateY(1.57);
    }
    else if(rot == 'z')
    {
        geometry.rotateZ(1.57);
    }
    //
    geometry.translate(pos.x, pos.y, pos.z);
    const tm = new THREE.MeshBasicMaterial( {color: 0xffa500} );
    var text = new THREE.Mesh(geometry, tm);
           // text.castShadow = true;
            scene.add(text);
            MeasureText.push(text);
} );
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
        
            selectedMaterial.envMap = reflectionCube;
            selectedMaterial.internsity = 5.0;
           // gui.add(selectedMaterial, 'metalness', 0, 1);
           // gui.add(selectedMaterial, 'roughness', 0, 1);
          
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
    for(var index = 0; index < 7; ++index)
    {
        var path = '/assets/cubemap/';
        path += (index + 1) + '/';
        var ext = '.png';
    
        var urls = [ path + 'px' + ext, path + 'nx' + ext,
                    path + 'py' + ext, path + 'ny' + ext,
                    path + 'pz' + ext, path + 'nz' + ext ];
      var reflectionCube = new THREE.CubeTextureLoader().load(urls);
        reflectionCube.format = THREE.RGBFormat;
       // reflectionCube.internsity = 2.0;
        aBackgroundScene.push(reflectionCube);
    }
    lightCube = aBackgroundScene[5];
}