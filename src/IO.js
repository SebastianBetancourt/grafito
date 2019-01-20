function initGUI(){
	//buttons
	const margin = 5;
	let y = margin;

	button = createButton('new');
	button.position(margin, y);
	button.mousePressed(newGraph);
	y += button.height+margin;

	let fileButtons = [['open', openGraph], ['save', saveGraph]];

	for (var i = 0; i < fileButtons.length; i++) {
		button = createButton(fileButtons[i][0]);
		button.position(margin, y);
		button.attribute('type','file');
		button.mousePressed(fileButtons[i][1]);
		y += button.height+margin;
	}

	y += margin;

	let vertixButtons = [['add', addVertix], ['remove', removeVertix]];

	for (var i = 0; i < vertixButtons.length; i++) {
		button = createButton(vertixButtons[i][0]+' vertix');
		button.position(margin, y);
		button.mousePressed(vertixButtons[i][1]);
		y += button.height+margin;
	}

	y += margin;

	let edgeButtons = [['add', addEdge], ['remove', removeEdge]];

	for (var i = 0; i < edgeButtons.length; i++) {
		button = createButton(edgeButtons[i][0]+' edge');
		button.position(margin, y);
		button.mousePressed(edgeButtons[i][1]);
		y += button.height+margin;
	}
}

//button actions

function newGraph(){

		var div = createDiv('<div style="display: flex; flex-direction: column;" onclick="event.stopPropagation()">'+
'<div><input type="radio" name="graphType" id="undirected">blank undirected graph</div>'+
'<div><input type="radio" name="graphType" id="directed" >blank directed graph</div>'+
'<div style="display: flex;"><input type="radio" name="graphType" id="complete">'+
'complete <div style="font-family: serif; margin-left: 4px; margin-right: 4px"> K </div>'+
'	<input type="text" id="completeField" style="width: 20px;"></div>'+
'<div style="display: flex;"><input type="radio" name="graphType" id="cycle">'+
'	cycle <div style="font-family: serif; margin-left: 4px; margin-right: 4px"> C </div>'+
'	<input type="text" id="cycleField" style="width: 20px;"></div>'+
'<div style="display: flex;"><input type="radio" name="graphType" id="wheel">'+
'	wheel <div style="font-family: serif; margin-left: 4px; margin-right: 4px"> W </div>'+
'	<input type="text" id="wheelField" style="width: 20px;"></div>'+
'<div style="display: flex;"><input type="radio" name="graphType" id="bipartite">'+
'	complete bipartite '+
'	<div style="font-family: serif; margin-left: 4px; margin-right: 4px"> K '+
'	<input type="text" id="set1" style="width: 20px;">,'+
'	<input type="text" id="set2" style="width: 20px;">'+
'</div></div><button type="button" id="generate" style="width: 65px">generate</button>'+
'	</div>');
		div.attribute('style','width:100%;height:100%; background-color:rgba(255, 255, 255, 0.9); position: fixed; top: 0; left: 0;'+ // background and fullscreen size
		'display: flex; flex-direction: column; justify-content: center; align-items: center;'); // item align

	function generate(){
		
		if(document.getElementById('directed').checked){
			graph = new DirectedGraph([[0]]);
			
		}else if(document.getElementById('complete').checked){
			graph = generateGraph('complete', parseInt(document.getElementById('completeField').value));
		}else if(document.getElementById('cycle').checked){
			graph = generateGraph('cycle', parseInt(document.getElementById('cycleField').value));
		}else if(document.getElementById('wheel').checked){
			graph = generateGraph('wheel', parseInt(document.getElementById('wheelField').value));
		}else if(document.getElementById('bipartite').checked){
			graph = generateGraph('bipartite', parseInt(document.getElementById('set1').value), parseInt(document.getElementById('set2').value));
		}else{
			graph = new UndirectedGraph([[0]]);
		}

		representation = new GraphRepresentation(graph);
		representation.distributeVertices();
		representation.drawGraph();
		div.remove();
	}

	div.mouseClicked(div.remove);
	document.getElementById('generate').addEventListener('click', generate);

}

function openGraph(){
	var div = createDiv('<div onclick="event.stopPropagation()" style = "display: flex; flex-direction: column; justify-content: center; align-items: center;">'+
		'<label for="fileinput">choose a *.graph file to load from:</label>'+
			'<div><input type="file"'+
       		'id="fileinput" name="fileinput"'+
       		'accept=".graph"></div></div>');
	div.attribute('style','width:100%;height:100%; background-color:rgba(255, 255, 255, 0.9); position: fixed; top: 0; left: 0; display: flex; flex-direction: column; justify-content: center; align-items: center;'); 
	
	function parseGraph(lines){
		var directed = true;
		if(lines[0] == "u"){
			directed = false;
		}

		function parse(a){
			return parseInt(a, 10);
		}

		var rows = lines.split('\n').slice(0,-1);

		var centers = rows[1].split(',').map(pair =>{
			var center = pair.split(';').map(parse);
			return createVector(center[0], center[1]);
		});
		var matrix = rows.slice(2).map(col => {
			return col.split(',').map(parse);
		});
		div.remove();
		loadGraph(matrix, centers, directed);
	}

	function readSingleFile(event) {
		var file = event.target.files[0]; 
		if (file) {
			var reader = new FileReader();
			reader.onload = function(e) { 
				parseGraph(e.target.result);
			}
			reader.readAsText(file);
		} else { 
			alert("load failed");
		}
	}

	function loadGraph(matrix, centers, isDirected){
	if(isDirected){
		graph = new DirectedGraph(matrix);
	}else{
		graph = new UndirectedGraph(matrix);
	}
	representation = new GraphRepresentation(graph, centers);
	representation.drawGraph();
}

	div.mouseClicked(div.remove);
	document.getElementById('fileinput').addEventListener('change', readSingleFile, false);
}

function saveGraph(){
	// text composition
	var text = "";
	if(graph instanceof DirectedGraph){
		text += "d\n"
	}else{
		text += "u\n"
	}

	text += representation.getCentersInText() + "\n";

	text += graph.getAdjMatrixInText();

	//download

	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', "graph.graph");
	
	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();
	document.body.removeChild(element);
}

function addVertix(){
	representation.addVertix();
	graph.addVertix();
	representation.drawGraph();
}

var removingVertix = false;
var removingEdge = false;
var addingEdge = false;
var dragging = false;

function removeVertix(){
	removingVertix = true;
}

function addEdge(){
	addingEdge = true;
}

function removeEdge(){
	removingEdge = true;
}

//LISTENERS
// vertix dragging
var offset, vertix;
//vertix selection
var vertix1 = -1;



function mousePressed(){
	vertix = representation.vectorOnVertix(createVector(mouseX,mouseY));
	if(vertix >= 0){
		if(removingVertix){
			graph.removeVertix(vertix);
			representation.removeVertix(vertix);
			representation.drawGraph();
			removingVertix = false;
		}else if(addingEdge){
			if(vertix1 == -1){
				vertix1 = vertix;
				representation.highlightVertix(vertix1, 'Blue');
			}else{
				graph.addEdge(vertix1, vertix);
				representation.drawGraph();
				vertix1 = -1;
				addingEdge = false;
			}
		}else if(removingEdge){
			if(vertix1 == -1){
				vertix1 = vertix;
				representation.highlightVertix(vertix1, 'Red');
			}else{
				graph.removeEdge(vertix1, vertix);
				representation.drawGraph();
				vertix1 = -1;
				removingEdge = false;
			}
		}else{
			dragging = true;
			offset = createVector(mouseX-representation.centers[vertix].x,mouseY-representation.centers[vertix].y);
		}
	}else if(removingEdge || removingVertix || addingEdge){
		removingEdge = removingVertix = addingEdge = false;
		representation.drawGraph();
	}
}

function mouseDragged(){
	if(vertix >= 0 && dragging){
		representation.centers[vertix] = createVector(mouseX-offset.x, mouseY-offset.y);
		representation.drawEdges();
		representation.drawVertices();
	}	
}

function mouseReleased(){
	vertix = -1;
	dragging = false;
}

