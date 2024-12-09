var curr;
var started = false;

var nuxtdis = false;
var refreshIntervalId = null;

var isObservation = false; 

var visit = new PriorityQueue();
var explored = [];

var SN = null;
var EN = null;

function reconstructPath() {
    let path = [];
    let path_edges = [];
    let c = curr;
    while (c != null) {
        path.push(c);
        if(parent[c] != null) {
            for(const neighbour of edges[parent[c]]) {
                if(neighbour[0] == c) {
                    path_edges.push(neighbour[1]);
                    break;
                }
            }
        }
        c = parent[c];
    }
    return [path.reverse(), path_edges.reverse()];
}
var ul = document.getElementById("path_history_list");


function log_to_list(text) {
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(text));
    ul.appendChild(li);
}


function ALG_STOP() {
    console.log("ALG_STOP");
    started = false;
    path_data = reconstructPath();
    path = path_data[0];
    path_edges = path_data[1];
    curr = null;
    visit.clear();
    document.getElementById("nuxt").disabled = false;
    document.getElementById("startucs").disabled = false;
    document.getElementById("disablewarning").style.display="none";
    if(!NoQuestion)
        addEventListeners();
    // document.getElementById("nuxt").disabled = true;
    nuxtdis = false;
    clearInterval(refreshIntervalId);
}

function setHeuristics() {
    for (n = 0; n < nodes.length; n++) {
        console.log("End curr coordinates", nodes[EN][0], nodes[EN][1])
        if(n != EN && exist[n]) {
            // n curr coordinates
            console.log("Node", n,"coordinates", nodes[n][0], nodes[n][1]);
            d = dist(nodes[n][0], nodes[n][1], nodes[EN][0], nodes[EN][1])/8;
            d = Math.ceil(d);
            console.log("distance from ", n, "to", EN, "is", d);
            heuristics[n] = d;
        }
    }
    heuristics[EN] = 0;
    renderHeuristics();
}

function renderHeuristics() {
    const heuristicsTable = document.getElementById("heuristics_table");
    heuristicsTable.innerHTML = "";

    // Iterate through all nodes and print the heuristics in heuristics_table ul
    for (n = 0; n < nodes.length; n++) {
        if (heuristics[n] != null) {
        const listItem = document.createElement("li");
        listItem.innerHTML = "Node " + n + ": " + heuristics[n];

        heuristicsTable.appendChild(listItem);
        }
    }
}


function UCS() {
    if(!started) {return;}
    if(!edgeAdded) {return;}
    if(isQuestion) {return;}
    let i = 0;
    if(!visit.empty()) {
        i++;
        visit.sort();
        const { priority: currentCost, element: c} = visit.get();
        if (!exist[c]|| visited.includes(c))
            return;

        // console.log("currentCost:",currentCost, ", curr:",c);
        log_to_list("Current cost: " + currentCost + ", Current node: " + c);
        curr = c;


        trav_circle(parent[curr], curr);
        visited.push(curr);

        if (curr == EN) {
            ALG_STOP();
            return;
        }

        if (!NoQuestion && !visit.empty()) { // chance = 2/10
            var rand = Math.random();
            console.log(rand);
            if (rand < chance) {
                isQuestion = true;
                question();
            }
        }

        if (edges[curr].length == 0) {
            return UCS();
        }

        let successorCount = 0;
        for (const neighbour of edges[curr]) {
            const [child, cost] = neighbour;
            log_to_list("Child: "+child);
            if (curr in parent && parent[curr] === child) continue;

            successorCount++;
            if (frontier_elements.has(child)) continue;
            parent[child] = curr;

            const tentativeGScore = gScore[curr] + parseInt(cost);
            level[child] = level[curr] + 1;

            if ((child != EN) && level[child] === ML) {
                // console.log("Child", child, "is at maximum depth");
                log_to_list("Child " + child + " is at maximum depth");
                fScore[child] = Infinity;
                gScore[child] = Infinity;
            } else {
                fScore[child] = Math.max(fScore[curr], tentativeGScore + heuristics[child]);
                gScore[child] = tentativeGScore;
                log_to_list("Child " + child + " has value " + fScore[child]);
            }

            // console.log("child:", child);

            // Update f-score of the parent if all successors are generated
            // console.log("debug");
            // console.log(edges[curr]);
            // console.log(edges[curr].length);

            if ((!parent[curr] && successorCount === edges[curr].length) ||
                (parent[curr] && successorCount === edges[curr].length - 1)) {
                // console.log("All successors of", curr, "generated");
                log_to_list("All successors of " + curr + " generated");
                fScore[curr] = Math.min(...edges[curr].map(([child, _]) => fScore[child]));
                let p = parent[curr];
                while (p in parent) {
                    fScore[p] = Math.min(...edges[p].map(([child, _]) => fScore[child]));
                    p = parent[p];
                }
                visit.remove(fScore[curr],curr);
                visit.put(fScore[curr], curr);
            }

            // If all children of a curr are in memory, remove the curr
            let allChildrenInMemory = true;
            for (const [child, _] of edges[curr]) {
                if ((!parent[curr] && !frontier_elements.has(child)) ||
                    (parent[curr] && !frontier_elements.has(child) && child !== parent[curr])) {
                    allChildrenInMemory = false;
                    break;
                }
            }
            if (allChildrenInMemory) {
                // console.log("All children of", curr, "in memory");
                // console.log("Node", curr, "removed");
                log_to_list("All children of " + curr + " in memory");
                log_to_list("Node " + curr + " removed");
                visit = visit.filter(entry => entry.curr !== curr);
                frontier_elements.delete(curr);
            }

            // If memory is full, remove a curr
            if (ML === visit.length) {
                // console.log("Memory is full");
                log_to_list("Memory is full");
                visit.sort((a, b) => b.f - a.f || level[a.curr] - level[b.curr]);
                const idx = visit.findIndex(entry => isLeaf(entry.curr));
                const { curr: worstNode } = visit[idx];
                // console.log("Node", worstNode, "to be removed");
                log_to_list("Node " + worstNode + " to be removed");
                if (worstNode in parent) {
                    const parent = parent[worstNode];
                    if (!(fScore[parent] in visit.map(entry => entry.f))) {
                        // console.log("Value", fScore[worstNode], "backed up to parent", parent);
                        log_to_list("Value " + fScore[worstNode] + " backed up to parent " + parent);
                        fScore[parent] = fScore[worstNode];
                        visit.put(fScore[parent],parent);
                        // console.log("Parent", parent, "inserted on queue");
                        log_to_list("Parent " + parent + " inserted on queue");
                        frontier_elements.add(parent);
                    } else {
                        visit = visit.filter(entry => entry.curr !== parent);
                        fScore[parent] = fScore[worstNode];
                        // console.log("Value", fScore[worstNode], "backed up to parent", parent);
                        log_to_list("Value " + fScore[worstNode] + " backed up to parent " + parent);
                        visit.put(fScore[parent],parent);
                    }
                }
                visit = visit.filter(entry => entry.curr !== worstNode);
                frontier_elements.delete(worstNode);
                if (worstNode in parent) delete parent[worstNode];
            }

            // Insert child on queue
            visit.put(fScore[child], child);
            // console.log("Node", child, "added with value", fScore[child]);
            log_to_list("Node " + child + " added with value " + fScore[child]);
            frontier_elements.add(child);
            
        }
        // console.log(visit);
    }
    else {
        document.getElementById("goal_not_reached").style.display = "block";
        ALG_STOP();
    }
}