function getEase(currentProgress, start, distance, steps, power) {
    currentProgress /= steps/2;
    if (currentProgress < 1) {
      return (distance/2)*(Math.pow(currentProgress, power)) + start;
    } 
    currentProgress -= 2;
    return distance/2*(Math.pow(currentProgress,power)+2) + start;
  }
  
  function getX(x1, x2, cframes, tframes) {
    let distance = x2 - x1;
    let steps = tframes;
    let currentProgress = cframes;
    return getEase(currentProgress, x1, distance, steps, 3);
  }
  
  function getY(y1, y2, cframes, tframes) {
    let distance = y2 - y1;
    let steps = tframes;
    let currentProgress = cframes;
    return getEase(currentProgress, y1, distance, steps, 3);
  }
  
  function _trav_circle(params) {
      ctx.lineWidth = edgeD*2;
      ctx.strokeStyle = 'black';
      ctx.beginPath();
      ctx.arc(getX(params.xFrom, params.xTo, params.frame, params.frames), getY(params.yFrom, params.yTo, params.frame, params.frames), nodeR * 2, 0, Math.PI * 2);
      ctx.stroke();
  
      if (params.frame < params.frames) {
          params.frame = params.frame + 1;
          window.requestAnimationFrame(_trav_circle.bind(null, params))
      } else {
          if (!nuxtdis) document.getElementById("nuxt").disabled = false;
      }
  }
  
  function trav_circle(e, m) {
    if (e == undefined) return;
    document.getElementById("nuxt").disabled = true;
    _trav_circle({
      frame: 0,
      frames: 100,
      xFrom: nodes[e][0],
      xTo: nodes[m][0],
      yFrom: nodes[e][1],
      yTo: nodes[m][1]
    });
  }
  