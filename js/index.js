var canvas = document.getElementById("canvas");
var settings = {
    startDelay : 60,
    durantion : 300,
    text: "hello world",
    easing : "linearTween"
}

var Particles = function (destX, destY, x, y, color)
{
    this.destX = destX;
    this.destY = destY;
    this.startX = x;
    this.startY = y;
    this.x = x;
    this.y = y;
    this.color = color;
}
Particles.prototype.linearTween = function(t, b, c, d){
   return c*t/d + b;
}
Particles.prototype.move = function(tick)
{
    if(this.x != this.destX)
    {
        this.x = this.linearTween(tick, this.startX, this.destX - this.startX, settings.durantion );
    }
    if(this.y != this.destY)
    {
        this.y = this.linearTween(tick, this.startY, this.destY - this.startY, settings.durantion );
    }
}

var Writer = function (){
    this.ctx = canvas.getContext("2d");
    this.w = canvas.width = window.innerWidth;
    this.h = canvas.height = window.innerHeight;
    this.tick = 0;
    this.particles = [];
}



Writer.prototype.init = function(){
  var _this = this;
  var targetImageSrc = "aaa.jpg";
  
  var targetImage = new Image();
  targetImage.src = targetImageSrc;
  
  targetImage.onload = function(){
      _this.ctx.drawImage(targetImage,0,0,490, 777);
      // this.ctx.fillStyle = "#000";
      // this.ctx.font = "bold  "+size+"px monospace";
      // var fontSize = this.ctx.measureText(text);

      _this.startX = ( _this.w - targetImage.width ) * 0.5;
      _this.startY = (_this.h - targetImage.height ) * 0.25;

      // _this.ctx.fillText(text, 0, size)
      
     var image =    _this.ctx.getImageData(0,0,_this.w,_this.h)
     var array32 = new Uint32Array(image.data.buffer);
     for(var x=0; x < _this.w ; x++)
        {
          for( var y=0; y < _this.h ; y++)
            {
               var color = array32[x + _this.w * y];
               if(color)
                 {
                    _this.particles.push(new Particles( 
                      _this.startX + x,
                      _this.startY + y,
                      Math.round(Math.random() * _this.w),
                      Math.round(Math.random() * _this.h),
                      color
                    ))               
                 }
                 

            }
        }
      _this.ctx.clearRect(0,0,this.w,this.h);
      _this.draw();
  }
  
  
}

Writer.prototype.draw = function(){
  var _this = this;
  var imageData = this.ctx.createImageData(this.w,this.h)
  var pixels = new Uint32Array(imageData.data.buffer);
  this.particles.forEach(function(p){
     var x = Math.round(p.x);
     var y = Math.round(p.y);
     if(x > 0 && x <= _this.w && y > 0 && y <= _this.h)
       {
         pixels[x + _this.w * y] = p.color;
       }
    if(_this.tick >= settings.startDelay)
      {
        p.move(_this.tick - settings.startDelay);
      }
  })
  
  this.tick ++
  this.ctx.putImageData(imageData,0,0);
  requestAnimationFrame(function(){
     _this.draw();
  })
}

a = new Writer();
a.init()
