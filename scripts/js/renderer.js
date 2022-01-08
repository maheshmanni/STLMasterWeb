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
var camera;
var mBoundingBox;
var MeasureText = [];
var mBBGeom;
const sceneBoundingBox = [];
var renderer;
var gui;
var lightCube;
var mSelectedMaterial;
var controls;
var mBBLength;
var mFitNeeded = true;
var params = {
    metallic: 1,
    roughness: 0.0
};
function Render() {
    const scene = new THREE.Scene();
    gui = new dat.GUI();
    gui.add(params, 'metallic').min(0).max(1).step(0.1).onFinishChange(function(){
        // refresh based on the new value of params.interation
        console.log(this.getValue());
        mSelectedMaterial.metalness = this.getValue();
        
    })
    gui.add(params, 'roughness').min(0).max(1).step(0.1).onFinishChange(function(){
        // refresh based on the new value of params.interation
        console.log(this.getValue());
        mSelectedMaterial.roughness = this.getValue();
    })
   // mSelectedMaterial = getMaterial('standard', 'rgb(255, 217, 145)', lightCube);
   // gui.add(mSelectedMaterial, 'metalness', 0, 1);
   // gui.add(mSelectedMaterial, 'roughness', 0, 1);
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 10000 );

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color( "rgb(47, 161, 214)"), 1.0);
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    const geometry = new THREE.BoxGeometry();
   // = getMaterial('standard', 'rgb(255, 217, 145)');
    const cube = new THREE.Mesh( geometry, material );
   cube.castShadow = true;
    cube.position.y = cube.geometry.parameters.height/2;
    //scene.add( cube );
	
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mouseup', onDocumentMouseRelease, false);
    function onDocumentMouseDown(event) {

      
    }
    
    function onDocumentMouseRelease(event)
    {
       /* var dirVector = new THREE.Vector3(1.0, 1.0, 0.0);
        camera.getWorldDirection(dirVector);

        let delta = (mBBLength * event.deltaY) / 100
       camera.position.x += dirVector.x * delta;
       camera.position.y += dirVector.y * delta;
        camera.position.z += dirVector.z * delta;*/

        console.log("mouse release");

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
                    material.color = new THREE.Color( 'purple' );
                material.opacity = 0.8;
                material.transparent = true;
                break;
            case '12':
                var speed = 2000;

                    Undo(scene);
                break;
            case '13':
                    DeleteAll(scene);
                break;
            case '14':
                scene.background = aBackgroundScene[0];
                break;
            case '15':
                scene.background = aBackgroundScene[1];
                break;
            case '16':
                scene.background = aBackgroundScene[2];
                break;
            case '17':
                scene.background = aBackgroundScene[3];
                break;
            case '18':
                scene.background = aBackgroundScene[4];
                break;
            case '19':
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
    controls = new THREE.TrackballControls( camera, renderer.domElement );
    
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
    mFitNeeded = true;
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


let boundingBox = mBoundingBox;
const midPos = new THREE.Vector3((boundingBox.min.x + boundingBox.max.x)/ 2, (boundingBox.min.y + boundingBox.max.y)/ 2,
    (boundingBox.min.z + boundingBox.max.z)/ 2);
const width = Math.sqrt(Math.pow(boundingBox.min.x - boundingBox.max.x, 2));
    const height = Math.sqrt(Math.pow(boundingBox.min.y - boundingBox.max.y, 2));
    const length = Math.sqrt(Math.pow(boundingBox.min.z - boundingBox.max.z, 2));

    mBBLength = width + height + length;
    const geometry = new THREE.BoxGeometry( width, height, length );
    geometry.translate(midPos.x, midPos.y, midPos.z);
    fitCameraToCenteredObject(camera, geometry, 2, controls);
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

    mBBGeom = new THREE.LineSegments( wireframe );

    scene.add( mBBGeom );

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

function fitCameraToObject( camera, offset ) {

    offset = offset || 1.25;

    let boundingBox = mBoundingBox;
    const center = new THREE.Vector3((boundingBox.min.x + boundingBox.max.x)/ 2, (boundingBox.min.y + boundingBox.max.y)/ 2,
    (boundingBox.min.z + boundingBox.max.z)/ 2);

    const size = Math.sqrt(Math.pow(boundingBox.min.x - boundingBox.max.x, 2) +
    Math.pow(boundingBox.min.y - boundingBox.max.y, 2) +
    Math.pow(boundingBox.min.z - boundingBox.max.z, 2));


    const width = Math.sqrt(Math.pow(boundingBox.min.x - boundingBox.max.x, 2));
    const height = Math.sqrt(Math.pow(boundingBox.min.y - boundingBox.max.y, 2));
    const length = Math.sqrt(Math.pow(boundingBox.min.z - boundingBox.max.z, 2));
    // get the max side of the bounding box (fits to width OR height as needed )
    const maxDim = Math.max( width, height, length );
    const fov = camera.fov * ( Math.PI / 180 );
    let cameraZ = Math.abs( maxDim / 4 * Math.tan( fov * 2 ) );

    cameraZ *= offset; // zoom out a little so that objects don't fill the screen

    camera.position.z = cameraZ;

    const minZ = boundingBox.min.z;
    const cameraToFarEdge = ( minZ < 0 ) ? -minZ + cameraZ : cameraZ - minZ;

    camera.far = cameraToFarEdge * 3;
    camera.updateProjectionMatrix();


        camera.lookAt( center );
}

const fitCameraToCenteredObject = function (camera, object, offset, orbitControls ) {
   
    if(!mFitNeeded)
    {
        return;
    }
    //fit is needed only for first loaded object
    mFitNeeded = false;
    object.computeBoundingBox();
    var boundingBox = object.boundingBox.clone();//new THREE.Box3();
   // boundingBox.setFromObject( object );

    var middle = boundingBox.center();//new THREE.Vector3();
    boundingBox.min.x = boundingBox.min.x + middle.x;
    boundingBox.min.y = boundingBox.min.y + middle.y;
    boundingBox.min.z = boundingBox.min.z + middle.z;

    boundingBox.max.x = boundingBox.max.x + middle.x;
    boundingBox.max.y = boundingBox.max.y + middle.y;
    boundingBox.max.z = boundingBox.max.z + middle.z;

    middle = boundingBox.center();
    //boundingBox.min = boundingBox.min + middle;
    //boundingBox.max = boundingBox.max + middle;
    var size = new THREE.Vector3();
    boundingBox.getSize(size);

    // figure out how to fit the box in the view:
    // 1. figure out horizontal FOV (on non-1.0 aspects)
    // 2. figure out distance from the object in X and Y planes
    // 3. select the max distance (to fit both sides in)
    //
    // The reason is as follows:
    //
    // Imagine a bounding box (BB) is centered at (0,0,0).
    // Camera has vertical FOV (camera.fov) and horizontal FOV
    // (camera.fov scaled by aspect, see fovh below)
    //
    // Therefore if you want to put the entire object into the field of view,
    // you have to compute the distance as: z/2 (half of Z size of the BB
    // protruding towards us) plus for both X and Y size of BB you have to
    // figure out the distance created by the appropriate FOV.
    //
    // The FOV is always a triangle:
    //
    //  (size/2)
    // +--------+
    // |       /
    // |      /
    // |     /
    // | F° /
    // |   /
    // |  /
    // | /
    // |/
    //
    // F° is half of respective FOV, so to compute the distance (the length
    // of the straight line) one has to: `size/2 / Math.tan(F)`.
    //
    // FTR, from https://threejs.org/docs/#api/en/cameras/PerspectiveCamera
    // the camera.fov is the vertical FOV.

    const fov = camera.fov * ( Math.PI / 180 );
    const fovh = 2*Math.atan(Math.tan(fov/2) * camera.aspect);
    let dx = size.z / 2 + Math.abs( size.x / 2 / Math.tan( fovh / 2 ) );
    let dy = size.z / 2 + Math.abs( size.y / 2 / Math.tan( fov / 2 ) );
    let cameraZ = Math.max(dx, dy);

    // offset the camera, if desired (to avoid filling the whole canvas)
    if( offset !== undefined && offset !== 0 ) cameraZ *= offset;

    let _x = middle.x / 2 ;// + boundingBox.max.x
    let _y = middle.y / 2;// + boundingBox.max.y
    camera.position.set(_x, _y, cameraZ);
  // camera.position.set( 0.0, 0.0, cameraZ );
    // set the far plane of the camera so that it easily encompasses the whole object
    const minZ = boundingBox.min.z;
    const cameraToFarEdge = ( minZ < 0 ) ? -minZ + cameraZ : cameraZ - minZ;

    camera.far = cameraToFarEdge * 7;
    

    //camera.lookAt (new THREE.Vector3(middle.x, middle.y, middle.z));//( boundingSphere.center );
  
    orbitControls.update();
    
   // camera.lookAt( middle );
    if ( orbitControls !== undefined ) {
        // set camera to rotate around the center
       // orbitControls.target = new THREE.Vector3(0.0, 0.0, 0.0);
     //  orbitControls.position = new THREE.Vector3(middle.x + boundingBox.min.x, middle.y, cameraZ);
     orbitControls.target = new THREE.Vector3(_x, _y, middle.z);
        // prevent camera from zooming out far enough to create far plane cutoff
       // orbitControls.maxDistance = cameraToFarEdge * 2;
    }
    orbitControls.update();
    camera.updateProjectionMatrix();
};