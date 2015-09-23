var MyBox=cc.Sprite.extend({
    touchListener:null,
    star:false,
    alive:false,
    disapear:null,
    onEnter:function () {
        this._super();
        this.alive=true;
        this.disapear=this.createDisappearAction();
        this.addTouchEventListenser();
    },
    onExit:function () {
       // this.disappearAction.release();
        this._super();
    },
    createDisappearAction : function() {
        var frames = [];
        for (var i = 0; i < 11; i++) {
            var str = "sushi_1n_"+i+".png"
            //cc.log(str);
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            frames.push(frame);
        }

        var animation = new cc.Animation(frames, 0.02);
        var action = new cc.Animate(animation);

        return action;
    },
    addTouchEventListenser:function(){
        var fa = this;
        this.touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch,event) {
                var target = event.getCurrentTarget();
                var pos = touch.getLocation();
                if ( cc.rectContainsPoint(target.getBoundingBox(),pos)) {
                    target.removeTouchEventListenser();
                    //响应精灵点中
                    target.stopAllActions();
                    fa.getParent().addscore();
                    var actionDisapear = cc.MoveTo.create(0.5,cc.p(-20,-20));
                    target.runAction(cc.Sequence.create(actionDisapear,cc.CallFunc.create(function(){
                        fa.alive=false;
                    })));
                    return true;
                }
                return false;
            }
        });

        cc.eventManager.addListener(this.touchListener,this);
    },
    removeTouchEventListenser:function(){
        cc.eventManager.removeListener(this.touchListener);
    }
});
var MyLayer = cc.Layer.extend({
    bg:null,
    boxes:null,
    score:null,
    timeout:null,
    timeoutLabel:null,
    scorelabel:null,
    touchListener:null,
    star:null,
    showstar:null,
    onEnter:function () {
        this._super();
        this.addTouchEventListenser();
    },
    init:function () {
        this._super();
        this.boxes=[];
        this.score=0;
        this.timeout=60;
        var size = cc.director.getWinSize();
        this.bg=new cc.Sprite(bg);
        this.bg.setAnchorPoint(0,0);
        this.bg.setPosition(0,0);
        this.addChild(this.bg);
        this.star = new cc.Sprite(starimg);
        this.star.setScale(0.1);
        this.star.setAnchorPoint(0.5,0.5);
        this.schedule(this.addBox,0.8);
        this.scoreLabel = new cc.LabelTTF("score:0", "Arial", 20);
        this.scoreLabel.attr({
            x:size.width / 2 + 100,
            y:size.height - 20
        });
        this.showstar=false;
        this.addChild(this.scoreLabel, 5);
        this.timeoutLabel = cc.LabelTTF.create("Time:" + this.timeout, "Arial", 18);
        this.timeoutLabel.x = 60;
        this.timeoutLabel.y = size.height - 20;
        this.addChild(this.timeoutLabel, 5);
        this.schedule(this.subtime,1);
        return true;
    },
    addscore:function(){
        this.score++;
        this.scoreLabel.setString("score:" + this.score);
    },
    subtime:function(){
        this.timeout--;
        this.timeoutLabel.setString("Time:" + this.timeout);
        if (this.timeout==0) {
            this.getParent().restart();
        }
    },
    addTouchEventListenser:function(){
        var fa = this;
        this.touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch,event) {
                var pos = touch.getLocation();
               // var target = event.getCurrentTarget();
                fa.star.setPosition(pos);
                fa.removeChild(fa.star);
                fa.addChild(fa.star);
                setTimeout(function(){fa.removeChild(fa.star,true);},20);
                return  false;
            }
        });

        cc.eventManager.addListener(this.touchListener,this);
    },
    removeTouchEventListenser:function(){
        cc.eventManager.removeListener(this.touchListener);
    },
    addBox:function(){
        var num=Math.floor(Math.random()*8);
        if  (num==8) num=0;
        num++;
        switch (num){
            case 1:
                var box= new MyBox(box1img);
                break;
            case 2:
                var box= new MyBox(box2img);
                break;
            case 3:
                var box= new MyBox(box3img);
                break;
            case 4:
                var box= new MyBox(box4img);
                break;
            case 5:
                var box= new MyBox(box5img);
                break;
            case 6:
                var box= new MyBox(box6img);
                break;
            case 7:
                var box= new MyBox(box7img);
                break;
            case 8:
                var box= new MyBox(box8img);
                break;
        }
        box.setAnchorPoint(0.5,0.5);
        box.setScale(0.2);
        var winSize = cc.director.getWinSize();
        var minX = box.getContentSize().width/10;
        var maxX = winSize.width - box.getContentSize().width/10;
        var rangeX = maxX - minX;
        var actualX = Math.random() * rangeX + minX;
        var minSpeed = 2.5;
        var maxSpeed = 5;
        var rangeSpeed = maxSpeed - minSpeed;
        var actualSpeed = Math.random() * rangeSpeed + minSpeed;
        box.setPosition(cc.p(actualX, winSize.height + box.getContentSize().height/10));

        var actionMove = cc.MoveTo.create(actualSpeed ,cc.p(actualX, 0 - box.getContentSize().height/5));
        var actionMoveDone = cc.CallFunc.create(this.spriteMoveFinished,this);
        box.runAction(cc.Sequence.create(actionMove,actionMoveDone));

        this.addChild(box);
        this.boxes.push(box);
    },
    spriteMoveFinished:function(sprite){
        // 将元素移除出Layer
        sprite.alive=false;
        for (var i=this.boxes.length-1;i>=0;i--){
            if(this.boxes[i].alive==false){
                this.removeChild(this.boxes[i], true);
                this.boxes.splice(i,1);
            }
        }
    }
});

var MyScene = cc.Scene.extend({
    layer:null,
    onEnter:function () {
        this._super();
        this.layer = new MyLayer();
        this.addChild(this.layer);
        this.layer.init();
    },
    restart:function(){
        this.removeChild(this.layer);
        this.layer = new MyLayer();
        this.addChild(this.layer);
        this.layer.init();
    }
});
