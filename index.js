var all=0;
var previousall = 0;
var time = 0;
window.onload = function() {
  
  var file = document.getElementById("thefile");
  var audio = document.getElementById("audio");
  
  file.onchange = function() {
    var files = this.files;
    audio.src = URL.createObjectURL(files[0]);
    audio.load();
    audio.play();
    audio.loop = true;
    var context = new AudioContext();
    var src = context.createMediaElementSource(audio);
    var analyser = context.createAnalyser();

    var canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext("2d");

    src.connect(analyser);
    analyser.connect(context.destination);

    analyser.fftSize = 4096;
    analyser.smoothingTimeConstant = 0.5;

    var bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);

    var dataArray = new Uint8Array(bufferLength);

    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;

    var barWidth = (WIDTH / bufferLength) * 2.5;
    var barHeight;
    var x = 0;

    function renderFrame() {
      ctx.globalCompositeOperation = "screen"
      previousall += (all/100000-previousall)/10;
      if(previousall<=0){
        previousall=0;
      }
      previousall2 = previousall+1;
      all=0;
      requestAnimationFrame(renderFrame);
      time++;
      x = 0;

      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      for (var i = 150; i < bufferLength/2; i++) {
        barHeight = dataArray[i];
        all+=barHeight;
        
        var r = (barHeight*2);
        var g = 64;
        var b = 255-(barHeight*1.5);
        barHeight*=2;
        barHeight/=previousall2;
        ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ",1)";
        for(var aaa=0;aaa<barHeight;aaa+=(barWidth*50)){
          divv=1+((1/barHeight+(aaa/50)))/10;
         ctx.fillRect((WIDTH/2+x-(barWidth*(1+aaa/1000))/2)/divv+(WIDTH/2-(WIDTH/2)/divv),(HEIGHT/2 - barHeight+aaa)/divv+(HEIGHT/2-(HEIGHT/2)/divv)+HEIGHT/2-55, (barWidth*(1+aaa/1000))/divv, ((barHeight-aaa)*1.2)/divv);
          ctx.fillRect((WIDTH/2-x-(barWidth*(1+aaa/1000))/2)/divv+(WIDTH/2-(WIDTH/2)/divv), (HEIGHT/2 - barHeight+aaa)/divv+(HEIGHT/2-(HEIGHT/2)/divv)+HEIGHT/2-55, (barWidth*(1+aaa/1000))/divv, ((barHeight-aaa)*1.2)/divv);
        }
        
        

        
        x += barWidth;
      }
      
     console.log(all);
      document.documentElement.style.setProperty("--spc",(all/3000)+"%")
      
    }

    audio.play();
    renderFrame();
  };
};