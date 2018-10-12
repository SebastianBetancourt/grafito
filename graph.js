class Graph {

	constructor(nodes = 1){

		// Si el parametro es un matriz cuadradada, se toma como matriz de adyacencia
		if(nodes.isArray() && nodes.length == nodes[0].length){
			this.nodes = nodes.length;
			this.adjMatrix = nodes;	
		} else {
			// Creacion matriz adyacencia
			this.nodes = nodes;
			this.adjMatrix = new Array(nodes);
			for (var i = 0; i < nodes; i++) {
				this.adjMatrix[i] = new Array(nodes);
				for (var j = 0; j < nodes; j++) {
					this.adjMatrix[i][j] = 0;
				}
			}
		}
	}

	addNode(){
		this.nodes++;
		this.adjMatrix.push(new Array(nodes));
		for (var j = 0; j < nodes; j++) {
			this.adjMatrix[nodes-1][j] = 0;
		}
	}

	deleteNode(node){
		this.nodes--;
		this.adjMatrix.splice(node, 1);
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
		for (var i = 0; i < nodes; i++) {
			if(this.adjMatrix[i][i] > 0){
				return false;
			}
		}
	}

	hasMultipleEdges(){
		for (var i = 0; i < nodes; i++) {
			for (var j = 0; j < nodes; j++) {
				if(this.adjMatrix[i][j] > 1){
					return false;
				}
			}
		}
	}

}

class UndirectedGraph extends Graph {

	addEdge(from, to){
		super.addEdge(from, to);
		super.addEdge(to, from);
	}

	deleteEdge(from, to){
		super.deleteEdge(from, to);
		super.deleteEdge(to, from);
	}

	isSimple(){
		return !(hasMultipleEdges() || hasLoops());
	}

	isMultigraph(){
		return !hasLoops();
	}

	isPseudograph(){
		return true;
	}


}

class DirectedGraph extends Graph {

	isSimple(){
		return !(hasMultipleEdges() || hasLoops());
	}

	isMultigraph(){
		return true;
	}
}