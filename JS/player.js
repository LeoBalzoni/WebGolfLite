const hatSettings = {
    topHat: { y: 0.25, scaling: 0.4 },
    wizardHat: { y: 0.35, scaling: 0.8}
}
class Player{

    skeletons = [];
    animations = [];
    mesh;
    hats = [];
    constructor(scene){

        
    }

    async init(scene){
        var matSkin = new BABYLON.StandardMaterial("matSkin", scene);
        matSkin.diffuseColor = new BABYLON.Color3(0.97,0.7,0.64);
        matSkin.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
        matSkin.ambientColor = new BABYLON.Color3(0.97,0.7,0.64);

        var matShirt = new BABYLON.StandardMaterial("matShirt", scene);
        matShirt.diffuseColor = new BABYLON.Color3(1,0.17,0.22);
        matShirt.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
        matShirt.ambientColor = new BABYLON.Color3(1,0.17,0.22);

        var matPants = new BABYLON.StandardMaterial("matPants", scene);
        matPants.diffuseColor = new BABYLON.Color3(0.17,0.49,1);
        matPants.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
        matPants.ambientColor = new BABYLON.Color3(0.17,0.49,1);

        var matShoes = new BABYLON.StandardMaterial("matShoes", scene);
        matShoes.diffuseColor = new BABYLON.Color3(0.43,0.43,0.43);
        matShoes.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
        matShoes.ambientColor = new BABYLON.Color3(0.43,0.43,0.43);

        var matHat = new BABYLON.StandardMaterial("matHat", scene);
        matHat.diffuseColor = new BABYLON.Color3(0.18,0.18,0.18);
        matHat.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
        matHat.ambientColor = new BABYLON.Color3(0.18,0.18,0.18);

        var chest = BABYLON.MeshBuilder.CreateBox('player_chest', {size: 1, width: 1, height: 1.5, depth: 0.75}, scene);
        chest.position.y = 4;
        chest.material = matShirt;
        chest.rotation.y = Math.PI;
        var neck = BABYLON.MeshBuilder.CreateBox('player_neck', {width: 0.3, height: 0.35, depth: 0.3}, scene);
        neck.position.y = 0.80;
        neck.parent = chest;
        neck.material = matSkin;
        var head = BABYLON.MeshBuilder.CreateSphere("player_head", {diameter: 0.7, diameterY: 0.9}, scene);
        head.position.y = neck.position.y - 0.4;
        head.parent = neck;
        head.material = matSkin;
        
        var hatPos = new BABYLON.TransformNode('hatPos', scene);
        hatPos.position.y = 0.35;
        hatPos.parent = head;
        
        let hatToLoad = globalOption.playerHat;
        let hatParams = hatSettings[hatToLoad];
        if(hatToLoad && hatParams){
            hatPos.position.y = hatParams.y;
            var hatModel = await loadMesh('./Models/'+ hatToLoad +'.glb');
            hatModel.meshes.forEach( m => {
                m.scaling.scaleInPlace(hatParams.scaling);
                m.parent = hatPos;
            });
        }

        /* var hatModel = await loadMesh('./Models/wizardHat.glb');
            hatModel.meshes.forEach( m => {
                m.scaling.scaleInPlace(0.8);
                m.parent = hatPos;
            }); */
        /* var hat = BABYLON.MeshBuilder.CreateBox('player_hat', {size: 0.75, width: 0.75, height: 0.20, depth: 0.75}, scene);
        hat.parent = hatPos;
        hat.material = matHat;
        var hatTop = BABYLON.MeshBuilder.CreateBox('player_hatTop', {size: 0.75, width: 0.55, height: 0.55, depth: 0.55}, scene);
        hatTop.position.y = 0.35;
        hatTop.parent = hat;
        hatTop.material = matHat;
        this.hats.push(hat);

        var hat2 = BABYLON.MeshBuilder.CreateBox('player_hat2', {size: 0.75, width: 0.90, height: 0.20, depth: 0.90}, scene);
        hat2.parent = hatPos;
        hat2.material = matHat;
        var hatTop2 = BABYLON.MeshBuilder.CreateBox('player_hatTop2', {size: 0.75, width: 0.7, height: 0.25, depth: 0.7}, scene);
        hatTop2.position.y = 0.25;
        hatTop2.parent = hat2;
        hatTop2.material = matHat;
        this.hats.push(hat2);
        hat2.isVisible = false;
        hatTop2.isVisible = false; */

        var leftArmJoint = BABYLON.MeshBuilder.CreateSphere("player_leftArmJoint", {diameter: 0.5}, scene);
        leftArmJoint.parent = chest;
        leftArmJoint.position.x = 0.70;
        leftArmJoint.position.y = 0.55;
        leftArmJoint.material = matShirt;
        var upperLeftArm = BABYLON.MeshBuilder.CreateBox("player_upperLeftArm", {size: 0.5, width: 0.5, height: 1, depth: 0.5}, scene);
        upperLeftArm.position.y = -0.5;
        upperLeftArm.parent = leftArmJoint;
        upperLeftArm.material = matShirt;

        var leftElbow = BABYLON.MeshBuilder.CreateSphere("player_leftElbow", {diameter: 0.35}, scene);
        leftElbow.parent = upperLeftArm;
        leftElbow.position.y = -0.5;
        leftElbow.material = matSkin;

        var bottomLeftArm = BABYLON.MeshBuilder.CreateBox("player_bottomLeftArm", {size: 0.3, width: 0.3, height: 1, depth: 0.3}, scene);
        bottomLeftArm.position.y = -0.5;
        bottomLeftArm.parent = leftElbow;
        bottomLeftArm.material = matSkin;

        var rightArmJoint = BABYLON.MeshBuilder.CreateSphere("player_rightArmJoint", {diameter: 0.5}, scene);
        rightArmJoint.parent = chest;
        rightArmJoint.position.x = -0.70;
        rightArmJoint.position.y = 0.55;
        rightArmJoint.material = matShirt;
        var upperRightArm = BABYLON.MeshBuilder.CreateBox("player_upperRightArm", {size: 0.5, width: 0.5, height: 1, depth: 0.5}, scene);
        upperRightArm.position.y = -0.5;
        upperRightArm.parent = rightArmJoint;
        upperRightArm.material = matShirt;

        var rightElbow = BABYLON.MeshBuilder.CreateSphere("player_rightElbow", {diameter: 0.35}, scene);
        rightElbow.parent = upperRightArm;
        rightElbow.position.y = -0.5;
        rightElbow.material = matSkin;

        var bottomRightArm = BABYLON.MeshBuilder.CreateBox("player_bottomRightArm", {size: 0.3, width: 0.3, height: 1, depth: 0.3}, scene);
        bottomRightArm.position.y = -0.5;
        bottomRightArm.parent = rightElbow;
        bottomRightArm.material = matSkin;

        var batHandle = BABYLON.MeshBuilder.CreateBox("player_batHandle", {size: 0.3, width: 0.1, height: 2.2, depth: 0.1}, scene);
        batHandle.position.y = -1.1;
        batHandle.parent = bottomRightArm;
        batHandle.material = matShoes;

        var batHead = BABYLON.MeshBuilder.CreateBox("player_batHead", {size: 0.3, width: 0.2, height: 0.2, depth: 0.70}, scene);
        batHead.position.y = -1.1;
        batHead.position.z = -0.20;
        batHead.parent = batHandle;
        batHead.material = matShoes;

        var upperRightLeg = BABYLON.MeshBuilder.CreateBox("player_upperRightLeg", {size: 0.4, width: 0.4, height: 1.5, depth: 0.4}, scene);
        upperRightLeg.position.x = -0.25;
        upperRightLeg.position.y = -1.5;
        upperRightLeg.parent = chest;
        upperRightLeg.material = matPants;
        var bottomRightLeg = BABYLON.MeshBuilder.CreateBox("player_bottomRightLeg", {size: 0.3, width: 0.3, height: 1, depth: 0.3}, scene);
        bottomRightLeg.position.y = -1.2;
        bottomRightLeg.parent = upperRightLeg;
        bottomRightLeg.material = matSkin;

        var upperLeftLeg = BABYLON.MeshBuilder.CreateBox("player_upperLeftLeg", {size: 0.4, width: 0.4, height: 1.5, depth: 0.4}, scene);
        upperLeftLeg.position.x = 0.25;
        upperLeftLeg.position.y = -1.5;
        upperLeftLeg.parent = chest;
        upperLeftLeg.material = matPants;
        var bottomLeftLeg = BABYLON.MeshBuilder.CreateBox("player_bottomLeftLeg", {size: 0.3, width: 0.3, height: 1, depth: 0.3}, scene);
        bottomLeftLeg.position.y = -1.2;
        bottomLeftLeg.parent = upperLeftLeg;
        bottomLeftLeg.material = matSkin;


        var rightShoe = BABYLON.MeshBuilder.CreateBox("player_rightShoe", {size: 0.5, width: 0.4, height: 0.3, depth: 0.70}, scene);
        rightShoe.position.z = -0.15;
        rightShoe.position.y = -0.4;
        rightShoe.parent = bottomRightLeg;
        rightShoe.material = matShoes;

        var leftShoe = BABYLON.MeshBuilder.CreateBox("player_leftShoe", {size: 0.5, width: 0.4, height: 0.3, depth: 0.70}, scene);
        leftShoe.position.z = -0.15;
        leftShoe.position.y = -0.4;
        leftShoe.parent = bottomLeftLeg;
        leftShoe.material = matShoes;

        this.mesh = chest;
        this.skeletons = {
            'chest': chest,
            'neck': neck,
            'head': head,
            'hatPos': hatPos,
            'leftArmJoint': leftArmJoint,
            'upperLeftArm':upperLeftArm,
            'bottomLeftArm': bottomLeftArm,
            'rightArmJoint': rightArmJoint,
            'upperRightArm': upperRightArm,
            'bottomRightArm': bottomRightArm,
            'upperRightLeg': upperRightLeg,
            'bottomRightLeg': bottomRightLeg,
            'upperLeftLeg': upperLeftLeg,
            'bottomLeftLeg': bottomLeftLeg,
            'rightShoe': rightShoe,
            'leftShoe': leftShoe,
            'batHandle': batHandle,
            'rightElbow': rightElbow,
            'leftElbow': leftElbow
        };

        this.positionAtStart();
        return;
    }

    positionAtStart(scene, root) {
        //var gui = new dat.GUI();


        var chestRot = new function() {
            this.chest = "";
            this.x = 0;
            this.y = 0;
            this.z = 0;
        };
        var alphaC=0 , betaC=0, gammaC=0;
        let chest = this.skeletons['chest'];
        chest.rotationQuaternion = new BABYLON.Quaternion(0, 1, 0, 0);

        /*
        gui.add(chestRot, 'chest');
        gui.add(chestRot, 'x', 0, 1).step(0.01).onChange( (v) => {
            alphaC = v * 2 * Math.PI;
            chest.rotationQuaternion = BABYLON.Quaternion.FromEulerVector(new BABYLON.Vector3(alphaC, betaC, gammaC));
        } );
        gui.add(chestRot, 'y', 0, 1).step(0.01).onChange( (v) => {
            betaC = v * 2 * Math.PI;
            chest.rotationQuaternion = BABYLON.Quaternion.FromEulerVector(new BABYLON.Vector3(alphaC, betaC, gammaC));
        } );
        gui.add(chestRot, 'z', 0, 1).step(0.01).onChange( (v) => {
            gammaC = v * 2 * Math.PI;
            chest.rotationQuaternion = BABYLON.Quaternion.FromEulerVector(new BABYLON.Vector3(alphaC, betaC, gammaC));
            console.log(chest.rotationQuaternion);
        } );*/


        var neckRot = new function() {
            this.neck = "";
            this.x = 0;
            this.y = 0;
            this.z = 0;
        };
        var alphaN=0 , betaN=0, gammaN=0;
        let neck = this.skeletons['neck'];
        neck.rotationQuaternion = new BABYLON.Quaternion(0.187, 0, 0, -1);

        /*
        gui.add(neckRot, 'neck');
        gui.add(neckRot, 'x', 0, 1).step(0.01).onChange( (v) => {
            alphaN = v * 2 * Math.PI;
            neck.rotationQuaternion = BABYLON.Quaternion.FromEulerVector(new BABYLON.Vector3(alphaN, betaN, gammaN));
        } );
        gui.add(neckRot, 'y', 0, 1).step(0.01).onChange( (v) => {
            betaN = v * 2 * Math.PI;
            neck.rotationQuaternion = BABYLON.Quaternion.FromEulerVector(new BABYLON.Vector3(alphaN, betaN, gammaN));
        } );
        gui.add(neckRot, 'z', 0, 1).step(0.01).onChange( (v) => {
            gammaN = v * 2 * Math.PI;
            neck.rotationQuaternion = BABYLON.Quaternion.FromEulerVector(new BABYLON.Vector3(alphaN, betaN, gammaN));
            console.log(neck.rotationQuaternion);
        } );*/


        var leftArmJointRot = new function() {
            this.ShoulderL = "";
            this.x = 0;
            this.y = 0;
            this.z = 0;
        };
        var alphaSL=0 , betaSL=0, gammaSL=0;
        let leftArmJoint = this.skeletons['leftArmJoint'];
        leftArmJoint.rotationQuaternion = new BABYLON.Quaternion(-0.184, -0.035, 0.184, -0.964);

        /*
        gui.add(leftArmJointRot, 'ShoulderL');
        gui.add(leftArmJointRot, 'x', 0, 1).step(0.01).onChange( (v) => {
            alphaSL = v * 2 * Math.PI;
            leftArmJoint.rotationQuaternion = BABYLON.Quaternion.FromEulerVector(new BABYLON.Vector3(alphaSL, betaSL, gammaSL));
        } );
        gui.add(leftArmJointRot, 'y', 0, 1).step(0.01).onChange( (v) => {
            betaSL = v * 2 * Math.PI;
            leftArmJoint.rotationQuaternion = BABYLON.Quaternion.FromEulerVector(new BABYLON.Vector3(alphaSL, betaSL, gammaSL));
        } );
        gui.add(leftArmJointRot, 'z', 0, 1).step(0.01).onChange( (v) => {
            gammaSL = v * 2 * Math.PI;
            leftArmJoint.rotationQuaternion = BABYLON.Quaternion.FromEulerVector(new BABYLON.Vector3(alphaSL, betaSL, gammaSL));
            console.log(leftArmJoint.rotationQuaternion);
        } );*/


        var rightArmJointRot = new function() {
            this.ShoulderR = "";
            this.x = 0;
            this.y = 0;
            this.z = 0;
        };
        var alphaSR=0 , betaSR=0, gammaSR=0;
        let rightArmJoint = this.skeletons['rightArmJoint'];
        rightArmJoint.rotationQuaternion = new BABYLON.Quaternion(0.155, -0.029, 0.154, 0.975);

        /*
        gui.add(rightArmJointRot, 'ShoulderR');
        gui.add(rightArmJointRot, 'x', 0, 1).step(0.01).onChange( (v) => {
            alphaSR = v * 2 * Math.PI;
            rightArmJoint.rotationQuaternion = BABYLON.Quaternion.FromEulerVector(new BABYLON.Vector3(alphaSR, betaSR, gammaSR));
        } );
        gui.add(rightArmJointRot, 'y', 0, 1).step(0.01).onChange( (v) => {
            betaSR = v * 2 * Math.PI;
            rightArmJoint.rotationQuaternion = BABYLON.Quaternion.FromEulerVector(new BABYLON.Vector3(alphaSR, betaSR, gammaSR));
        } );
        gui.add(rightArmJointRot, 'z', 0, 1).step(0.01).onChange( (v) => {
            gammaSR = v * 2 * Math.PI;
            rightArmJoint.rotationQuaternion = BABYLON.Quaternion.FromEulerVector(new BABYLON.Vector3(alphaSR, betaSR, gammaSR));
            console.log(rightArmJoint.rotationQuaternion);
        } );*/


        var leftElbowRot = new function() {
            this.ElbowL = "";
            this.x = 0;
            this.y = 0;
            this.z = 0;
        };
        var alphaEL=0 , betaEL=0, gammaEL=0;
        let elbowL = this.skeletons['leftElbow'];
        elbowL.rotationQuaternion = new BABYLON.Quaternion(0, 0, 0, 0);

        /*
        gui.add(leftElbowRot, 'ElbowL');
        gui.add(leftElbowRot, 'x', 0, 1).step(0.01).onChange( (v) => {
            alphaEL = v * 2 * Math.PI;
            elbowL.rotationQuaternion = BABYLON.Quaternion.FromEulerVector(new BABYLON.Vector3(alphaEL, betaEL, gammaEL));
        } );
        gui.add(leftElbowRot, 'y', 0, 1).step(0.01).onChange( (v) => {
            betaEL = v * 2 * Math.PI;
            elbowL.rotationQuaternion = BABYLON.Quaternion.FromEulerVector(new BABYLON.Vector3(alphaEL, betaEL, gammaEL));
        } );
        gui.add(leftElbowRot, 'z', 0, 1).step(0.01).onChange( (v) => {
            gammaEL = v * 2 * Math.PI;
            elbowL.rotationQuaternion = BABYLON.Quaternion.FromEulerVector(new BABYLON.Vector3(alphaEL, betaEL, gammaEL));
            console.log(elbowL.rotationQuaternion);
        } );*/


        var rightElbowRot = new function() {
            this.ElbowR = "";
            this.x = 0;
            this.y = 0;
            this.z = 0;
        };
        var alphaER=0 , betaER=0, gammaER=0;
        let elbowR = this.skeletons['rightElbow'];
        elbowL.rotationQuaternion = new BABYLON.Quaternion(0, 0, 0, 0);

        /*
        gui.add(rightElbowRot, 'ElbowR');
        gui.add(rightElbowRot, 'x', 0, 1).step(0.01).onChange( (v) => {
            alphaER = v * 2 * Math.PI;
            elbowR.rotationQuaternion = BABYLON.Quaternion.FromEulerVector(new BABYLON.Vector3(alphaER, betaER, gammaER));
        } );
        gui.add(rightElbowRot, 'y', 0, 1).step(0.01).onChange( (v) => {
            betaER = v * 2 * Math.PI;
            elbowR.rotationQuaternion = BABYLON.Quaternion.FromEulerVector(new BABYLON.Vector3(alphaER, betaER, gammaER));
        } );
        gui.add(rightElbowRot, 'z', 0, 1).step(0.01).onChange( (v) => {
            gammaER = v * 2 * Math.PI;
            elbowR.rotationQuaternion = BABYLON.Quaternion.FromEulerVector(new BABYLON.Vector3(alphaER, betaER, gammaER));
            console.log(elbowR.rotationQuaternion);
        } );

         */
    }


    hit_SL_0 = new BABYLON.Quaternion(-0.184, -0.035, 0.184, -0.964);
    hit_SL_1 = new BABYLON.Quaternion(0.093, -0.015, 0.156, 0.983);
    hit_SL_2 = new BABYLON.Quaternion(-0.184, -0.035, 0.184, -0.964);
    hit_SL_3 = new BABYLON.Quaternion(-0.515, -0.149, 0.236, -0.810);
    hit_SL_4 = new BABYLON.Quaternion(-0.184, -0.035, 0.184, -0.964);

    hit_SR_0 = new BABYLON.Quaternion(0.155, -0.029, 0.154, 0.975);
    hit_SR_1 = new BABYLON.Quaternion(0.473, -0.187, 0.316, 0.800);
    hit_SR_2 = new BABYLON.Quaternion(0.155, -0.029, 0.154, 0.975);
    hit_SR_3 = new BABYLON.Quaternion(-0.482, 0, 0, -0.876);
    hit_SR_4 = new BABYLON.Quaternion(0.155, -0.029, 0.154, 0.975);

    hit_C_0 = new BABYLON.Quaternion(0, 1, 0, 0);
    hit_C_1 = new BABYLON.Quaternion(0, 0.968, 0, 0.248);
    hit_C_2 = new BABYLON.Quaternion(0, 1, 0, 0);
    hit_C_3 = new BABYLON.Quaternion(0, 0.975, 0, -0.218);
    hit_C_4 = new BABYLON.Quaternion(0, 1, 0, 0);

    hit_N_0 = new BABYLON.Quaternion(0.187, 0, 0, -1);
    hit_N_1 = new BABYLON.Quaternion(0.231, -0.357, -0.092, -0.900);
    hit_N_2 = new BABYLON.Quaternion(0.167, -0.446, -0.085, -0.875);
    hit_N_3 = new BABYLON.Quaternion(0.167, -0.446, -0.085, -0.875);
    hit_N_4 = new BABYLON.Quaternion(0.187, 0, 0, -1);

    hit_EL_0 = new BABYLON.Quaternion(0, 0, 0, 0);
    hit_EL_1 = new BABYLON.Quaternion(0.77, 0, 0, 0.637);
    hit_EL_2 = new BABYLON.Quaternion(0, 0, 0, 0);
    hit_EL_3 = new BABYLON.Quaternion(-0.029, -0.012, 0.367, -0.929);
    hit_EL_4 = new BABYLON.Quaternion(0, 0, 0, 0);

    hit_ER_0 = new BABYLON.Quaternion(0, 0, 0, 0);
    hit_ER_1 = new BABYLON.Quaternion(0, 0, 0.156, 0.988);
    hit_ER_2 = new BABYLON.Quaternion(0, 0, 0, 0);
    hit_ER_3 = new BABYLON.Quaternion(0.231, -0.247, -0.644, 0.685);
    hit_ER_4 = new BABYLON.Quaternion(0, 0, 0, 0);

    startAnimation(scene, root) {
        let leftArmJoint = this.skeletons['leftArmJoint'];
        let rightArmJoint = this.skeletons['rightArmJoint'];
        let chest = this.skeletons['chest'];
        let neck = this.skeletons['neck'];
        let leftElbow = this.skeletons['leftElbow'];
        let rightElbow = this.skeletons['rightElbow'];

        var animationSL = new BABYLON.Animation("animationSL", "rotationQuaternion", 60, BABYLON.Animation.ANIMATIONTYPE_QUATERNION, BABYLON.Animation.ANIMATION);
        var animationSR = new BABYLON.Animation("animationSR", "rotationQuaternion", 60, BABYLON.Animation.ANIMATIONTYPE_QUATERNION, BABYLON.Animation.ANIMATION);
        var animationC = new BABYLON.Animation("animationC", "rotationQuaternion", 60, BABYLON.Animation.ANIMATIONTYPE_QUATERNION, BABYLON.Animation.ANIMATION);
        var animationN = new BABYLON.Animation("animationD", "rotationQuaternion", 60, BABYLON.Animation.ANIMATIONTYPE_QUATERNION, BABYLON.Animation.ANIMATION);
        var animationEL = new BABYLON.Animation("animationEL", "rotationQuaternion", 60, BABYLON.Animation.ANIMATIONTYPE_QUATERNION, BABYLON.Animation.ANIMATION);
        var animationER = new BABYLON.Animation("animationER", "rotationQuaternion", 60, BABYLON.Animation.ANIMATIONTYPE_QUATERNION, BABYLON.Animation.ANIMATION);

        // Animation keys
        var keysSL = [];
        keysSL.push({ frame: 0, value: this.hit_SL_0 });
        keysSL.push({ frame: 80, value: this.hit_SL_1 });
        keysSL.push({ frame: 100, value: this.hit_SL_2 });
        keysSL.push({ frame: 130, value: this.hit_SL_3 });
        keysSL.push({ frame: 200, value: this.hit_SL_4 });

        var keysSR = [];
        keysSR.push({ frame: 0, value: this.hit_SR_0 });
        keysSR.push({ frame: 80, value: this.hit_SR_1 });
        keysSR.push({ frame: 100, value: this.hit_SR_2 });
        keysSR.push({ frame: 130, value: this.hit_SR_3 });
        keysSR.push({ frame: 200, value: this.hit_SR_4 });

        var keysC = [];
        keysC.push({ frame: 0, value: this.mesh.rotationQuaternion });
        keysC.push({ frame: 80, value: this.mesh.rotationQuaternion });
        keysC.push({ frame: 100, value: this.mesh.rotationQuaternion });
        keysC.push({ frame: 130, value: this.mesh.rotationQuaternion });
        keysC.push({ frame: 200, value: this.mesh.rotationQuaternion });

        var keysN = [];
        keysN.push({ frame: 0, value: this.hit_N_0 });
        keysN.push({ frame: 80, value: this.hit_N_1 });
        keysN.push({ frame: 100, value: this.hit_N_2 });
        keysN.push({ frame: 130, value: this.hit_N_3 });
        keysN.push({ frame: 200, value: this.hit_N_4 });

        var keysEL = [];
        keysEL.push({ frame: 0, value: this.hit_EL_0 });
        keysEL.push({ frame: 80, value: this.hit_EL_1 });
        keysEL.push({ frame: 100, value: this.hit_EL_2 });
        keysEL.push({ frame: 130, value: this.hit_EL_3 });
        keysEL.push({ frame: 200, value: this.hit_EL_4 });

        var keysER = [];
        keysER.push({ frame: 0, value: this.hit_ER_0 });
        keysER.push({ frame: 80, value: this.hit_ER_1 });
        keysER.push({ frame: 100, value: this.hit_ER_2 });
        keysER.push({ frame: 130, value: this.hit_ER_3 });
        keysER.push({ frame: 200, value: this.hit_ER_4 });


        animationSL.setKeys(keysSL);
        leftArmJoint.animations.push(animationSL);
        scene.beginAnimation(leftArmJoint, 0, 200, false);
        animationSR.setKeys(keysSR);
        rightArmJoint.animations.push(animationSR);
        scene.beginAnimation(rightArmJoint, 0, 200, false);
        animationC.setKeys(keysC);
        chest.animations.push(animationC);
        scene.beginAnimation(chest, 0, 200, false);
        animationN.setKeys(keysN);
        neck.animations.push(animationN);
        scene.beginAnimation(neck, 0, 200, false);
        animationEL.setKeys(keysEL);
        leftElbow.animations.push(animationEL);
        scene.beginAnimation(leftElbow, 0, 200, false);
        animationER.setKeys(keysER);
        rightElbow.animations.push(animationER);
        scene.beginAnimation(rightElbow, 0, 200, false);

    }

    changeHat(){
        this.hats[0].isVisible = false;
        this.hats[0]._children.forEach(c => c.isVisible = false);

        this.hats[1].isVisible = true;
        this.hats[1]._children.forEach(c => c.isVisible = true);
    }
}