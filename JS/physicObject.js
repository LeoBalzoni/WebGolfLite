var nextPhysicObj = 0;
class PhysicObject{
    meshes = [];
    body;

    constructor(meshes, body){
        this.meshes = meshes;
        this.body = body;
        if(this.body){
            subscribeFn['physicObj'+nextPhysicObj] = () => {
                this.meshes.forEach( mesh => {
                    mesh.position = this.body.position;
                });
            }
        }
        nextPhysicObj++;
    }

    rotate(angle){
        if(this.body)this.body.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(angle));
        this.meshes.forEach( mesh => {
            mesh.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(-angle));
        });
    }

    move(newPosition){
        //this.body.position = newPosition;
    }
}