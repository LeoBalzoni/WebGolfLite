class SceneManager{
    scenes = {};
    activeScene = 'menu';
    creationFn;
    currentHole = 'hole1';
    constructor(creationFn){
        this.creationFn = creationFn;
    }

    async init(initialScene = 'menu'){
        this.scenes[initialScene] = await this.creationFn[initialScene]();
    }

    async changeScene(sceneName){
        //reset hit counter
        ui['ballHits'] ? ui['ballHits'].text = 'Hits: 0' : null;
        hits = 0;
        if(ball){ ball.dispose() };
        //dispose current scene
        this.scenes[this.activeScene].disablePhysicsEngine();
        await this.scenes[this.activeScene].dispose();
        //load next scene
        setTimeout(async () => {
            this.activeScene = sceneName;
            this.scenes[this.activeScene] = await this.creationFn[this.activeScene]();
        }, 100);
        
        
    }

    renderScene(){
        if(this.scenes[this.activeScene]){
            try{
                this.scenes[this.activeScene].render();
            } catch(err){
            }
        }
    }

    setCreationFn(functions){
        this.creationFn = functions;
    }

    getActiveScene(){
        return this.scenes[this.activeScene];
    }

}

