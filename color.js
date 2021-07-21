
var link={
   setcolor:function(color){
      $('a').css('color', color);
    }
}

var body= {
  setcolor:function(color){
    $('body').css('color', color);
  },
  setbackgroundcolor:function(color){
    $('body').css('backgroundColor', color);
  }
}

function daynight(self){
  if (self.value==='night'){
    body.setbackgroundcolor('black');
    body.setcolor('white');
    self.value='day';

    link.setcolor('lime');
    }

  else {
    body.setbackgroundcolor('white');
    body.setcolor('black');
    self.value='night';

    link.setcolor('green');
    }
  }
