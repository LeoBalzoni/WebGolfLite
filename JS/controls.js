const onKeyDownFn = (e) => {
    e = e || window.event;
    var key = e.which || e.keyCode;
    switch (key) {
        case 68: //d
            if(sceneManager.activeScene === 'game'){
                ball.rotateArrow('cw');
            }
            break;
        case 65: //a
            if(sceneManager.activeScene === 'game'){
                ball.rotateArrow('ccw');
            }
            break;
        case 82: //r
            if(sceneManager.activeScene === 'game'){
                ball.resetPos(curHole);
            }
            break;
        case 84: //t
            if(sceneManager.activeScene === 'game'){
                player.changeHat(scene, player.mesh);
                player.startAnimation(sceneManager.getActiveScene(), player.mesh);
            }
            break;
        case 32: //space
            if(sceneManager.activeScene === 'game' && ball.arrow.isEnabled()){
                subscribeFn['powerBar'] = ( (key=32) => {
                    keyPressed[key] = !keyPressed[key] ? performance.now() :  keyPressed[key];
                    ui.slider.value = Math.min(((performance.now() - keyPressed[key] ) / 1000), 1) * 100;
                    if(ui.slider.value >= 100) { 
                        ui.slider.value = 0; 
                        keyPressed[key] = 0; 
                    }
                });
            }
            
            break;
        default:
            break;
    }
};


const onKeyUpFn = (e) => {
    e = e || window.event;
    var key = e.which || e.keyCode;
    switch (key) {
        case 32: //space
            if(sceneManager.activeScene === 'game'){
                if ( !keyPressed[key]  || !launched || !ball.arrow.isEnabled() ) return;
                launched = false;
                subscribeFn['powerBar'] = null;
                var duration = Math.min(((performance.now() - keyPressed[key] ) / 1000), 1) ;
                keyPressed[e.which] = null;
                ui.slider.value = 0;
                let force = ball.getDirectionArrow().scale(20 * duration);
                player.startAnimation(sceneManager.getActiveScene(), player.mesh);
                setTimeout( () => {
                    ball.applyImpulse(force, null);
                    sounds.ballHitSE.play();
                    setTimeout(() => {
                        launched = true;
                    }, 700);
                }, 1800);
                
                hits++;
                ui['ballHits'] ? ui['ballHits'].text = 'Hits: ' + hits : null;
            }

            break;
        default:
            break;  
    }

};