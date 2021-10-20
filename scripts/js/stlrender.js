//once everything is loaded, we run our Three.js stuff.
    function init() {

        var stats = initStats();

        // create a scene, that will hold all our elements such as objects, cameras and lights.
        var scene = new THREE.Scene();

        // create a camera, which defines where we're looking at.
        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        scene.add(camera);

        // create a render and set the size
        var renderer = new THREE.WebGLRenderer();

        renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMapEnabled = true;

        const orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
        orbitControls.update();

        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 5;
        //camera.lookAt(scene.position);

        
		loadModel();
        // add the output of the renderer to the html element
        document.body.appendChild(renderer.domElement);

        var material = new THREE.MeshPhongMaterial({color: 0xffd991});

        var path = '/assets/cubemap/';
	    var ext = '.jpg';
        var urls = [ path + 'posx' + ext, path + 'negx' + ext,
        path + 'posy' + ext, path + 'negy' + ext,
        path + 'posz' + ext, path + 'negz' + ext ];
        var reflectionCube = new THREE.ImageUtils.loadTextureCube(urls);

        reflectionCube.format = THREE.RGBFormat;
        scene.background = reflectionCube;
        // call the render function
        var step = 0;


		
        var gui = new dat.GUI();

        material.envMap = reflectionCube;
        material.metal = 1.0;
	    material.roughness = 1.0;
        gui.add(material, 'metal', 0, 1);
	    gui.add(material, 'roughness', 0, 1);
      //  gui.add(controls, 'rotationSpeed', 0, 0.5);
        //gui.add(controls, 'addCube');
        //gui.add(controls, 'removeCube');
        //gui.add(controls, 'outputObjects');
        //gui.add(controls, 'numberOfObjects').listen();

        render();

        function render() {
            stats.update();


            // render using requestAnimationFrame
            requestAnimationFrame(render);
           orbitControls.update();
            renderer.render(scene, camera);
        }

        function initStats() {

            var stats = new Stats();

            stats.setMode(0); // 0: fps, 1: ms

            // Align top-left
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.left = '0px';
            stats.domElement.style.top = '0px';

            document.body.appendChild(stats.domElement);

            return stats;
        }

		function loadModel()
		{

        var loader = new THREE.STLLoader();
        var fileButton = document.getElementById("fileButton");
        fileButton.addEventListener('change', function(e){
    
            var tmppath = URL.createObjectURL(e.target.files[0]);
           
			loader.load(tmppath, function (geometry) {
           
            group = new THREE.Mesh(geometry, material);
            group.material = material;
            scene.add(group);
        });
    
    });
		}
       

        const light = CreateDirectionLight(1);
        light.position.y = 2;
        light.position.x = 2;
        light.position.z = 2;
        scene.add(light);

    }
    window.onload = init

    function CreateDirectionLight(internsity) {

        var light  = new THREE.DirectionalLight(0xffffff, internsity);
        light.castShadow = true;
        return light;
    }