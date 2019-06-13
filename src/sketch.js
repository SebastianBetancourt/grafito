"use strict;"

let graph = new DirectedGraph([
	[0,0,0,0],
	[0,0,0,0],
	[0,1,0,0],
	[1,1,0,0]]);
let representation = new GraphRepresentation();

function setup() {
	createCanvas(windowWidth-4,windowHeight-4);
	representation.distributeVertices();
	representation.drawGraph();
	updateInfo();
	initGUI();
}

function draw() {
	  	
}


