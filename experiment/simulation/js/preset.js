function preset(def_graph = 1) {

    var taskId = "G" + def_graph.toString();
    console.log(taskId);
    if(NoQuestion) {
        console.log("does all the is-active stuff");
        document.getElementById(taskId).classList.add("is-active");
        for(var i = 1; i <= graphs.length; i++) {
            if(i != def_graph) {
                taskId = "G" + i.toString();
                document.getElementById(taskId).classList.remove("is-active");
            }
        }
    }
    cclear();
    graphs[def_graph-1]();

    const heuristicsTable = document.getElementById("heuristics_table");
    heuristicsTable.innerHTML = "";


    // console.log(nodes);
    // console.log(edges);
} preset();
