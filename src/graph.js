class Graph {

	constructor(vertices){

		// Si el parametro es un matriz cuadradada, se toma como matriz de adyacencia
		if(Array.isArray(vertices) && vertices.length == vertices[0].length){
			this.vertices = vertices.length;
			this.adjMatrix = vertices;	
		} else {
			// Creacion matriz adyacencia
			this.vertices = vertices;
			this.adjMatrix = new Array(vertices);
			for (var i = 0; i < vertices; i++) {
				this.adjMatrix[i] = new Array(vertices);
				for (var j = 0; j < vertices; j++) {
					this.adjMatrix[i][j] = 0;
				}
			}
		}
	}

	addVertix(){
		this.adjMatrix.push(new Array(this.vertices).fill(0));
		this.vertices++;
		for (var j = 0; j < this.vertices; j++) {
			this.adjMatrix[j].push(0);
		}
	}

	deleteVertix(vertix){
		this.vertices--;
		this.adjMatrix.splice(vertix, 1);
		for (var j = 0; j < this.vertices; j++) {
			this.adjMatrix[j].splice(vertix, 1);
		}
	}

	addEdge(from, to){
		this.adjMatrix[from][to]++;
	}

	deleteEdge(from, to){
		this.adjMatrix[from][to]--;	
	}

	areAdjacent(from, to){
		return this.adjMatrix[from][to] > 0;
	}

	hasLoops(){
		for (var i = 0; i < this.vertices; i++) {
			if(this.adjMatrix[i][i] > 0){
				return true;
			}
		}
		return false;
	}

	hasMultipleEdges(){
		for (var i = 0; i < this.vertices; i++) {
			for (var j = 0; j < this.vertices; j++) {
				if(this.adjMatrix[i][j] > 1){
					return true;
				}
			}
		}
		return false;
	}

	printAdjMatrix(){
		this.adjMatrix.map(row => {
			let line = "";
			row.forEach(value => {line += value});
			return line;
		}).forEach(cmprssdLine => {console.log(cmprssdLine)});
	}
}

class UndirectedGraph extends Graph {

	constructor(vertices = 1){
		super(vertices);
	}

	addEdge(from, to){
		super.addEdge(from, to);
		super.addEdge(to, from);
	}

	deleteEdge(from, to){
		super.deleteEdge(from, to);
		super.deleteEdge(to, from);
	}

	isSimple(){
		return !(super.hasMultipleEdges() || super.hasLoops());
	}

	isMultigraph(){
		return !super.hasLoops();
	}

	isPseudograph(){
		return true;
	}


}

class DirectedGraph extends Graph {

	constructor(vertices = 1){
		super(vertices);
	}

	isSimple(){
		return !(super.hasMultipleEdges() || super.hasLoops());
	}

	isMultigraph(){
		return true;
	}
}