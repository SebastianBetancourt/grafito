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

	removeVertix(vertix){
		this.vertices--;
		this.adjMatrix.splice(vertix, 1);
		for (var j = 0; j < this.vertices; j++) {
			this.adjMatrix[j].splice(vertix, 1);
		}
	}

	addEdge(from, to){
		this.adjMatrix[from][to]++;
	}

	removeEdge(from, to){
		if(this.adjMatrix[from][to] > 0){
			this.adjMatrix[from][to]--;	
		}
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

	getAdjMatrixInText(){
		var matrix = "";
		this.adjMatrix.map(row => {
			let line = "";
			row.forEach(value => {line += value + ",";});
			return line.slice(0,-1);
		}).forEach(cmprssdLine => {matrix += cmprssdLine + "\n";});
		return matrix;
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

function generateGraph(type, a = 1, b = 1){
	var matrix = [];
	for (var i = 0; i < a; i++) {
		matrix.push(new Array(a));
		for (var j = 0; j < a; j++) {
			matrix[i][j] = 0;
		}
	}
	switch(type){
		case 'complete':
			for (var i = 0; i < a; i++) {
				for (var j = 0; j < a; j++) {
					if(i != j){
						matrix[i][j] = 1;
					}
				}
			}
			break;
		case 'cycle':
			for (var i = 0; i < a; i++) {
				matrix[i][(i+1) % a] = 1;
				matrix[i][(i-1) % a] = 1;
			}
			break;
		case 'wheel':
			// initializing matrix
			var matrix = [];
			for (var i = 0; i < a+1; i++) {
				matrix.push(new Array(a+1));
				for (var j = 0; j < a+1; j++) {
					matrix[i][j] = 0;
				}
			}

			for (var i = 0; i < a; i++) {
				matrix[i][(i+1) % a] = 1;
				matrix[i][(i-1) % a] = 1;
				matrix[i][a] = 1;
				matrix[a][i] = 1;
			}
			break;
		case 'bipartite':
			var matrix = [];
			for (var i = 0; i < a+b; i++) {
				matrix.push(new Array(a));
				for (var j = 0; j < a+b; j++) {
					matrix[i][j] = 0;
				}
			}
			for (var i = 0; i < a+b; i++) {
				for (var j = 0; j < i; j++) {
					if (j < a && i >= a){
						matrix[i][j] = 1;
						matrix[j][i] = 1;
					}
				}
			}
			break;
	}
	return new UndirectedGraph(matrix);
}