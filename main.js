/// <reference path="./babylon.d.ts"/> 
/// <reference path="./babylon.gui.d.ts"/>
/// <reference path="./babylonjs.materials.module.d.ts"/>

var createScene = async function () {
    //Scene
    var scene = new BABYLON.Scene(engine);
    // Enable physics
    scene.enablePhysics(new BABYLON.Vector3(0,-10,0), new BABYLON.CannonJSPlugin());
    // GUI
    ui.manager = guiInitGame(scene, ui);

    //Camera
    camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI/1.3, 1.4, 30, new BABYLON.Vector3(0, 5, 10), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);

    //Sounds
    sounds.ballHitSE = new BABYLON.Sound("ballHit", "./Assets/Sounds/golfHit.wav", scene);
    sounds.ballHitSE.setVolume(globalOption.volume);
    sounds.clapsSE = new BABYLON.Sound("claps", "./Assets/Sounds/claps.wav", scene);
    sounds.clapsSE.setVolume(globalOption.volume);
    sounds.splashSE = new BABYLON.Sound("splash", "./Assets/Sounds/splash.wav", scene);
    sounds.splashSE.setVolume(globalOption.volume);

    //Light
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.05;

    //Meshes
    var ground = BABYLON.Mesh.CreateGround("ground1", 45, 45, 3, scene);
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(
        ground,
        BABYLON.PhysicsImpostor.BoxImpostor,
        { mass: 0, restitution: 0.7 },
        scene);
        ground.receiveShadows = true;

    killField = BABYLON.Mesh.CreateGround("killField", 100, 100, 3, scene);
    killField.position.y = -5;
    killField.isVisible = false;

    player = new Player();
    await player.init(scene);
    await sceneManager.creationFn[sceneManager.currentHole](scene, globalOption.difficulty);

    //Functions
    document.onkeydown = onKeyDownFn;
    document.onkeyup = onKeyUpFn;

    return scene;
};

var createMenuScene = async function () {
    var scene = new BABYLON.Scene(engine);

    //Camera
    var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI/1.3, 1.4, 30, new BABYLON.Vector3(0, 5, 10), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);

    //Light
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    ui.manager = guiInitMenu(scene, ui);
    return scene;
};

var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
var scene, menuScene, activeScene = 'menu';
var player, ball, track, collisionCube, killField, skybox;
var curHole;
var hits = 0, totalScore = 0, bestScore = 99999999;
var loaded = false; var loadedMenu = false;
var keyPressed = {}; 
var globalOption = {difficulty: 'easy', volume: 0.3, ballColor: null, playerHat: 'topHat', shadowQuality: 1024 };//wizardHat topHat
var sounds = { ballHitSE: null, clapsSE: null, splashSE: null };
var hemiLight, pointLight;
var launched = true;

//UI & SCENE MANAGEMENT
var ui = {};
var sceneManager = new SceneManager(
    {
        'menu': createMenuScene,
        'game': createScene,
        'hole1': createHole1,
        'hole2': createHole2,
        'hole3': createHole3
    }
);
sceneManager.init();
//
var subscribeFn = {};
engine.runRenderLoop(function () {
    for(let fn in subscribeFn){
        if(subscribeFn[fn]) subscribeFn[fn]();
    }
    sceneManager.renderScene();
    
});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});

function getBoneByName(mesh, boneName) {
    const skeletonOwner = mesh.getChildMeshes().filter(b => b.skeleton)[0];

    let bones = skeletonOwner.skeleton.bones;
    //skeleton.bones[6].id
    for (let i = 0; i < bones.length; i++) {
        if (bones[i].name === boneName) {
            return bones[i];
        }
    }
}

async function createHole1(scene, diff) {
    curHole = "Hole1";

    var mat = new BABYLON.StandardMaterial("box1", scene);
    mat.alpha = 0.01;

    // Skybox
    skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("./Assets/TropicalSunnyDay", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;
    skybox.rotate(BABYLON.Axis.Y, Math.PI, BABYLON.Space.LOCAL);

    //Track
    var model;
    if(diff === "easy") model = await loadMesh('./Models/pista1.glb', scene);
    if(diff === "hard") model = await loadMesh('./Models/pista1H.glb', scene);
    track = makePhysicsObject(model.meshes, scene, 4);
    track.meshes.forEach(element => {
        element.receiveShadows = true;
    });
    track.body.receiveShadows = true;
    //Light
    hemiLight = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(0.4, -0.6, -0.3), scene);
    hemiLight.intensity = 1;
    hemiLight.position = new BABYLON.Vector3(0, 50, 0);

    //Hole collider
    collisionCube = BABYLON.Mesh.CreateCylinder("collisionCube", 1, 1, 1, 24, 1, scene);
    collisionCube.showBoundingBox = false;
    collisionCube.material = mat;
    collisionCube.position = new BABYLON.Vector3(9, 0, 0);

    //Ball
    ball = new Ball(scene);
    ball.setColor(globalOption.ballColor);
    ball.body.position = new BABYLON.Vector3(-8, 1, 0);
    ball.setupActionOnIntersectionEnterTrigger(collisionCube, ()=>{
        sounds.clapsSE.play();
        setTimeout( getNextHole, 3000);
    });
    ball.setupActionOnIntersectionEnterTrigger(killField, ()=>{
        sounds.splashSE.play();
        ball.resetPos(curHole);
    });

    var shadowGenerator = new BABYLON.ShadowGenerator(globalOption.shadowQuality, hemiLight);
    shadowGenerator.usePoissonSampling = true; 
    shadowGenerator.addShadowCaster(player.mesh);
    shadowGenerator.addShadowCaster(ball.body);
    track.meshes.forEach(element => {
        shadowGenerator.addShadowCaster(element);
    });

    //Water
    var waterMesh = BABYLON.Mesh.CreateGround("waterMesh", 2.5, 8, 8, scene, false);
    var water = new BABYLON.WaterMaterial("water", scene, new BABYLON.Vector2(1024, 1024));
    water.backFaceCulling = true;
    water.bumpTexture = new BABYLON.Texture("./Assets/waterbump.png", scene);
    water.windForce = -2;
    water.waveHeight = 0.03;
    water.bumpHeight = 0.3;
    water.waveLength = 0.3;
    water.colorBlendFactor = 0;
    water.addToRenderList(skybox);
    //water.addToRenderList(track);
    waterMesh.material = water;
    waterMesh.position.y = 0.5;
    waterMesh.position.x = 5.2;

    ball.setupActionOnIntersectionEnterTrigger(waterMesh, ()=>{
        sounds.splashSE.play();
        setTimeout(function () {
            ball.resetPos(curHole);
        }, 500)
    });

}

async function createHole2(scene, diff) {
    curHole = "Hole2";

    var mat = new BABYLON.StandardMaterial("box1", scene);
    mat.alpha = 0.01;

    // Skybox
    skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("./Assets/TropicalSunnyDay", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;
    skybox.rotate(BABYLON.Axis.Y, Math.PI, BABYLON.Space.LOCAL);

    //Track
    var model;
    if(diff === "easy") model = await loadMesh('./Models/pista2.glb', scene);
    if(diff === "hard") model = await loadMesh('./Models/pista2H.glb', scene);
    track = makePhysicsObject(model.meshes, scene, 4);
    track.meshes.forEach(element => {
        element.receiveShadows = true;
    });
    track.body.receiveShadows = true;

    //Light
    hemiLight = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(0.4, -0.6, -0.3), scene);
    hemiLight.intensity = 1;
    hemiLight.position = new BABYLON.Vector3(0, 50, 0);

    //Hole collider
    collisionCube = BABYLON.Mesh.CreateCylinder("collisionCube", 1, 1, 1, 24, 1, scene);
    collisionCube.showBoundingBox = false;
    collisionCube.material = mat;
    collisionCube.position = new BABYLON.Vector3(12, 0, 16.5);

    //Ball
    ball = new Ball(scene);
    ball.setColor(globalOption.ballColor);
    ball.body.position = new BABYLON.Vector3(-12, 1, 0);
    ball.setupActionOnIntersectionEnterTrigger(collisionCube, ()=>{
        sounds.clapsSE.play();
        setTimeout( getNextHole, 3000)
    });
    ball.setupActionOnIntersectionEnterTrigger(killField, ()=>{
        sounds.splashSE.play();
        ball.resetPos(curHole);
    });

    var shadowGenerator = new BABYLON.ShadowGenerator(globalOption.shadowQuality, hemiLight);
    shadowGenerator.usePoissonSampling = true;
    shadowGenerator.addShadowCaster(player.mesh);
    shadowGenerator.addShadowCaster(ball.body);
    track.meshes.forEach(element => {
        shadowGenerator.addShadowCaster(element);
    });

    //Water
    if(diff === "hard") {
        var waterMesh = BABYLON.Mesh.CreateGround("waterMesh", 8, 3, 8, scene, false);
        var water = new BABYLON.WaterMaterial("water", scene, new BABYLON.Vector2(1024, 1024));
        water.backFaceCulling = true;
        water.bumpTexture = new BABYLON.Texture("./Assets/waterbump.png", scene);
        water.windForce = -5;
        water.waveHeight = 0.03;
        water.bumpHeight = 0.3;
        water.waveLength = 0.3;
        water.colorBlendFactor = 0;
        water.addToRenderList(skybox);
        //water.addToRenderList(track);
        waterMesh.material = water;
        waterMesh.position.x = 12;
        waterMesh.position.z = 14;
        waterMesh.position.y = 0.5;

        ball.setupActionOnIntersectionEnterTrigger(waterMesh, ()=>{
            sounds.splashSE.play();
            setTimeout(function () {
                ball.resetPos(curHole);
            }, 500)
        });
    }

}

async function createHole3(scene, diff) {
    curHole = "Hole3";

    var mat = new BABYLON.StandardMaterial("box1", scene);
    mat.alpha = 0.01;

    // Skybox
    skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("./Assets/TropicalSunnyDay", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;
    skybox.rotate(BABYLON.Axis.Y, Math.PI, BABYLON.Space.LOCAL);

    //Track
    var model;
    var pala;
    if(diff === "easy") model = await loadMesh('./Models/pista3.glb', scene);
    if(diff === "hard") model = await loadMesh('./Models/pista3H.glb', scene);
    let trackTemp = makePhysicsObjectMill(model.meshes, scene, 4);
    track = trackTemp.track;
    pala = trackTemp.pala;
    trackTemp = null;
    track.meshes.forEach(element => {
        element.receiveShadows = true;
    });
    track.body.receiveShadows = true;
    pala.meshes.forEach(element => {
        element.receiveShadows = true;
    });

    //Light
    hemiLight = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(0.4, -0.6, -0.3), scene);
    hemiLight.intensity = 1;
    hemiLight.position = new BABYLON.Vector3(0, 50, 0);

    //Hole collider
    collisionCube = BABYLON.Mesh.CreateCylinder("collisionCube", 1, 1, 1, 24, 1, scene);
    collisionCube.showBoundingBox = false;
    collisionCube.material = mat;
    collisionCube.position = new BABYLON.Vector3(13, 0, 0);

    //Ball
    ball = new Ball(scene);
    ball.setColor(globalOption.ballColor);
    ball.body.position = new BABYLON.Vector3(-13, 3, 0);
    ball.setupActionOnIntersectionEnterTrigger(collisionCube, ()=>{
        sounds.clapsSE.play();
        manageVictory();
    });
    ball.setupActionOnIntersectionEnterTrigger(killField, ()=>{
        sounds.splashSE.play();
        ball.resetPos(curHole);
    });

    var shadowGenerator = new BABYLON.ShadowGenerator(globalOption.shadowQuality, hemiLight);
    shadowGenerator.usePoissonSampling = true;
    shadowGenerator.addShadowCaster(player.mesh);
    shadowGenerator.addShadowCaster(ball.body);
    track.meshes.forEach(element => {
        shadowGenerator.addShadowCaster(element);
    });
    pala.meshes.forEach(element => {
        shadowGenerator.addShadowCaster(element);
    });
}

function getNextHole(){
    totalScore += hits;
    let current = sceneManager.currentHole;
    let currentNum = current.substr(4);
    let nextHole = 'hole' + (parseInt(currentNum)+1);
    sceneManager.currentHole = nextHole;
    sceneManager.changeScene("game");
}

function manageVictory(){
    document.onkeydown = null;
    document.onkeyup = null;
    totalScore += hits;
    let newBest = false;
    if(totalScore < bestScore){
        bestScore = totalScore;
        newBest = true;
    }
    guiVictory(ui, newBest);
}