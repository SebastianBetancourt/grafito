function initGUI(){
	//buttons
	const margin = 5;
	let y = margin;

	button = createButton('Nuevo grafo');
	button.position(margin, y);
	button.mousePressed(newGraph);
	y += button.height+margin;

	let fileButtons = [['Abrir', openGraph], ['Guardar', saveGraph]];

	for (var i = 0; i < fileButtons.length; i++) {
		button = createButton(fileButtons[i][0]);
		button.position(margin, y);
		button.attribute('type','file');
		button.mousePressed(fileButtons[i][1]);
		y += button.height+margin;
	}

	y += margin;

	let vertixButtons = [['Añadir', addVertix], ['Eliminar', removeVertix]];

	for (var i = 0; i < vertixButtons.length; i++) {
		button = createButton(vertixButtons[i][0]+' vértice');
		button.position(margin, y);
		button.mousePressed(vertixButtons[i][1]);
		y += button.height+margin;
	}

	y += margin;

	let edgeButtons = [['Añadir', addEdge], ['Eliminar', removeEdge]];

	for (var i = 0; i < edgeButtons.length; i++) {
		button = createButton(edgeButtons[i][0]+' arista');
		button.position(margin, y);
		button.mousePressed(edgeButtons[i][1]);
		y += button.height+margin;
	}

	y += margin;

	button = createButton('Subdivisión elemental');
	button.position(margin, y);
	button.mousePressed(elementarySubdivision);
	y += button.height+margin;

	y += margin;

	let algoButtons = [['Complemento', complement], ['Calcular Warshall', warshall]];

	for (var i = 0; i < edgeButtons.length; i++) {
		button = createButton(algoButtons[i][0]);
		button.position(margin, y);
		button.mousePressed(algoButtons[i][1]);
		y += button.height+margin;
	}

	window.addEventListener("resize", resize);

}

//button actions

function newGraph(){

	var div = document.getElementById('new');
	div.style.display = 'flex';

	function hideDiv(){
		var radios = document.getElementsByClassName("graphTypeRadio");
		for(var radio = 0; radio < radios.length; radio++){
			radios[radio].checked = false;
		}
		var fields = document.getElementsByClassName("graphTypeField");
		for(var field = 0; field < fields.length; field++){
			fields[field].value = '';
		}

		div.style.display = 'none';
		div.removeEventListener('click', hideDiv);
		document.getElementById('generate').removeEventListener('click', generate);
	}

	function generate(){
		graph = new UndirectedGraph([[0]]);

		if(document.getElementById('directed').checked){
			graph = new DirectedGraph([[0]]);	
		}else if(document.getElementById('complete').checked){
			graph.generateGraph('complete', parseInt(document.getElementById('completeField').value));
		}else if(document.getElementById('cycle').checked){
			graph.generateGraph('cycle', parseInt(document.getElementById('cycleField').value));
		}else if(document.getElementById('wheel').checked){
			graph.generateGraph('wheel', parseInt(document.getElementById('wheelField').value));
		}else if(document.getElementById('bipartite').checked){
			graph.generateGraph('bipartite', parseInt(document.getElementById('set1').value), parseInt(document.getElementById('set2').value));
		}

		representation = new GraphRepresentation();
		representation.distributeVertices();
		representation.drawGraph();
		updateInfo();
		hideDiv();
	}

	div.addEventListener('click', hideDiv);
	document.getElementById('generate').addEventListener('click', generate);

}

function openGraph(){
	var div = document.getElementById('fileOpener');
	var selector = document.getElementById('fileinput');
	selector.value = "";
	div.style.display = 'flex';
	
	function hideDiv(){		
		div.style.display = 'none';
		div.removeEventListener('click', hideDiv);
		selector.removeEventListener('click', readSingleFile);
	}
	
	function parseGraph(lines){
		var rows = lines.split('\n\n');

		var isDirected = true;
		if(rows[0] == 'u'){
			isDirected = false;
		}

		var representationText = rows[1];
		
		var adjMatrix = rows[2];
		
		var wMatrix = rows [3];

		div.style.display = 'none';
		loadGraph(isDirected, representationText, adjMatrix, wMatrix);
	}

	function readSingleFile(event) {
		var reader = new FileReader();
			reader.onload = function(e) { 
				parseGraph(e.target.result);
			}
			reader.onerror = function(event) {
    			console.log(event.message);
    		}
		var file = event.target.files[0];
		if (file) {
			reader.readAsText(file);
			hideDiv();
		} else { 
			alert('load failed');
		}
		
	}

	function loadGraph(isDirected, representationText, adjMatrix, wMatrix){
		if(isDirected){
			graph = new DirectedGraph(new Matrix(0).fromString(adjMatrix), new Matrix(0).fromString(wMatrix));
		}else{
			graph = new UndirectedGraph(new Matrix(0).fromString(adjMatrix), new Matrix(0).fromString(wMatrix));
		}
		representation = new GraphRepresentation().fromString(representationText);
		updateInfo();
		representation.drawGraph();
	}

	div.addEventListener('click', hideDiv);
	selector.addEventListener('change', readSingleFile, false);
}

function saveGraph(){
	// text composition
	var text = "";
	if(graph instanceof DirectedGraph){
		text += 'd\n\n'
	}else{
		text += 'u\n\n'
	}

	text += representation.toString() + '\n';

	text += graph.adjMatrix.toString()+'\n';

	text += graph.wMatrix.toString();

	//download

	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', "graph.graph");
	
	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();
	document.body.removeChild(element);
}

function resize(){
	resizeCanvas(windowWidth-4, windowHeight-4);
	representation.distributeVertices();
	representation.drawGraph();
}

function updateInfo(){
	graph.updateWeightMatrix();
	updateTableWMatrix();
	updateDrawWeights();
	document.getElementById('wMatrix').innerHTML = updateTableWMatrix();
	document.getElementById('adjMatrix').innerHTML = updateTableAdjMatrix();
	document.getElementById('status').innerHTML = representation.status;
	document.getElementById('vertices').innerHTML = graph.getVertixCount();
	document.getElementById('edges').innerHTML = graph.getEdgeCount();
	document.getElementById('typeOfGraph').innerHTML = graph.getType();
	document.getElementById('degreeSequence').innerHTML = graph.getDegreeSequence();
}

// Adjencency matrix showing and editing
function updateTableAdjMatrix(){
	var table = [[' '].concat(representation.ids.slice(0, graph.getVertixCount()))];
	for (var i = 0; i < graph.getVertixCount(); i++) {
		table.push([representation.ids[i]]);
		for (var j = 0; j < graph.getVertixCount(); j++) {
			table[i+1].push(graph.adjMatrix.getValue(i, j));
		}
	}

	var rows = table.length;
	var columns = table[0].length;
	var code = '<table id="adjTable" style="float:right">';
	for(var i = 0; i < rows; i++){
		var row = '<tr>';
		for(var j = 0; j < columns; j++){
			//headers
			var attributes = 'class="tablecell adjTable" contenteditable="true" onblur="aCellBlurred(this)"';
			var tag = 'td';
			if(i == 0 || j == 0){
				attributes += 'onkeypress="return keyPressedOnHeader(event);"';
				tag = 'th';
			}else{
				attributes += 'onkeypress="return keyPressedOnCell(event);"';
			}
			var cell = '<'+tag+' id="'+String(i)+":"+String(j)+'" '+attributes+'>';
			cell += String(table[i][j]);
			cell += '</'+tag+'>';
			row += cell;
		}
		row += '</tr>';
		code += row;
	}
	code += '</table>';
	return code;
}

function aCellBlurred(cell){
	var i = parseInt(cell.id.split(':')[0]);
	var j = parseInt(cell.id.split(':')[1]);
	if(i == 0){
		representation.ids[j-1] = cell.textContent;
	}else if(j == 0){
		representation.ids[i-1] = cell.textContent;
	}else{
		graph.adjMatrix.setValue(i-1, j-1, Math.abs(parseInt(cell.textContent)));
		if(graph instanceof UndirectedGraph){
				graph.adjMatrix.setValue(j-1, i-1, Math.abs(parseInt(cell.textContent)));
			}
	}
	updateInfo();
	representation.drawGraph();
}

function keyPressedOnCell(event){
	if(event.keyCode == 13) {
  		event.target.blur();
  		return false;
  	}else if ((event.keyCode < 48 || event.keyCode > 57) && event.key != '-') {
  		return false;
	}
}

function keyPressedOnHeader(event){
	if(event.keyCode == 13) {
  		event.target.blur();
  		return false;
	}
}

function toggleAdjMatrix(){
	var state = document.getElementById('adjMatrix').style.display;
	if(state == 'none'){
		document.getElementById('adjMatrix').style.display = 'block';
		document.getElementById('toggleAdjMatrix').innerHTML = '[Ocultar matriz de adyacencia]';
	}else{
		document.getElementById('adjMatrix').style.display = 'none';
		document.getElementById('toggleAdjMatrix').innerHTML = '[Mostrar matriz de adyacencia]';
	}
}

// weight matrix

function updateTableWMatrix(){

	if(graph.hasMultipleEdges()){
		// show weights checkbox
		document.getElementById('showWeights').style.display = 'none';
		document.getElementById('showWeightsLabel').style.display = 'none';
		return '<span style="font-size: 8pt">Matriz de pesos no disponible para multigrafos</span>';
	}

	document.getElementById('showWeights').style.display = 'inline';
	document.getElementById('showWeightsLabel').style.display = 'inline';
	graph.updateWeightMatrix();
	var table = [[' '].concat(representation.ids.slice(0, graph.getVertixCount()))];
	for (var i = 0; i < graph.getVertixCount(); i++) {
		table.push([representation.ids[i]]);
		for (var j = 0; j < graph.getVertixCount(); j++) {
			table[i+1].push(graph.wMatrix.getValue(i, j));
		}
	}

	var rows = table.length;
	var columns = table[0].length;
	var code = '<table id="wTable" style="float:right">';
	for(var i = 0; i < rows; i++){
		var row = '<tr>';
		for(var j = 0; j < columns; j++){
			//headers

			var attributes = 'onblur="wCellBlurred(this)"';
			var tag = 'td';
			if(i > 0 && j > 0){
				if(table[i][j] == 0 && i == j && graph.adjMatrix.getValue(Math.abs(i-1),Math.abs(j-1)) == 0){
					attributes += 'class="tablecell wTable uneditable"';
				}else if(table[i][j] != Infinity){
					attributes += 'contenteditable="true" class="tablecell wTable" onkeypress="return keyPressedOnCell(event);"';
				}else{
					attributes += 'class="tablecell wTable uneditable"';
					table[i][j] = '∞';
				}
			}else if(i == 0 || j == 0){
				attributes += 'class="tablecell wTable" onkeypress="return keyPressedOnHeader(event);"';
				tag = 'th';
			}else{
				attributes += 'class="tablecell wTable" onkeypress="return keyPressedOnCell(event);"';
			}
			var cell = '<'+tag+' id="'+String(i)+":"+String(j)+'" '+attributes+'>';
			cell += String(table[i][j]);
			cell += '</'+tag+'>';
			row += cell;
		}
		row += '</tr>';
		code += row;
	}
	code += '</table>';
	return code;
}

function wCellBlurred(cell){
	var i = parseInt(cell.id.split(':')[0]);
	var j = parseInt(cell.id.split(':')[1]);
	if(i == 0){
		representation.ids[j-1] = cell.textContent;
	}else if(j == 0){
		representation.ids[i-1] = cell.textContent;
	}else{
		graph.wMatrix.setValue(i-1, j-1, parseInt(cell.textContent));
		if(graph instanceof UndirectedGraph){
			graph.wMatrix.setValue(j-1, i-1, parseInt(cell.textContent));
		}
	}
	updateInfo();
	representation.drawGraph();
}


function toggleWMatrix(){
	var state = document.getElementById('wSection').style.display;
	if(state == 'none'){
		document.getElementById('wSection').style.display = 'block';
		document.getElementById('toggleWMatrix').innerHTML = '[Ocultar matriz de pesos]';
	}else{
		document.getElementById('wSection').style.display = 'none';
		document.getElementById('toggleWMatrix').innerHTML = '[Mostrar matriz de pesos]';
	}
}

function updateDrawWeights(){
	if(graph.hasMultipleEdges()){
		representation.drawWeights = false;
	} else if (document.getElementById('showWeights').checked){
		representation.drawWeights = true;
	} else{
		representation.drawWeights = false;
	}
	representation.drawGraph();
}

function complement(){
	graph = graph.generateComplement();
	representation = new GraphRepresentation(representation.centers, representation.ids, representation.drawWeights);
	representation.drawGraph();
	updateInfo();
}

function warshall(){
	var div = document.getElementById('warshall');
	div.style.display = 'flex';
	
	graph.computeWarshall();

	function hideDiv(){		
		div.style.display = 'none';
		div.removeEventListener('click', hideDiv);

	}
	
	var k = graph.getVertixCount();
	checkButtons();
	printMatrices();

	function checkButtons(){
		if(graph.getVertixCount() == 1){
			document.getElementById('next').disabled = true;
			document.getElementById('previous').disabled = true;
		}else if(k >= graph.getVertixCount()){
			document.getElementById('next').disabled = true;
			document.getElementById('previous').disabled = false;
		}else if(k <= 0){
			document.getElementById('previous').disabled = true;
			document.getElementById('next').disabled = false;
		}else{
			document.getElementById('next').disabled = false;
			document.getElementById('previous').disabled = false;
		}
	}

	function next(){
		if(k < graph.getVertixCount()){
			k++;
			checkButtons();
		}
		printMatrices();
	}

	function previous(){
		if(k > 0){
			k--;
			checkButtons();	
		}
		printMatrices();
	}

	function printMatrices(){

		var warshall = [[' '].concat(representation.ids.slice(0, graph.getVertixCount()))];
		var predecessor = [[' '].concat(representation.ids.slice(0, graph.getVertixCount()))];
		for (var i = 0; i < graph.getVertixCount(); i++) {
			warshall.push([representation.ids[i]]);
			predecessor.push([representation.ids[i]]);
			for (var j = 0; j < graph.getVertixCount(); j++) {
				warshall[i+1].push(graph.warshalls[k].getValue(i, j));
				predecessor[i+1].push(graph.warshallPredecessors[k].getValue(i,j));
			}
		}

		document.getElementById('warshallLabel').innerHTML = 'W<sup>('+String(k)+')</sup>';
		document.getElementById('predecessorsLabel').innerHTML = 'P<sup>('+String(k)+')</sup>';

		var codeWarshall = '<table id="warshallTable" style="float:center">';
		var codePredecessor = '<table id="predecessorsTable" style="float:center">';
		for(var i = 0; i < graph.getVertixCount()+1; i++){
			var rowWarshall = '<tr>';
			var rowPredecessor = '<tr>';
			for(var j = 0; j < graph.getVertixCount()+1; j++){
				var cellWarshall = '<td class="tablecell"';
				var cellPredecessor = '<td class="tablecell"';
				if(i == 0 || j == 0){
					cellWarshall = '<th class="tablecell"';
					cellPredecessor = '<th class="tablecell"';
				}
				
				cellWarshall += 'id="war_'+String(i)+":"+String(j)+'">';
				cellPredecessor += 'id="pre_'+String(i)+":"+String(j)+'">';
				if(warshall[i][j] == Infinity){
					cellWarshall += '∞';
				}else{
					cellWarshall += String(warshall[i][j]);
				}
				if(predecessor[i][j] === undefined){
					cellPredecessor += '×';
				}else{
					cellPredecessor += String(predecessor[i][j]);
				}
				cellWarshall += '</td>';
				cellPredecessor += '</td>';
				if(i == 0 || j == 0){
					rowWarshall += '</th>';
					rowPredecessor += '</th>';
				}
				rowWarshall += cellWarshall;
				rowPredecessor += cellPredecessor;
			}
			rowWarshall += '</tr>';
			rowPredecessor += '</tr>';
			codeWarshall += rowWarshall;
			codePredecessor += rowPredecessor;
		}
		codePredecessor += '</table>';
		codeWarshall += '</table>';
		document.getElementById('warshallMatrix').innerHTML = codeWarshall;
		document.getElementById('predecessorsMatrix').innerHTML = codePredecessor;

	}

	document.getElementById('next').addEventListener('click', next);
	document.getElementById('previous').addEventListener('click', previous);
	div.addEventListener('click', hideDiv);
}

function addVertix(){
	deactivateCurrentAction();
	representation.addVertix();
	graph.addVertix();
	representation.drawGraph();
	updateInfo();
}

var removingVertix = false;
var removingEdge = false;
var addingEdge = false;
var dragging = false;
var subdivisioning = false;

function removeVertix(){
	deactivateCurrentAction();
	removingVertix = true;
	representation.status = 'Selecciona el vértice a eliminar';
	representation.drawGraph();
	updateInfo();
}

function addEdge(){
	deactivateCurrentAction();
	addingEdge = true;
	representation.status = 'Selecciona los vértices a conectar';
	representation.drawGraph();
	updateInfo();
}

function removeEdge(){
	deactivateCurrentAction();
	removingEdge = true;
	representation.status = 'Selecciona los vértices a desconectar';
	representation.drawGraph();
	updateInfo();
}

function elementarySubdivision(){
	deactivateCurrentAction();
	subdivisioning = true;
	representation.status = 'Selecciona los vértices para crear un vértice entre ellos';
	representation.drawGraph();
	updateInfo();
}

//LISTENERS
// vertix dragging. vertix is the current clicked vertix
var offset, vertix;
//vertix selection saving
var selectedVertix = -1;



function mousePressed(event){
	vertix = representation.vectorOnVertix(createVector(mouseX,mouseY));
	if(vertix >= 0){
		if(removingVertix){
			graph.removeVertix(vertix);
			representation.removeVertix(vertix);
			representation.drawGraph();
			deactivateCurrentAction();
		}else if(addingEdge){
			if(selectedVertix == -1){
				selectedVertix = vertix;
				representation.highlightVertix(selectedVertix, 'Blue');
			}else{
				graph.addEdge(selectedVertix, vertix);
				representation.drawGraph();
				selectedVertix = -1;
				deactivateCurrentAction();
			}
		}else if(removingEdge){
			if(selectedVertix == -1){
				selectedVertix = vertix;
				representation.highlightVertix(selectedVertix, 'Red');
			}else{
				graph.removeEdge(selectedVertix, vertix);
				representation.drawGraph();
				selectedVertix = -1;
				deactivateCurrentAction();
			}
		}else if(subdivisioning){
			if(selectedVertix == -1){
				selectedVertix = vertix;
				representation.highlightVertix(selectedVertix, 'Green');
			}else{
				var centers = [representation.centers[selectedVertix], representation.centers[vertix]];
				representation.addVertix(vectorMean(centers));
				graph.elementarySubdivision(selectedVertix, vertix);
				representation.drawGraph();
				selectedVertix = -1;
				deactivateCurrentAction();
			}
		}else{
			dragging = true;
			offset = createVector(mouseX-representation.centers[vertix].x,mouseY-representation.centers[vertix].y);
		}
	}else if((removingEdge || removingVertix || addingEdge || subdivisioning) && (event.toElement.tagName == 'CANVAS')){
		deactivateCurrentAction();
	}
}

function deactivateCurrentAction(){
	removingEdge = removingVertix = addingEdge = subdivisioning = false;
	selectedVertix = -1;
	representation.status = '';
	representation.drawGraph();
	updateInfo();

}

function mouseDragged(){
	if(vertix >= 0 && dragging){
		representation.centers[vertix] = createVector(mouseX-offset.x, mouseY-offset.y);
		representation.drawGraph();
	}	
}

function mouseReleased(){
	vertix = -1;
	dragging = false;
}