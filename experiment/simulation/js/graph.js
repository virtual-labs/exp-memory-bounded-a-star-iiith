// visit, visit_array, Frontier are all the same things
const nodeR = 12.5;
const edgeD = 2;
const INF = 1E9;

var canv = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
const input = document.getElementById('autor');

var cur = -1;
var last = -1;
var type = true;
var d = [];
var maxb = 1;

var edges = [];
var nodes = [];
var path = [];
var path_edges = [];
var parent = [];
var costSoFar = {};
var exist = [];

var level = {};
var frontier_elements = new Set();
var fScore = {};
var gScore = {};


// var node_names = [];

var visited = [];
var visited_edge = [];

var isWeigted = false;
var edgeAdded = true;

var n = 0;
var SN = 0;

document.oncontextmenu = false;
canv.width = canv.offsetWidth;
canv.height = canv.offsetHeight;
console.log(canv.width)
console.log(canv.height)
ctx.font = "20px Arial";

function setOneHeuristic(n) {
    n = parseInt(n);
    if (n == 0) {
        heuristics[n] = 0;
        return;
    }
    d = dist(nodes[n][0], nodes[n][1], nodes[0][0], nodes[0][1])/8;
    d = Math.ceil(d);
    heuristics[n] = d;
    console.log("heuristic value of node ", n, "is", d);
}


canv.addEventListener('contextmenu', contextMenu);
function contextMenu(e) {
    var v = node(e.offsetX, e.offsetY);
    if (v == 0) {
        console.log("can't delete node 0");
        return;
    }
    if (v != -1) {
        vclear();
        exist[v] = false;
        heuristics[v] = null;
        renderHeuristics();
    }
}

async function edgePromise(last, v) {
    return new Promise((resolve, reject) => {
        const submitHandler = (e) => {
            var inputValue = parseInt(document.getElementById("edgeweight").value);
            lower_bound_cost = Math.abs(heuristics[last] - heuristics[v]);
            if (isNaN(inputValue) || inputValue <= lower_bound_cost || inputValue > 2000) {
                e.preventDefault();
                return;
            }
            // if (isNaN(inputValue) || inputValue <= 0 || inputValue > 2000) {
            //     e.preventDefault();
            //     return;
            // }
            resolve(parseInt(document.getElementById("edgeweight").value));
            document.getElementById("submitedge").removeEventListener('click', submitHandler);
            document.getElementById("cc").removeEventListener('click', clearHandler);
            document.getElementById("vc").removeEventListener('click', vclearHandler);
        }

        const clearHandler = () => {
            reject("clear button clicked");
            document.getElementById("submitedge").removeEventListener('click', submitHandler);
            document.getElementById("cc").removeEventListener('click', clearHandler);   
            document.getElementById("vc").removeEventListener('click', vclearHandler);
        }

        const vclearHandler = () => {
            reject("clear visited button clicked");
            document.getElementById("submitedge").removeEventListener('click', submitHandler);
            document.getElementById("cc").removeEventListener('click', clearHandler);
            document.getElementById("vc").removeEventListener('click', vclearHandler);
        }

        document.getElementById("submitedge").addEventListener('click', submitHandler);
        document.getElementById("cc").addEventListener('click', clearHandler);
        document.getElementById("vc").addEventListener('click', vclearHandler);
    });
}

canv.addEventListener('click', clickEvent);
async function clickEvent(e) {
    //console.log("click");
    if (cur != -1) {
        return;
    }
    var
        x = e.offsetX;
        y = e.offsetY;
        v = node(x, y);
    if (v == -1) {
        n = nodes.length-1;
        nodes.push([x, y]);
        // console.log("node", n, "coordinates", x, y);
        setOneHeuristic(n+1); 
        edges[n+1] = [];
        exist.push(true);
		n++;
    } else {
		if (v == last) {
			last = -1;
			return;
		}
        if (!exist[last] || last == -1) {
            last = v;
        } else {
            const edgeExists = edges[last].some(([nodeIndex, _]) => nodeIndex === v);
            if(!edgeExists) {
                edgeAdded = false;
                document.getElementById("EdgeBox").style.display = "";
                document.getElementById("startucs").disabled = true;
                document.getElementById("nuxt").disabled = true;
                removeEventListeners();

                try {
                    const len = await edgePromise(last, v);
                    edges[last].push([v, len]);
                    edges[v].push([last, len]);
                }
                catch (e) {}

                edgeAdded = true;
                document.getElementById("EdgeBox").style.display = "none";
                document.getElementById("startucs").disabled = false;
                document.getElementById("nuxt").disabled = false;
                addEventListeners();
            }
            else {
                edges[last] = edges[last].filter(([nodeIndex, _]) => nodeIndex !== v);
                edges[v] = edges[v].filter(([nodeIndex, _]) => nodeIndex !== last);
            }
            last = -1;
        }
    }
    //console.log(nodes, edges, exist);
    renderHeuristics();
}

canv.addEventListener('mousedown', mouseDown);
function mouseDown(e) {
    var v = node(e.offsetX,  e.offsetY);
    if (v != -1) {
        cur = v;
    }
}

canv.addEventListener('mouseup', mouseUp);
function mouseUp(e) {
    cur = -1;
}

canv.addEventListener('mousemove', mouseMove);
function mouseMove(e) {
    if (cur != -1) {
        nodes[cur] = [e.offsetX, e.offsetY];
    }

}

// canv.addEventListener('dblclick', function(e) {});

document.addEventListener('keydown', keyDown);
function keyDown(e) {
    // console.log("keydown ", e.keyCode);
    if (e.keyCode == 67) { // c
        cclear();
    }
}

function removeEventListeners() {
    canv.removeEventListener('contextmenu', contextMenu);
    canv.removeEventListener('click', clickEvent);
    canv.removeEventListener('mousedown', mouseDown);
    canv.removeEventListener('mouseup', mouseUp);
    canv.removeEventListener('mousemove', mouseMove);
    canv.removeEventListener('keydown', keyDown);

}

function addEventListeners() {
    canv.addEventListener('contextmenu', contextMenu);
    canv.addEventListener('click', clickEvent);
    canv.addEventListener('mousedown', mouseDown);
    canv.addEventListener('mouseup', mouseUp);
    canv.addEventListener('mousemove', mouseMove);
    canv.addEventListener('keydown', keyDown);
}


function clear() {
    ctx.beginPath();
    ctx.fillStyle = '#f2f2f0';
    ctx.fillRect(0, 0, canv.width, canv.height);
}

function vclear() {
    started=false
    curr = null;
    e = undefined;
    ep = undefined;
    visit.clear();
    weight = [];
    parent = [];
    // levels = [];
    path = [];
    path_edges = [];
    visited = [];
    visited_edge = [];
    started = false;
    isQuestion = false;
    isObservation = false;
    EndVect = null;
    noEdges = false;
    oneshotAuto = true;
    if (refreshIntervalId != null) clearInterval(refreshIntervalId);
    refreshIntervalId = null;
    document.getElementById("startucs").disabled = false;
    document.getElementById("goal_not_reached").style.display = "none";
    document.getElementById("path_history_list").innerHTML = "";
    document.getElementById("disablewarning").style.display="none";
    if(!NoQuestion)
        addEventListeners();
    console.log("clear");

    // level = {};
    // frontier_elements = new Set();
    // fScore = {};
    // gScore = {};
    // renderHeuristics();
    // console.log(nodes, edges);
}

function cclear() {
    clear();
    for (var i = 0; i < nodes.length; i++) {
        edges[i] = [];
    }
    nodes = [];
    exist = [];
    path = []
    path_edges = [];
    n = 0;
    maxb = 1;
    edgeAdded = true;
    vclear();
}

function drawLabel(text, p1x, p1y, p2x, p2y, alignment = 'center', padding = 0 ){
  var dx = p2x - p1x;
  var dy = p2y - p1y;   
  var px, py, pad;


	var angle = Math.atan2(dy,dx);
	if (angle < -Math.PI/2 || angle > Math.PI/2){
		var px = p1x;
		var py = p1y;
		p1x = p2x;
		p1y = p2y;
		p2x = px;
		p2y = py;
		dx *= -1;
		dy *= -1;
		angle -= Math.PI;
	}

  if (alignment=='center'){
    px = p1x;
    py = p1y;
    pad = 1/2;
  } else {
    var left = (alignment=='left');
    px = left ? p1x : p2x;
    py = left ? p1y : p2y;
    pad = padding / Math.sqrt(dx*dx+dy*dy) * (left ? 1 : -1);
  }

  ctx.save();
  ctx.textAlign = alignment;
  ctx.translate(px+dx*pad,py+dy*pad);
  ctx.rotate(Math.atan2(dy,dx));
  ctx.fillText(text,0,0);
  ctx.restore();
}

function drawField() {
    clear();
    for (var i = 0; i < nodes.length; ++i) {
        if(exist[i]) {
            for (var j = 0; j < edges[i].length; ++j) {
                if (exist[edges[i][j][0]]) {
                    ctx.lineWidth = edgeD;
                    ctx.strokeStyle = 'gray';
                    ctx.beginPath();
                    ctx.moveTo(nodes[i][0], nodes[i][1]);
                    ctx.lineTo(nodes[edges[i][j][0]][0], nodes[edges[i][j][0]][1]);
                    ctx.stroke();
                    if (path.includes(i) && path.includes(edges[i][j][0]) && path.indexOf(i) == path.indexOf(edges[i][j][0]) - 1){
                        // console.log("path from ", i, " to ", edges[i][j][0]);
                        ctx.strokeStyle = 'red';
                        ctx.lineWidth = edgeD * 2;
                        ctx.beginPath();
                        ctx.moveTo(nodes[i][0], nodes[i][1]);
                        ctx.lineTo(nodes[edges[i][j][0]][0], nodes[edges[i][j][0]][1]);
                        ctx.stroke();
                    }
                    ctx.fillStyle = 'gray';
                    ctx.font  = '16px sans-serif';
                    ctx.textBaseline = 'bottom';
                    drawLabel(edges[i][j][1], nodes[i][0], nodes[i][1], nodes[edges[i][j][0]][0], nodes[edges[i][j][0]][1]);
                    ctx.fill();
                } 
            }
        }
    }
    for (var i = 0; i < nodes.length; ++i) {
        if (exist[i]) {
            ctx.fillStyle = '#97d23d';
            for (var k = 0; k < visited.length; k++) {
                if (visited[k] == i) {
                    ctx.fillStyle = 'black';
                    break;
                }
            }
            for (var k = 0; k < visit.queue.length; k++) {
                // console.log(visit.queue[k].element);
                if (visit.queue[k].element == i) {
                    ctx.fillStyle = 'orange';
                }
            }
            if (i == last) {
                ctx.fillStyle = 'gray';
            }
			/* 
            if (i == visit[visit.length - 1]) {
                ctx.fillStyle = 'yellow';
            }
            */
            if (i == curr && !visited.slice(0, visited.length - 1).includes(curr)) {
                ctx.fillStyle = 'orange';
            }
            // if (i == EN && !visited.includes(EN)) {
            //     ctx.fillStyle = 'yellow';
            // }
            ctx.beginPath();
            ctx.arc(nodes[i][0], nodes[i][1], nodeR * (1 + (i == last)), 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#616161';
            for (var k = 0; k < visited.length; k++) {
                if (visited[k] == i && i != curr) {
                    ctx.fillStyle = 'white';
                    break;
                }
            }
            ctx.fillText(i,nodes[i][0] - nodeR/3 - (nodeR/3*(i >= 10)), nodes[i][1] + nodeR/1.4);

            if (i == curr) {
                ctx.strokeStyle = 'black';
                ctx.lineWidth = edgeD*2;                    
            } else {
                ctx.strokeStyle = 'gray';
                ctx.lineWidth = edgeD;                    
            }
            ctx.beginPath();
            ctx.arc(nodes[i][0], nodes[i][1], nodeR * 1.5, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}

function dist(x1, y1, x2, y2) {
    return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
}

function node(x, y) {
    for (var i = 0; i < nodes.length; i++) {
        if (exist[i]) {
            var len = dist(nodes[i][0], nodes[i][1], x, y);
            if (len < nodeR * 3) {
                return i;
            }
        }
    }
    return -1;
}

function bfs(s) {
    var 
        q = [],
        beg = 0;
        used = [];
    for (var i = 0; i < n; ++i) {
        used.push(false);
    }
    q.push(s);
    used[s] = true;
    d[s][s] = 0;
    while (beg != q.length) {
        var v = q[beg];
        beg++;
        for (var j = 0; j < edges[v].length; ++j) {
            var u = edges[v][j];
            if (exist[u] && !used[u]) {
                used[u] = true;
                q.push(u);
                d[s][u] = d[s][v] + 1;
                maxb = Math.max(maxb, d[s][u]);
            }
        }
    }
}

function rib() {
    return Math.min(canv.width, canv.height) / (maxb + 1);
}

function f(v, u) {
    var
        dx = nodes[v][0] - nodes[u][0],
        dy = nodes[v][1] - nodes[u][1],
        len = Math.sqrt(dx * dx + dy * dy);
    return [(dx / len * d[v][u] * rib() - dx) / 30,
            (dy / len * d[v][u] * rib() - dy) / 30];
}

function force() {
    d = [];
    maxb = 0;
    for (var i = 0; i < n; ++i) {
        d.push([]);
        for (var j = 0; j < n; ++j) {
            d[i].push(INF);
        }
        if (exist[i]) {
            bfs(i);
        }
    }
    for (var i = 0; i < n; ++i) {
        if (exist[i]) {
            for (var j = 0; j < n; ++j) {
                if (exist[j] && i != j && d[i][j] != INF && i != cur) {
                    var delta = f(i, j);
                    nodes[i][0] += delta[0];
                    nodes[i][1] += delta[1];
                }
            }
        }
    }
    var 
        mxx = -INF,
        mxy = -INF,
        mnx = INF,
        mny = INF;
    for (var i = 0; i < n; ++i) {
        if (i != cur && exist[i]) {
            mxx = Math.max(mxx, nodes[i][0]);
            mxy = Math.max(mxy, nodes[i][1]);
            mnx = Math.min(mnx, nodes[i][0]);
            mny = Math.min(mny, nodes[i][1]);
        }
    }
    for (var i = 0; i < n; ++i) {
        if (i != cur && exist[i]) {
            nodes[i][0] += (canv.width / 2 - (mxx + mnx) / 2) / 30;
            nodes[i][1] += (canv.height / 2 - (mxy + mny) / 2) / 30;
        }
    }
}
