const guiInit = (scene, guiElements)=>{
    return BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
}

const guiInitGame = (scene, guiElements)=>{
    if(!guiElements){
        guiElements = {};
    }
    if(guiElements.manager){
        guiElements.manager.dispose();
    }
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);

    guiElements['slider'] = new BABYLON.GUI.ImageBasedSlider();
    var slider = guiElements['slider'];
    slider.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    slider.isEnabled = false;
    slider.minimum = 0;
    slider.maximum = 100;
    slider.value = 0;
    slider.height = "30px";
    slider.width = "220px";
    slider.top = "-10px";
    slider.backgroundImage = new BABYLON.GUI.Image("back", "./Assets/sliderBack.png");
    slider.valueBarImage = new BABYLON.GUI.Image("value", "./Assets/sliderFront.png");
    advancedTexture.addControl(slider);

    guiElements['ballHits'] = new BABYLON.GUI.TextBlock();
    var title = guiElements['ballHits'];
    title.text = 'Hits: 0';
    title.color = 'white';
    title.outlineColor = 'black';
    title.outlineWidth = 4;
    title.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    title.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    title.fontSize = 24;
    title.paddingTop = '10px';
    title.paddingLeft = '20px';
    title.fontWeight = 'bold';
    advancedTexture.addControl(title);

    guiElements['btn_goToMenu'] = BABYLON.GUI.Button.CreateSimpleButton("but", "Go to menu");
    var button = guiElements['btn_goToMenu'];
    button.width = 0.2;
    button.height = "40px";
    button.color = "white";
    button.background = "green";
    button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    advancedTexture.addControl(button);
    button.onPointerUpObservable.add(async function () {
        advancedTexture.dispose();
        ui = guiElements = {};
        ui.manager = guiInitMenu(sceneManager.getActiveScene(), ui);
        await sceneManager.changeScene('menu');
    });

    guiElements['cont_victory'] = new BABYLON.GUI.Rectangle();
    var container = guiElements['cont_victory'];
    container.width = 0.5;
    container.height = 0.5;
    container.cornerRadius = 3;
    container.color = '#C7C7C7';
    container.thickness = 2;
    container.background = '#FFFBF5';
    container.alpha = 1;
    advancedTexture.addControl(container); 

    guiElements['title_victory'] = new BABYLON.GUI.TextBlock();
    title = guiElements['title_victory'];
    title.text = "You Won!!!";
    title.color = "#FFDB29";
    title.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    title.outlineWidth = 13;
    title.outlineColor = '#FF9500';
    title.fontSize = 50;
    title.paddingTop = '40px';
    title.fontWeight = 'bold';
    guiElements['cont_victory'].addControl(title);
    
    guiElements['score_victory'] = new BABYLON.GUI.TextBlock();
    title = guiElements['score_victory'];
    title.text = `You completed all the holes in ${0} hits.`;
    title.color = "black";
    title.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    title.fontSize = 30;
    title.paddingTop = '40px';
    title.fontWeight = 'bold';
    guiElements['cont_victory'].addControl(title);
    
    guiElements['score_best'] = new BABYLON.GUI.TextBlock();
    title = guiElements['score_best'];
    title.text = `Your best score is ${0}.`;
    title.color = "black";
    title.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    title.fontSize = 30;
    title.paddingTop = '120px';
    title.fontWeight = 'bold';
    guiElements['cont_victory'].addControl(title);

    guiElements['btn_goToMenuVictory'] = BABYLON.GUI.Button.CreateSimpleButton("btn_goToMenuVictory", "Back to Main Menu");
    button = guiElements['btn_goToMenuVictory'];
    button.width = 0.3;
    button.height = "90px";
    button.color = "white";
    button.background = "green";
    button.fontSize = '30px';
    button.paddingTop = '20px';
    button.paddingBottom = '20px';
    button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    guiElements['cont_victory'].addControl(button);
    button.onPointerUpObservable.add( async function () {
        advancedTexture.dispose();
        ui = guiElements = {};
        ui.manager = guiInitMenu(sceneManager.getActiveScene(), ui);
        sceneManager.currentHole = 'hole1';
        totalScore = 0;
        hits = 0;
        await sceneManager.changeScene('menu');
    });

    guiElements['cont_victory'].isVisible = false;

    return advancedTexture;
}


const guiInitMenu = (scene, guiElements)=>{

    if(!guiElements){
        guiElements = {};
    }
    if(guiElements.manager){
        guiElements.manager.dispose();
        guiElements.manager = null;
    }
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
    
    guiElements['cont_mainMenu'] = new BABYLON.GUI.Rectangle();
    var container = guiElements['cont_mainMenu'];
    container.width = 1;
    container.height = 1;
    container.cornerRadius = 3;
    container.color = '#C7C7C7';
    container.thickness = 2;
    container.background = '#FAFFEB';
    container.alpha = 1;
    advancedTexture.addControl(container); 

    var image = new BABYLON.GUI.Image("but", "./Assets/bg.jpg");
    image.width = 1;
    image.height = 1;
    guiElements['cont_mainMenu'].addControl(image);

    guiElements['title_menu'] = new BABYLON.GUI.TextBlock();
    var title = guiElements['title_menu'];
    title.text = "WebGolfLite";
    title.color = "#FFDB29";
    title.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    title.outlineWidth = 13;
    title.outlineColor = '#FF9500';
    title.fontSize = 50;
    title.paddingTop = '40px';
    title.fontWeight = 'bold';
    guiElements['cont_mainMenu'].addControl(title);
    
    //inner rectangle
    guiElements['cont_buttons'] = new BABYLON.GUI.Rectangle();
    container = guiElements['cont_buttons'];
    container.width = 0.4;
    container.height = 0.6;
    container.cornerRadius = 3;
    container.color = '#C7C7C7';
    container.thickness = 2;
    container.background = '#FFFBF5';
    container.alpha = 1;
    guiElements['cont_mainMenu'].addControl(container);

    guiElements['panel_buttons'] = new BABYLON.GUI.StackPanel();
    var container = guiElements['panel_buttons'];
    container.cornerRadius = 3;
    container.thickness = 15;
    container.color = 'black';
    guiElements['cont_buttons'].addControl(container);


    guiElements['btn_goToGame'] = BABYLON.GUI.Button.CreateSimpleButton("btn_goToGame", "Go to game");
    var button = guiElements['btn_goToGame'];
    button.width = 0.7;
    button.height = "110px";
    button.color = "white";
    button.background = "green";
    button.fontSize = '35px';
    button.paddingTop = '30px';
    button.paddingBottom = '30px';
    button.textBlock.resizeToFit = true;
    guiElements['panel_buttons'].addControl(button);
    button.onPointerUpObservable.add(async function () {
        advancedTexture.dispose();
        ui = guiElements = {};
        ui.manager = guiInitGame(sceneManager.getActiveScene(), ui);
        await sceneManager.changeScene('game');
    });

    guiElements['btn_difficulty'] = BABYLON.GUI.Button.CreateSimpleButton("btn_difficulty", "Difficulty");
    button = guiElements['btn_difficulty'];
    button.width = 0.6;
    button.height = "90px";
    button.color = "white";
    button.background = "green";
    button.fontSize = '30px';
    button.paddingTop = '20px';
    button.paddingBottom = '20px';
    guiElements['panel_buttons'].addControl(button);
    button.onPointerUpObservable.add(function () {
        guiMenuDifficulty(guiElements);
    });

    guiElements['btn_options'] = BABYLON.GUI.Button.CreateSimpleButton("btn_options", "Options");
    button = guiElements['btn_options'];
    button.width = 0.6;
    button.height = "90px";
    button.color = "white";
    button.background = "green";
    button.fontSize = '30px';
    button.paddingTop = '20px';
    button.paddingBottom = '20px';
    guiElements['panel_buttons'].addControl(button);
    button.onPointerUpObservable.add(function () {
        guiMenuOptions(guiElements);
    });


    guiElements['btn_chooseHat'] = BABYLON.GUI.Button.CreateSimpleButton("btn_chooseHat", "Choose Hat");
    var button = guiElements['btn_chooseHat'];
    button.width = 0.6;
    button.height = "110px";
    button.color = "white";
    button.background = "green";
    button.fontSize = '35px';
    button.paddingTop = '30px';
    button.paddingBottom = '30px';
    guiElements['panel_buttons'].addControl(button);
    button.onPointerUpObservable.add(async function () {
        guiChooseHat(guiElements);
    });

    guiElements['btn_info'] = BABYLON.GUI.Button.CreateImageOnlyButton("btn_info", "./Assets/questionMark.png");
    button = guiElements['btn_info'];
    button.width = '100px';
    button.height = '100px';
    button.thickness = 0;
    button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    button.horizontalAlignment  = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    button.paddingTop = '20px';
    button.paddingLeft = '20px';
    guiElements['cont_buttons'].addControl(button);
    button.onPointerUpObservable.add(async function () {
        guiHelper(guiElements);
    });

    
    return advancedTexture;
}

const guiMenuDifficulty = (guiElements)=>{
    
    guiElements['panel_buttons'].isVisible = false;
    guiElements['btn_info'].isVisible = false;

    guiElements['panel_buttons_difficulty'] = new BABYLON.GUI.StackPanel();
    var container = guiElements['panel_buttons_difficulty'];
    container.cornerRadius = 3;
    container.thickness = 15;
    container.color = 'black';
    guiElements['cont_buttons'].addControl(container);

    guiElements['btn_difficulty_easy'] = BABYLON.GUI.Button.CreateSimpleButton("but", "Easy");
    var button = guiElements['btn_difficulty_easy'];
    button.width = 0.4;
    button.height = "110px";
    button.color = "white";
    button.background = "green";
    button.fontSize = '35px';
    button.paddingTop = '30px';
    button.paddingBottom = '30px';
    guiElements['panel_buttons_difficulty'].addControl(button);
    button.onPointerUpObservable.add(async function () {
        globalOption.difficulty = 'easy';
        guiElements['panel_buttons_difficulty'].dispose();
        guiElements['panel_buttons'].isVisible = true;
        guiElements['btn_info'].isVisible = true;
    });


    guiElements['btn_difficulty_hard'] = BABYLON.GUI.Button.CreateSimpleButton("but", "Hard");
    var button = guiElements['btn_difficulty_hard'];
    button.width = 0.4;
    button.height = "110px";
    button.color = "white";
    button.background = "green";
    button.fontSize = '35px';
    button.paddingTop = '30px';
    button.paddingBottom = '30px';
    guiElements['panel_buttons_difficulty'].addControl(button);
    button.onPointerUpObservable.add(async function () {
        globalOption.difficulty = 'hard';
        guiElements['panel_buttons_difficulty'].dispose();
        guiElements['panel_buttons'].isVisible = true;
        guiElements['btn_info'].isVisible = true;
    });
}

const guiMenuOptions = (guiElements) => {
    guiElements['panel_buttons'].isVisible = false;
    guiElements['btn_info'].isVisible = false;

    guiElements['panel_buttons_options'] = new BABYLON.GUI.StackPanel();
    var container = guiElements['panel_buttons_options'];
    container.cornerRadius = 3;
    container.height = 0.9;
    container.thickness = 15;
    container.color = 'black';
    guiElements['cont_buttons'].addControl(container);

    guiElements['panel_options_volume_txt'] = new BABYLON.GUI.TextBlock();
    var label = guiElements['panel_options_volume_txt']
    label.text = `Volume (current: ${globalOption.volume*100})`;
    label.height = "30px";
    label.color = "black";
    guiElements['panel_buttons_options'].addControl(label); 

    guiElements['panel_options_volume_slider'] = new BABYLON.GUI.Slider();
    var slider = guiElements['panel_options_volume_slider'];
    slider.minimum = 0;
    slider.maximum = 100;
    slider.step = 1;
    slider.value = globalOption.volume*100;
    slider.height = "20px";
    slider.width = "200px";
    slider.displayThumb = false;
    slider.background = 'green';
    slider.color = 'orange';
    slider.borderColor = 'green';
    slider.barOffset = '20px';
    slider.onValueChangedObservable.add(function(value) {
        guiElements['panel_options_volume_txt'].text = `Volume (current: ${value})`;
        globalOption.volume = value/100;
        for(let sound in sounds){
            sounds[sound] ? sounds[sound].setVolume (globalOption.volume) : null;
        }
    });
    guiElements['panel_buttons_options'].addControl(slider);

    guiElements['panel_options_ballColor'] = new BABYLON.GUI.TextBlock();
    var label = guiElements['panel_options_ballColor']
    label.text = "Choose the color of the ball";
    label.height = "60px";
    label.color = "black";
    label.paddingTop = '30px';
    guiElements['panel_buttons_options'].addControl(label); 

    guiElements['panel_options_ballColor_picker'] = new BABYLON.GUI.ColorPicker();
    var picker = guiElements['panel_options_ballColor_picker'];
    picker.height = "150px";
    picker.width = "150px";
    picker.onValueChangedObservable.add(function(value) {
        globalOption.ballColor = value;
        if(ball)ball.setColor(value);
    });
    guiElements['panel_buttons_options'].addControl(picker); 


    guiElements['panel_options_shadows_txt'] = new BABYLON.GUI.TextBlock();
    let txt = 'medium';
    if(globalOption.shadowQuality/512 === 1){ txt = 'low' }
    else if(globalOption.shadowQuality/512 === 3){ txt = 'high'}
    var label = guiElements['panel_options_shadows_txt']
    label.text = `Select shadows quality (current: ${txt})`;
    label.height = "30px";
    label.color = "black";
    guiElements['panel_buttons_options'].addControl(label); 

    guiElements['panel_options_shadow_slider'] = new BABYLON.GUI.Slider();
    var slider = guiElements['panel_options_shadow_slider'];
    slider.minimum = 1;
    slider.maximum = 3;
    slider.step = 1;
    slider.value = globalOption.shadowQuality/512;
    slider.height = "20px";
    slider.width = "200px";
    slider.displayThumb = false;
    slider.background = 'green';
    slider.color = 'orange';
    slider.borderColor = 'green';
    slider.barOffset = '20px';
    slider.onValueChangedObservable.add(function(value) {
        let txt = 'medium';
        if(value === 1){ txt = 'low' }
        else if(value === 3){ txt = 'high'}
        guiElements['panel_options_shadows_txt'].text = `Select shadows quality (current: ${txt})`;
        globalOption.shadowQuality = value * 512;
    });
    guiElements['panel_buttons_options'].addControl(slider);


    guiElements['panel_options_close'] = BABYLON.GUI.Button.CreateSimpleButton("panel_options_close", "Close");
    var button = guiElements['panel_options_close'];
    button.width = 0.4;
    button.height = "110px";
    button.color = "white";
    button.background = "green";
    button.fontSize = '35px';
    button.paddingTop = '30px';
    button.paddingBottom = '30px';
    guiElements['panel_buttons_options'].addControl(button);
    button.onPointerUpObservable.add(async function () {
        guiElements['panel_buttons_options'].dispose();
        guiElements['panel_buttons'].isVisible = true;
        guiElements['btn_info'].isVisible = true;
    });   
}

const guiHelper = (guiElements) => {
    guiElements['panel_buttons'].isVisible = false;
    guiElements['btn_info'].isVisible = false;

    guiElements['panel_buttons_helper'] = new BABYLON.GUI.StackPanel();
    var container = guiElements['panel_buttons_helper'];
    container.cornerRadius = 3;
    container.thickness = 15;
    container.color = 'black';
    guiElements['cont_buttons'].addControl(container);

    guiElements['panel_helper_text'] = new BABYLON.GUI.TextBlock();
    var text = guiElements['panel_helper_text']
    text.height = '130px';
    text.text = 'To play the game use the \'A\' and \'D\' keys to direction the ball. \n To control the power hold the \'SPACE\' key and release it to hit the ball.\n If the ball is stucked press \'R\' to reset the position of the ball.\n \'Left click\' rotates the camera,\n  \'Right click\' pans it and \'Scroll wheel\' zooms.\n\n';
    text.resizeToFit = true;
    text.lineSpacing = '1px';
    text.color = "black";
    guiElements['panel_buttons_helper'].addControl(text);

    guiElements['panel_helper_close'] = BABYLON.GUI.Button.CreateSimpleButton("but", "Close");
    var button = guiElements['panel_helper_close'];
    button.width = 0.4;
    button.height = "110px";
    button.color = "white";
    button.background = "green";
    button.fontSize = '35px';
    button.paddingTop = '30px';
    button.paddingBottom = '30px';
    button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    guiElements['panel_buttons_helper'].addControl(button);
    button.onPointerUpObservable.add(async function () {
        guiElements['panel_buttons_helper'].dispose();
        guiElements['panel_buttons'].isVisible = true;
        guiElements['btn_info'].isVisible = true;
    });

}

const guiChooseHat = (guiElements)=>{
    guiElements['panel_buttons'].isVisible = false;
    guiElements['btn_info'].isVisible = false;

    guiElements['cont_hats'] = new BABYLON.GUI.Rectangle();
    var container = guiElements['cont_hats'];
    container.width = 1;
    container.height = 1;
    container.color = '#C7C7C7';
    container.background = '#F3FBF5';
    container.alpha = 1;
    guiElements['cont_buttons'].addControl(container); 

    guiElements['hats_grid'] = new BABYLON.GUI.Grid(); 
    var grid  =  guiElements['hats_grid'];
    grid.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    grid.width = 1;
    grid.height = 0.9;
    grid.addColumnDefinition(0.15);
    grid.addColumnDefinition(0.25);
    grid.addColumnDefinition(0.25);
    grid.addColumnDefinition(0.15);
    grid.addRowDefinition(0.25);
    grid.addRowDefinition(0.25);
    grid.addRowDefinition(0.25);
    grid.addRowDefinition(0.25); 
    guiElements['cont_hats'].addControl(grid);
    
    guiElements['panel_options_hat1'] = BABYLON.GUI.Button.CreateImageOnlyButton("panel_options_hat1", "./Assets/topHat.png");
    var button = guiElements['panel_options_hat1'];
    button.width = 1;
    button.height = 1;
    guiElements['hats_grid'].addControl(button, 1 ,1 );
    button.onPointerUpObservable.add(async function () {
        globalOption.playerHat = 'topHat';
        guiElements['cont_hats'].dispose();
        guiElements['panel_buttons'].isVisible = true;
        guiElements['btn_info'].isVisible = true;
    });

    guiElements['panel_options_hat2'] = BABYLON.GUI.Button.CreateImageOnlyButton("panel_options_hat1", "./Assets/wizardHat.png");
    button = guiElements['panel_options_hat2'];
    button.width = 1;
    button.height = 1;
    guiElements['hats_grid'].addControl(button, 1 ,2 );
    button.onPointerUpObservable.add(async function () {
        globalOption.playerHat = 'wizardHat';
        guiElements['cont_hats'].dispose();
        guiElements['panel_buttons'].isVisible = true;
        guiElements['btn_info'].isVisible = true;
    });

    guiElements['choose_hat_close'] = BABYLON.GUI.Button.CreateSimpleButton("choose_hat_close", "Close");
    var button = guiElements['choose_hat_close'];
    button.width = 0.4;
    button.height = "85px";
    button.color = "white";
    button.background = "green";
    button.fontSize = '35px';
    button.paddingTop = '30px';
    button.paddingBottom = '5px';
    button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    guiElements['cont_hats'].addControl(button);
    button.onPointerUpObservable.add(async function () {
        guiElements['cont_hats'].dispose();
        guiElements['panel_buttons'].isVisible = true;
        guiElements['btn_info'].isVisible = true;
    });
}

const guiVictory = (guiElements, newBest)=>{
    guiElements['score_victory'].text = `You completed all the holes in ${totalScore} hits.`;
    guiElements['cont_victory'].isVisible = true;
    if(newBest){
        guiElements['score_best'].text = 'This is a new best score!!!';
    } else {
        guiElements['score_best'].text = `Your best score is ${bestScore}.`
    }
}
