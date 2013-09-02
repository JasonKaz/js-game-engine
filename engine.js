(function(){
    window.engine=(function(){
        function engine(canvasID, fps){
            var self=this;

            this.canvas=document.getElementById(canvasID);
            this.context=this.canvas.getContext("2d");
            this.fps=fps;
            this.frame=1000/this.fps;

            this.objects=[];

            this.mousePos={x:0,y:0};

            this.holdingKey=false;
            this.globalKeyPressFunction=this.globalKeyDownFunction=this.globalKeyUpFunction==null;

            this.holdingMouse=false;
            this.globalMousePressFunction=this.globalMouseDownFunction=this.globalMouseUpFunction=null;

            this.mouse_keys={
                MOUSE_LEFT  : 1,
                MOUSE_MIDDLE: 2,
                MOUSE_RIGHT : 3
            };

            function fireObjectsOnKeyDown(e){
                for (var i= 0, _len=self.objects.length; i<_len; i++){
                    if (self.objects[i]){
                        if (self.objects[i].onKeyDownFunction){
                            self.objects[i].onKeyDownFunction(e.which);
                        }
                    }
                }
            }

            function fireObjectsOnKeyPress(e){
                for (var i= 0, _len=self.objects.length; i<_len; i++){
                    if (self.objects[i]){
                        if (self.objects[i].onKeyPressFunction){
                            self.objects[i].onKeyPressFunction(e.which);
                        }
                    }
                }
            }

            function fireObjectsOnKeyUp(e){
                for (var i= 0, _len=self.objects.length; i<_len; i++){
                    if (self.objects[i]){
                        if (self.objects[i].onKeyUpFunction){
                            self.objects[i].onKeyUpFunction(e.which);
                        }
                    }
                }
            }

            function fireObjectsOnMouseDown(e){
                for (var i= 0, _len=self.objects.length; i<_len; i++){
                    if (self.objects[i]){
                        if (self.objects[i].onMouseDownFunction && self.objects[i].isWithinBoundingBox(self.getMousePos().x, self.getMousePos().y)){
                            self.objects[i].onMouseDownFunction(e.which);
                        }
                    }
                }
            }

            function fireObjectsOnMousePress(e){
                for (var i= 0, _len=self.objects.length; i<_len; i++){
                    if (self.objects[i]){
                        if (self.objects[i].onMousePressFunction && self.objects[i].isWithinBoundingBox(self.getMousePos().x, self.getMousePos().y)){
                            self.objects[i].onMousePressFunction(e.which);
                        }
                    }
                }
            }

            function fireObjectsOnMouseUp(e){
                for (var i= 0, _len=self.objects.length; i<_len; i++){
                    if (self.objects[i]){
                        if (self.objects[i].onMouseUpFunction && self.objects[i].isWithinBoundingBox(self.getMousePos().x, self.getMousePos().y)){
                            self.objects[i].onMouseUpFunction(e.which);
                        }
                    }
                }
            }

            document.onmousemove=function(e){
                self.mousePos.x= e.clientX;
                self.mousePos.y= e.clientY;
            };

            document.onkeydown=function(e){
                if (self.holdingKey==false){
                    self.globalKeyPressFunction && self.globalKeyPressFunction(e.which);
                    self.globalKeyDownFunction && self.globalKeyDownFunction(e.which);

                    fireObjectsOnKeyPress(e);
                    fireObjectsOnKeyDown(e);

                    self.holdingKey=true;
                }else{
                    self.globalKeyDownFunction && self.globalKeyDownFunction(e.which);

                    fireObjectsOnKeyDown(e);
                }
            };

            document.onkeyup = function(e){
                self.globalKeyUpFunction && self.globalKeyUpFunction(e.which);

                fireObjectsOnKeyUp(e);

                self.holdingKey=false;
            };

            document.onmousedown=function(e){
                if (self.holdingMouse==false){
                    self.globalMousePressFunction && self.globalMousePressFunction(e.which);
                    self.globalMouseDownFunction && self.globalMouseDownFunction(e.which);

                    fireObjectsOnMousePress(e);
                    fireObjectsOnMouseDown(e);

                    self.holdingMouse=true;
                }else{
                    self.globalMouseDownFunction && self.globalMouseDownFunction(e.which);

                    fireObjectsOnMousePress(e);
                }
            };

            document.onmouseup=function(e){
                self.globalMouseUpFunction && self.globalMouseUpFunction(e.which);

                fireObjectsOnMouseUp(e);

                self.holdingMouse=false;
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
                //Clear the screen
                self.redraw();

                //Execute user logic
                logic();

                //Loop through all created objects
                for (var i= 0, _len=self.objects.length; i<_len; i++){
                    if (self.objects[i]){
                        if (self.objects[i].destroyed==true){
                            //'Destroy' the object if necessary
                            delete self.objects[i];
                        }else{
                            //Draw active objects
                            self.objects[i].draw(self.context);
                        }
                    }
                }
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

        /*
            Global event handlers
         */
        engine.prototype.onMouseDown=function(f){
            this.globalMouseDownFunction=f;
            return this;
        };

        engine.prototype.onMousePress=function(f){
            this.globalMousePressFunction=f;
            return this;
        };

        engine.prototype.onMouseUp=function(f){
            this.globalMouseUpFunction=f;
            return this;
        };

        engine.prototype.onKeyPress=function(f){
            this.globalKeyPressFunction=f;
            return this;
        };

        engine.prototype.onKeyDown=function(f){
            this.globalKeyDownFunction=f;
            return this;
        };

        engine.prototype.onKeyUp=function(f){
            this.globalKeyUpFunction=f;
            return this;
        };

        return engine;
    })();
}).call(this);
