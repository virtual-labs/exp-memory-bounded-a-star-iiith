var oneshotAuto = true;

function refresh() {
	if (canv.width != canv.offsetWidth || canv.height != canv.offsetHeight) {
		canv.width = canv.offsetWidth;
		canv.height = canv.offsetHeight;
		preset();
	}

    // if (type) {
    //     force();
    // }
    drawField();
    var inp = document.getElementById("svi");
    inp.max = exist.length-1;
    if(inp.value == "") {
        return;
    } else if(inp.value > Number(inp.max) || inp.value < Number(inp.min) || parseFloat(inp.value) % 1 != 0 || !exist[Number(inp.value)]) {
        document.getElementById("sv").style.color = "red";
    } else {
        document.getElementById("sv").style.color = "";
    }

    inp = document.getElementById("evi");
    inp.max = exist.length-1;
    if(inp.value == "") {
        return;
    } else if(inp.value > Number(inp.max) || inp.value < Number(inp.min) || parseFloat(inp.value) % 1 != 0 || !exist[Number(inp.value)]) {
        document.getElementById("ev").style.color = "red";
    } else {
        document.getElementById("ev").style.color = "";
    }

    inp = document.getElementById("edgeweight");
    if (inp.value < 1 || inp.value > 2000) {
        document.getElementById("edge").style.color = "red";
    }
    else {
        document.getElementById("edge").style.color = "";
    }
    
    /*
    //valid_input(document.getElementById("bf"), document.getElementById("bfi"));
    //valid_input(document.getElementById("td"), document.getElementById("tdi"));
    
    //document.getElementById("bf").style.color = "gray";
    //document.getElementById("td").style.color = "gray";
    //document.getElementById("bf").style.color = "";
    //document.getElementById("td").style.color = "";
    */

	document.getElementById('visit_array').innerHTML = '[' + String(visit.toString()) + ']';
    
    if (visited.length > 0) {
        var top = visited[visited.length-1];
        var visiting_string = `${top} (parent = ${parent[top]})`;
    }
    else {
        var visiting_string = 'none';
    }
    document.getElementById('visiting_node').innerHTML = visiting_string;

    // document.getElementById('visiting_node').innerHTML = visited.length > 0 ? visited[visited.length-1] : 'none';



    // document.getElementById('tovisit_node').innerHTML = visit.top().element;
    document.getElementById('tovisit_node').innerHTML = visit.top() ? visit.top().element : "none";
    var path_string = path.join(" -> ");
    document.getElementById('path_nodes').innerHTML = path.length > 0 ? path_string : '';

    /* 
    // document.getElementById('visited_array').innerHTML = '[' + String(visited.slice(0, visited.length-1)) + ']';
    // console.log(visit);
    */
    
    if (document.getElementById('auto').checked) {
        if (started) {
            nuxtdis = true;
            document.getElementById('nuxt').disabled = true;
            if (oneshotAuto) {
                oneshotAuto = false;
                refreshIntervalId = setInterval(UCS, 1000* (3-input.value))
            }
        } else {
            document.getElementById('nuxt').disabled = false;
        }
    } else if (refreshIntervalId != null) {
        clearInterval(refreshIntervalId);
        nuxtdis = false;
        document.getElementById('nuxt').disabled = false;
        oneshotAuto = true;
    }


    if (isQuestion) {
        document.getElementById('QuestionBox').style.display = "";
    } else {
        document.getElementById('QuestionBox').style.display = "none";
    }

	const mq = window.matchMedia( "(max-width: 1282px)" );

	if (mq.matches) {
		document.getElementById('control_container').classList.add('is-3-desktop');
		document.getElementById('control_container').classList.remove('is-2-desktop');
		document.getElementById('canvas_container').classList.add('is-6-desktop');
		document.getElementById('canvas_container').classList.remove('is-8-desktop');
		document.getElementById('info_container').classList.add('is-3-desktop');
		document.getElementById('info_container').classList.remove('is-2-desktop');
	} else {
		document.getElementById('control_container').classList.remove('is-3-desktop');
		document.getElementById('control_container').classList.add('is-2-desktop');
		document.getElementById('canvas_container').classList.remove('is-6-desktop');
		document.getElementById('canvas_container').classList.add('is-8-desktop');
		document.getElementById('info_container').classList.remove('is-3-desktop');
		document.getElementById('info_container').classList.add('is-2-desktop');
	}
}

setInterval(refresh, 30);
