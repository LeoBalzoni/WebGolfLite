//newMeshes = (await BABYLON.SceneLoader.ImportMeshAsync("", "mazza.glb", "", scene)).meshes;

const loadMesh = (path, scene, nameId = "") => {
    return new Promise(async (resolve, reject) => {
        let meshes = (BABYLON.SceneLoader.ImportMeshAsync(nameId, path, "", scene)).then(
            model => {
                resolve(model);
            }
        );
    });
};

const makePhysicsObject = (newMeshes, scene, scaling = 1, objOption = { mass: 0, friction:0, restitution: 0.5 }) => {
    toMerge = [];
    // For all children labeled box (representing colliders), make them invisible and add them as a child of the root object
    newMeshes.forEach((m, i)=>{
        if(m.id != '__root__'){
            m.isVisible = true;
            m.scaling.scaleInPlace(scaling);
            m.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(90));
            toMerge.push(m);
        }
    });

    var combineMesh = BABYLON.Mesh.MergeMeshes(toMerge, false);
    //combineMesh.scaling.scaleInPlace(scaling);
    combineMesh.physicsImpostor = new BABYLON.PhysicsImpostor(
        combineMesh,
        BABYLON.PhysicsImpostor.MeshImpostor,   
        objOption,
        scene
    );
    combineMesh.isVisible = false;
    combineMesh.renderOutline = true;
    return new PhysicObject(toMerge, combineMesh);
};

const loadPlayer = (path, scene, nameId = "") => {
    return new Promise(async (resolve, reject) => {
        let meshes = (BABYLON.SceneLoader.ImportMeshAsync(nameId, path, "", scene)).then(
            model => {
                resolve(model.meshes[1]);
            }
        );
    });
};

const loadMill = (path, scene, nameId = "") => {
    return new Promise(async (resolve, reject) => {
        let meshes = (BABYLON.SceneLoader.ImportMeshAsync(nameId, '../Models/mulino.glb', "", scene)).then(
            model => {
                resolve(model);
            }
        );
    });
};

const makePhysicsObjectMill = (newMeshes, scene, scaling = 1, objOption = { mass: 0, friction:0, restitution: 0.5 }) => {
    var toMerge = [];
    var palaToMerge = [];

    newMeshes.forEach((m, i)=>{
        if (m.id !== '__root__') {

            if(m.id === "Pala_primitive0" || m.id === "Pala_primitive1") {
                m.isVisible = true;
                m.scaling.scaleInPlace(scaling);

               // m.position.y = 30;
                m.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(90));
                palaToMerge.push(m);

                subscribeFn[m.id] = function () {
                    m.rotateAround(new BABYLON.Vector3(-4.4, 10, 0), BABYLON.Axis.X, BABYLON.Tools.ToRadians(-1));
                }

            } else {
                m.isVisible = true;
                m.scaling.scaleInPlace(scaling);
                m.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(90));
                toMerge.push(m);
            }
        }
    });

    var combineMesh = BABYLON.Mesh.MergeMeshes(toMerge, false);
    //combineMesh.scaling.scaleInPlace(scaling);
    combineMesh.physicsImpostor = new BABYLON.PhysicsImpostor(
        combineMesh,
        BABYLON.PhysicsImpostor.MeshImpostor,
        objOption,
        scene
    );
    combineMesh.isVisible = false;
    combineMesh.renderOutline = true;

    var combinePala = BABYLON.Mesh.MergeMeshes(palaToMerge, false);
    //combineMesh.scaling.scaleInPlace(scaling);
    combinePala.physicsImpostor = new BABYLON.PhysicsImpostor(
        combinePala,
        BABYLON.PhysicsImpostor.MeshImpostor,
        objOption,
        scene
    );
    combinePala.isVisible = false;
    subscribeFn[combinePala.id] = function () {
        combinePala.rotateAround(new BABYLON.Vector3(-4.4, 10, 0), BABYLON.Axis.X, BABYLON.Tools.ToRadians(-1));
    };
    combinePala.renderOutline = true;

    return {track: new PhysicObject(toMerge, combineMesh), pala: new PhysicObject(palaToMerge, combinePala)};
};