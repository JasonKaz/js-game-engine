(function(){
    window.Sprite=(function(){
        function Sprite(src){
            this.image=new Image();
            this.image.src=src;

            this.xScale=this.yScale="100%";
        }

        Sprite.prototype.draw=function(context, x, y){
            var xs=this.xScale, ys=this.yScale;
            if (!engine.isInt(this.xScale)){
                xs=this.image.width*(parseInt(this.xScale)/100);
            }

            if (!engine.isInt(this.yScale)){
                ys=this.image.height*(parseInt(this.yScale)/100);
            }

            context.drawImage(this.image, x, y, xs, ys);
        };

        Sprite.prototype.getSourceSize=function(){
            var self=this;
            return {
                width: self.image.width,
                height: self.image.height
            };
        };

        Sprite.prototype.getSize=function(){
            var self=this;
            return {
                width: this.image.width*(parseInt(this.xScale)/100),
                height: this.image.height*(parseInt(this.yScale)/100)
            };
        };

        return Sprite;
    })();
}).call(this);