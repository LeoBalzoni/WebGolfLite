class Ball{
    body; //Physic and visible body of the ball
    arrowPivot;
    arrow;
    arrowDir;
    trail;
    constructor(scene){
        this.body = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 0.6}, scene)
        this.body.receiveShadows = true;
        this.body.physicsImpostor = new BABYLON.PhysicsImpostor(
            this.body,
            BABYLON.PhysicsImpostor.SphereImpostor,
            { mass: 1, friction:0, restitution: 1 },
            scene);
        this.body.physicsImpostor.physicsBody.linearDamping = 0.5;
        this.body.position.y = 3;

        this.body.physicsImpostor.registerBeforePhysicsStep((e)=>{
            this.arrowPivot.position = this.body.position;
            if(!this.body.physicsImpostor){return;}
            let velocity = this.body.physicsImpostor.getLinearVelocity().length();
            
            if(velocity <= 0.18){
                setTimeout(()=>{
                    if(!this.body.physicsImpostor){return;}
                    let velocity = this.body.physicsImpostor.getLinearVelocity().length();
                    if(velocity <= 0.18){
                        this.arrow.setEnabled(true);
                        const q = BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(135));
                        const m = new BABYLON.Matrix();
                        q.toRotationMatrix(m);
                        const v2 = BABYLON.Vector3.TransformCoordinates(this.getDirectionArrow(), m);
                        player.mesh.position = this.body.position.add(v2).add(new BABYLON.Vector3(0, 3, 0));
                    }
                }, 1000);
            } else {
                this.arrow.setEnabled(false);
            }

            if (velocity > 0.4){
                this.trail.start();
            } else {
                this.trail.stop();
            }
            
        });

        //Pivot for the direction arrow with parent the body
        this.arrowPivot = new BABYLON.TransformNode("arrowPivot");

        const greenMat = new BABYLON.StandardMaterial("greenMat", scene);
        greenMat.diffuseColor = new BABYLON.Color3(0, 1, 0);
        greenMat.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
        greenMat.emissiveColor = new BABYLON.Color3(0, 0, 0);
        greenMat.ambientColor = new BABYLON.Color3(0, 1, 0);
        //The directionArrow
        this.arrow = BABYLON.MeshBuilder.CreateCylinder("directionArrow", {height: 1.5, diameterBottom: 0.1, diameterTop: 0.1}, scene );
        this.arrow.material = greenMat;
        this.arrow.parent = this.arrowPivot;
        this.arrow.position.x += 0.5;
        this.arrow.rotate(BABYLON.Axis.Z, -Math.PI/2, BABYLON.Space.LOCAL);
        this.arrow.setEnabled(false);

        this.arrowDir = BABYLON.MeshBuilder.CreateCylinder("arrowDir", {height: 0.65, diameterBottom: 0.25, diameterTop: 0}, scene );
        this.arrowDir.position.y += 0.9;
        this.arrowDir.parent = this.arrow;
        this.arrowDir.material = greenMat;

        this.body.material = new BABYLON.StandardMaterial("mat1", scene);
        this.body.actionManager = new BABYLON.ActionManager(scene);

        this.trail =  new BABYLON.ParticleSystem("particles", 1000, scene);
        this.setupTrail(this.trail);
    }

    rotateArrow(direction){
        if(!this.arrow.isEnabled()){
            return;
        }

        direction === 'cw' ?
            this.arrowPivot.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(5), BABYLON.Space.LOCAL) :
            this.arrowPivot.rotate(BABYLON.Axis.Y, -BABYLON.Tools.ToRadians(5), BABYLON.Space.LOCAL);

        direction === 'cw' ?
            player.mesh.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(5), BABYLON.Space.LOCAL) :
            player.mesh.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(-5), BABYLON.Space.LOCAL);

        const q = BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(135));
        const m = new BABYLON.Matrix();
        q.toRotationMatrix(m);
        const v2 = BABYLON.Vector3.TransformCoordinates(this.getDirectionArrow(), m);
        player.mesh.position = this.body.position.add(v2).add(new BABYLON.Vector3(0, 3, 0));
    }

    toggleArrow(){
        this.arrow.setEnabled(!this.arrow.isEnabled());
    }

    applyImpulse(impulseVector, applyPointVector){
        if(!this.arrow.isEnabled()){
            return;
        }
        if(!impulseVector){
            impulseVector = new BABYLON.Vector3(0, 0, 0);
        }

        let pointOfApplication =  this.body.getAbsolutePosition();
        if(applyPointVector){
            pointOfApplication.add(applyPointVector);
        }

        this.body.physicsImpostor.applyImpulse(impulseVector, pointOfApplication);
    }

    getDirectionArrow(){
        return this.arrowDir.absolutePosition.subtract(this.body.position);
    }

    resetPos(hole){
        ball.body.physicsImpostor.setLinearVelocity(new BABYLON.Vector3.Zero());
        ball.body.physicsImpostor.setAngularVelocity(new BABYLON.Vector3.Zero());

        if (hole === "Hole1") {
            ball.body.position = new BABYLON.Vector3(-8, 1, 0);
        }
        if (hole === "Hole2") {
            ball.body.position = new BABYLON.Vector3(-12, 1, 0);
        }
        if (hole === "Hole3") {
            ball.body.position = new BABYLON.Vector3(-13, 3, 0);
        }
    }

    setColor(color){
        if(!color){
            return;
        }
        this.body.material.diffuseColor = color;
        this.body.material.ambientColor = color;
    }

    setupTrail(particleSystem){
        particleSystem.particleTexture = new BABYLON.Texture("./Assets/flare.png", scene);
        particleSystem.emitter = BABYLON.Vector3.Zero(); // the starting position
        particleSystem.minEmitBox = new BABYLON.Vector3(-0.25, -0.25, -0.25); // Bottom Left Front
        particleSystem.maxEmitBox = new BABYLON.Vector3(0.20, 0.20, 0.20); // Top Right Back
        particleSystem.color1 = new BABYLON.Color4(1, 0.8, 0, 1.0);
        particleSystem.color2 = new BABYLON.Color4(1, 0, 0, 1.0);
        particleSystem.colorDead = new BABYLON.Color4(0.2, 0, 0.2, 0.0);
        particleSystem.emitRate = 300;
        particleSystem.minSize = 0.1;
        particleSystem.maxSize = 0.2;
        particleSystem.createConeEmitter(0.1, Math.PI / 3);
        particleSystem.maxLifeTime = 0.6;
        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        particleSystem.minLifeTime = 0.3;
        particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);
        particleSystem.direction1 = new BABYLON.Vector3(7, 0, 0);
        particleSystem.direction2 = new BABYLON.Vector3(7, 0, -3);
        particleSystem.minAngularSpeed = 0;
        particleSystem.maxAngularSpeed = Math.PI / 2;
        particleSystem.minEmitPower = 1;
        particleSystem.maxEmitPower = 2;
        particleSystem.updateSpeed = 0.008;
        particleSystem.emitter = this.body;
        particleSystem.start();
    }

    setupActionOnIntersectionEnterTrigger(otherMesh, callback){
        ball.body.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
            trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
            parameter: { mesh: otherMesh }
        }, callback ));
    }

    setupActionOnIntersectionExitTrigger(otherMesh, callback){
        ball.body.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
            trigger: BABYLON.ActionManager.OnIntersectionExitTrigger,
            parameter: { mesh: otherMesh }
        }, callback ));
    }

    dispose(){
        if(this.body && this.body.actionManager){
            this.body.actionManager.dispose();
        }
    }


}