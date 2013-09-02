(function(){
    window.engine=(function(){
        function engine(canvasID, fps){
            var self=this;

            this.canvas=document.getElementById(canvasID);
            this.context=this.canvas.getContext("2d");
            this.fps=fps;
            this.frame=1000/this.fps;
            this.mainGameLoop=null;

            this.objects=[];

            this.mousePos={x:0,y:0};
            this.lastKeyDown=this.lastKeyUp=null;

            this.onKeyDown=this.onKeyPress=this.onKeyUp=null;
            this.pressingKey=false;
            this.keyDownTimer=null;

            this.MOUSE_LEFT=1;
            this.MOUSE_MIDDLE=2;
            this.MOUSE_RIGHT=3;

            this.globalMouseDownFunction=null;

            document.onmousemove=function(e){
                self.mousePos.x= e.clientX;
                self.mousePos.y= e.clientY;
            };

            document.onkeydown=function(e){
                self.lastKeyDown= e.which;

                if (self.pressingKey==false){

                }

                //self.keyDownTimer = setTimeout(function(){
                    self.pressingKey=true;

                    for (var i= 0, _len=self.objects.length; i<_len; i++){
                        if (self.objects[i]){
                            if (self.objects[i].onKeyDownFunction){
                                self.objects[i].onKeyDownFunction(e.which);
                            }
                        }
                    }
                //}, 10);
            };

            document.onkeyup = function(e){
                self.pressingKey=false;
                self.lastKeyUp= e.which;
                clearTimeout(self.keyDownTimer);
            };

            document.onmousedown=function(e){
                self.globalMouseDownFunction && self.globalMouseDownFunction(e.which);

                for (var i= 0, _len=self.objects.length; i<_len; i++){
                    if (self.objects[i]){
                        if (self.objects[i].onMousePressFunction){
                            if (self.objects[i].isWithinBoundingBox(self.getMousePos().x, self.getMousePos().y)){
                                self.objects[i].onMousePressFunction(e.which);
                            }
                        }
                    }
                }
            };

            document.onmouseup=function(e){

            };

            document.onmouseover=function(e){

            };

            document.onmouseout=function(e){

            };
        }

        engine.prototype.isInt=function(x){
            return ((typeof x !== 'number') || (x % 1 !== 0)) ? false : true;
        };

        engine.prototype.drawSprite=function(sprite, x, y){
            sprite.draw(this.context, x, y);
        };

        engine.prototype.createObject=function(sprite, x, y){
            var o=new Object(sprite, x, y);
            this.objects.push(o);
            return o;
        };

        engine.prototype.main=function(logic){
            var self=this;
            setInterval(function(){
                self.redraw();

                for (var i= 0, _len=self.objects.length; i<_len; i++){
                    if (self.objects[i]){
                        if (self.objects[i].destroyed==true){
                            //self.objects.splice(i, 1);
                            delete self.objects[i];
                        }else{
                            self.objects[i].draw(self.context);
                        }
                    }
                }

                logic();
            }, this.frame);
        };

        engine.prototype.redraw=function(){
            this.context.clearRect(0, 0, 500, 500);
        };

        engine.prototype.getMousePos=function(relativeToCanvas){
            if (relativeToCanvas==null){
                relativeToCanvas=true;
            }

            if (relativeToCanvas){
                return {
                    x: this.mousePos.x-this.getCanvasPos().x,
                    y: this.mousePos.y-this.getCanvasPos().y
                };
            }else{
                return this.mousePos;
            }
        };

        engine.prototype.getCanvasPos=function(){
            return {
                x: this.canvas.offsetLeft,
                y: this.canvas.offsetTop
            };
        };

        engine.prototype.onMouseDown=function(f){
            this.globalMouseDownFunction=f;
        };

        return engine;
    })();
}).call(this);