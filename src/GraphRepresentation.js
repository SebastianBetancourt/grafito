const vertixRadius = 16;
const sideLength = 200;

class GraphRepresentation{
	constructor(graph, centers = 0){
		this.graph = graph;
		if(centers == 0){
			this.centers = new Array(this.graph.vertices);
		}else{
			this.centers = centers;
		}

		this.ids ='abcdefghijklmnopqrstuvwxyz';
	}

	drawGraph(){
		this.drawEdges();
		this.drawVertices();
	}

	distributeVertices(){
		const graphCenter = createVector(window.innerWidth/2, window.innerHeight/2);
		//distributes the vertices equidistantly around a circle
		// given the distance between two consecutive vertices (sideLength) as a chord, this calculates the needed radius for the underlaying circle
		let radius = sideLength / (2*sin(PI/this.graph.vertices));
		if(this.graph.vertices == 1){
			radius = 0;			
		}
		let initialAngle = 0;
		if(this.graph.vertices % 2 == 0){
			initialAngle += PI/this.graph.vertices;
		}
		for(var i = 0; i < this.graph.vertices; i++){
			let angle = initialAngle+((i*TWO_PI)/this.graph.vertices);
			this.centers[i] = createVector(graphCenter.x+(radius*cos(angle)), graphCenter.y+(radius*sin(angle)));
		}
	}

	drawEdges(){
		background(255,255,255);
		// draws a line between two points if and only if these point appear to be connected on de ajdMAtrix
		for (var i = 0; i < this.graph.vertices; i++) {
			for (var j = 0; j <= i; j++) {
				let totalEdges = this.graph.adjMatrix[i][j] + this.graph.adjMatrix[j][i];
				if(this.graph instanceof UndirectedGraph){
					totalEdges = totalEdges / 2;
				}
				if(totalEdges > 0){
					if(i == j){
						//LOOPS
						for (var k = 0; k < (totalEdges/2); k++) {
							// control points will form an isoceles triangle with vertix on p0
							const height = 48;  // Distance from p0 to its opposite edge
							const base = 32; // half instance between p1 and p2
							//distribute loops simetrically around a point
							

							const graphCenter = createVector(window.innerWidth/2, window.innerHeight/2);
							let sub = p5.Vector.sub(this.centers[i], graphCenter).heading();
							let direction = (Math.ceil((k+1)/2)*Math.pow(-1,k)*(PI/4))+sub;

							//let direction = (Math.ceil((k+1)/2)*Math.pow(-1,k)*(PI/4))+((i*TWO_PI)/this.graph.vertices);
							// If the number of edges is odd, put the first one in the starting point
							if((totalEdges/2) % 2 != 0){
								if(k == 0){
									direction = sub;
									//direction = (i*TWO_PI)/this.graph.vertices;
								} else {
									direction = (Math.ceil(k/2)*Math.pow(-1,k)*(PI/4))+sub;
									//direction = (Math.ceil(k/2)*Math.pow(-1,k)*(PI/4))+((i*TWO_PI)/this.graph.vertices);
								}
							}
							let p0 = createVector(this.centers[i].x+(vertixRadius*cos(direction)),this.centers[i].y+(vertixRadius*sin(direction)));
							let p1 = createVector(this.centers[i].x+((height+vertixRadius)*cos(direction))+(base*cos(direction-HALF_PI)),this.centers[i].y+((height+vertixRadius)*sin(direction))+(base*sin(direction-HALF_PI)));
							let p2 = createVector(this.centers[i].x+((height+vertixRadius)*cos(direction))-(base*cos(direction-HALF_PI)),this.centers[i].y+((height+vertixRadius)*sin(direction))-(base*sin(direction-HALF_PI)));
							noFill();
							bezier(p0.x,p0.y,p1.x,p1.y,p2.x,p2.y,p0.x,p0.y);
							if(this.graph instanceof DirectedGraph){
								this.drawArrowHead(p2,p0,0);
							}
						}
						
					}else if(totalEdges == 1){
						//SINGLE EDGES
						noFill();
						line(this.centers[i].x, this.centers[i].y,this.centers[j].x, this.centers[j].y);
						if(this.graph instanceof DirectedGraph){
							if(this.graph.adjMatrix[i][j] > this.graph.adjMatrix[j][i]){
								this.drawArrowHead(this.centers[i],this.centers[j],vertixRadius);
							} else {
								this.drawArrowHead(this.centers[j],this.centers[i],this.centers[i].dist(this.centers[j])/2);
							}
					}
					} else {
						// MULTIPLE EDGES
						for (var k = 0; k < totalEdges; k++) {
							// control points will form a parallelogram, with p0 and p3 on i vertix and j vertix, respectively
							let direction = p5.Vector.sub(this.centers[j], this.centers[i]).heading();
							const stepHeight = 18;
							//distance from p0 to p1 and p3 to p2
							let height = stepHeight*Math.pow(-1,k)*(Math.ceil(k/2));
							let p0 = this.centers[i];
							let p3 = this.centers[j];
							// direction of the line between p0 and p1, which is the same direction from p3 to p2
							let curveDirection = HALF_PI*0.5*Math.pow(-1,k);
							// if the total of edges is odd, make the first one straight
							if(totalEdges % 2 != 0){
								if(k == 0){
									curveDirection = direction;
								}
							}else{
								height = stepHeight*Math.pow(-1,k)*(Math.ceil((k+1)/2));
							}
							
							let p1 = createVector(p0.x+(cos(direction-(HALF_PI-curveDirection))*height),p0.y+(sin(direction-(HALF_PI-curveDirection))*height));
							let p2 = createVector(p3.x+(cos(direction-(HALF_PI+curveDirection))*height),p3.y+(sin(direction-(HALF_PI+curveDirection))*height));
							noFill();
							//quad(p0.x,p0.y,p1.x,p1.y,p2.x,p2.y,p3.x,p3.y); // draws the control points
							bezier(p0.x,p0.y,p1.x,p1.y,p2.x,p2.y,p3.x,p3.y);
							if(this.graph instanceof DirectedGraph){
								let arrowStart = createVector(bezierPoint(p0.x,p1.x,p2.x,p3.x,0.45),bezierPoint(p0.y,p1.y,p2.y,p3.y,0.45));
								let arrowEnd = createVector(bezierPoint(p0.x,p1.x,p2.x,p3.x,0.51),bezierPoint(p0.y,p1.y,p2.y,p3.y,0.51));
								// if the number curve its even and haven't finish the i to j arrows, or if the j to i arrows were already finished, do a i to j arrow head
								if((k % 2 == 0 && Math.ceil(k/2) < this.graph.adjMatrix[i][j]) || (Math.floor(k/2) >= this.graph.adjMatrix[j][i])){
									this.drawArrowHead(arrowStart,arrowEnd,0);
								}else{
									this.drawArrowHead(arrowEnd,arrowStart,0);
								}
							}
						}
					}
				}
			}
		}
	}

	drawVertices(){
		// draw circles as vertices
		ellipseMode(RADIUS);
		for (var i = 0; i < this.graph.vertices; i++) {
			fill('white');
			ellipse(this.centers[i].x,this.centers[i].y,vertixRadius);
			fill('black');
			textAlign(CENTER, CENTER);
			text(this.ids[i],this.centers[i].x,this.centers[i].y);
		}
	}

	drawArrowHead(from, to, distanceToHead){
		let direction = p5.Vector.sub(to, from).heading();
		// Head is an isoceles triangle with vertix on the line from-to with distanceToHead distance from to
		const height = 7;
		const base = 4;
		fill('black');
		triangle(
			to.x-(cos(direction)*distanceToHead),
			to.y-(sin(direction)*distanceToHead), 
			to.x-(cos(direction-HALF_PI)*base)-(cos(direction)*(distanceToHead+height)),
			to.y-(sin(direction-HALF_PI)*base)-(sin(direction)*(distanceToHead+height)),
			to.x-(cos(direction+HALF_PI)*base)-(cos(direction)*(distanceToHead+height)),
			to.y-(sin(direction+HALF_PI)*base)-(sin(direction)*(distanceToHead+height)));
	}

	highlightVertix(node, color){
		fill(color);
		noStroke();
		ellipse(this.centers[node].x,this.centers[node].y,vertixRadius+2);
		this.drawVertices();
		stroke('Black');
	}

	// Calculates distance from vector to each and every vertixCenter, and if any of these is lesser than vertixRadius, returns the number of the vertix. Otherwise returns -1.
	// Is this coordinate on a vertix? If so, which one?
	vectorOnVertix(vector, distance = vertixRadius){
		for (var i = 0; i < this.graph.vertices; i++) {
			if(vector.dist(this.centers[i]) <= distance){
				return i;
			}
		}
		return -1;
	}

	getCentersInText(){
		var line = "";
		this.centers.forEach(center =>{
			line += center.x + ";" + center.y + ",";
		});
		return line.slice(0,-1);
	}

	addVertix(){
		const graphCenter = createVector(window.innerWidth/2, window.innerHeight/2);
		function sum(total,currentValue, index,arr){
			return total + (graphCenter.dist(currentValue)/arr.length);
		}
		let averageDistance = this.centers.reduce(sum, 0);
		let vector = 0;
		do{
			vector = createVector((graphCenter.x+((Math.random()*2)-1)*averageDistance)+50,(graphCenter.y+((Math.random()*2)-1)*averageDistance)+50);
		}while(this.vectorOnVertix(vector, 2*vertixRadius) != -1);
		this.centers.push(vector);
		
	}

	removeVertix(i){
		centers.splice(i,1);
		ids.splice(i,1);
	}
}