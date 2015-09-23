cc.game.onStart = function(){
    if(!cc.sys.isNative && document.getElementById("cocosLoading")) //If referenced loading.js, please remove it
        document.body.removeChild(document.getElementById("cocosLoading"));


    var screenSize = cc.view.getFrameSize();
    console.log(cc.EGLView);
    if(!cc.sys.isNative && screenSize.height < 800){
        designSize = cc.size(400, 640);
    }
    cc.loader.resPath = "res/Normal";
    cc.view.setDesignResolutionSize(designSize.width, designSize.height, cc.ResolutionPolicy.SHOW_ALL);

    //load resources
    cc.LoaderScene.preload(g_resources, function () {
        cc.director.runScene(new MyScene());
    }, this);
};
cc.game.run();