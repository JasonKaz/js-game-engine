(function(){
    window.Object=(function(){
        function Object(sprite, x, y){
            this.x=x;
            this.y=y;
            this.sprite=sprite;
            this.onKeyPressFunction=this.onKeyUpFunction=this.onKeyDownFunction=null;
            this.onMousePressFunction=this.onMouseUpFunction=this.onMouseDownFunction=null;
            this.destroyed=false;
        }

        Object.prototype.draw=function(context){
            this.sprite.draw(context, this.x, this.y);
        };

        Object.prototype.onKeyDown=function(f){
            this.onKeyDownFunction=f;
            return this;
        };

        Object.prototype.onKeyPress=function(f){
            this.onKeyPressFunction=f;
            return this;
        };

        Object.prototype.onKeyUp=function(f){
            this.onKeyUpFunction=f;
            return this;
        };

        Object.prototype.onMousePress=function(f){
            this.onMousePressFunction=f;
        };

        Object.prototype.destroy=function(){
            this.destroyed=true;
        };

        Object.prototype.isWithinBoundingBox=function(x, y){
            return x>=this.x && y>=this.y && x<=this.x+this.sprite.getSize().width && y<=this.y+this.sprite.getSize().height;
        };

        return Object;
    })();
}).call(this);
