"use strict;"

let graph = new DirectedGraph([
	[0,2,3,4],
	[5,2,6,8],
	[2,1,0,0],
	[0,0,3,2]]);
let representation = new GraphRepresentation(graph);
function setup() {
	createCanvas(windowWidth-4,windowHeight-4);
	representation.distributeVertices();
	representation.drawGraph();
	initGUI();
}

function draw() {
	  	
}


