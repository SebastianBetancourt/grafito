class Graph {

	constructor(vertices, weights = []){
		if(vertices instanceof Matrix){
			this.adjMatrix = vertices.copy();
		}else{
			this.adjMatrix = new Matrix(vertices);
		}
		if(weights instanceof Matrix){
			this.wMatrix = weights.copy();
		}else{
			this.wMatrix = new Matrix(this.getVertixCount());
		}
		this.updateWeightMatrix();
		this.warshalls = [];
	}

	getVertixCount(){
		return this.adjMatrix.getRowCount();	
	}

	getEdgeCount(){
		var edges = 0;
		for (var i = 0; i < this.getVertixCount(); i++) {
			for (var j = 0; j < this.getVertixCount(); j++) {
				edges += this.adjMatrix.getValue(i, j);
			}
		}
		if(this instanceof UndirectedGraph){
			edges = edges / 2;
		}
		return edges;
	}

	addVertix(){
		this.adjMatrix.addRow();
		this.adjMatrix.addColumn();
		this.wMatrix.addRow(Infinity);
		this.wMatrix.addColumn(Infinity);
	}

	removeVertix(vertix){
		this.adjMatrix.removeRow(vertix);
		this.adjMatrix.removeColumn(vertix);
		this.wMatrix.removeRow(vertix);
		this.wMatrix.removeColumn(vertix);
	}

	addEdge(from, to){
		this.adjMatrix.setValue(from, to, this.adjMatrix.getValue(from, to)+1);
	}

	removeEdge(from, to){
		if(this.adjMatrix.getValue(from, to) > 0){
			this.adjMatrix.setValue(from, to, this.adjMatrix.getValue(from, to)-1);	
		}
	}

	areAdjacent(from, to){
		return this.adjMatrix.getValue(from, to) > 0;
	}

	hasLoops(){
		for (var i = 0; i < this.getVertixCount(); i++) {
			if(this.adjMatrix.getValue(i, i) > 0){
				return true;
			}
		}
		return false;
	}

	hasMultipleEdges(){
		for (var i = 0; i < this.getVertixCount(); i++) {
			for (var j = 0; j < this.getVertixCount(); j++) {
				if(this.adjMatrix.getValue(i, j) > 1){
					return true;
				}
			}
		}
		return false;
	}

	updateWeightMatrix(){
		for (var i = 0; i < this.getVertixCount(); i++) {
			for (var j = 0; j < this.getVertixCount(); j++) {

				if(i == j){
					if(this.adjMatrix.getValue(i,j) == 0){
						this.wMatrix.setValue(i, j, 0);
					}else if(this.adjMatrix.getValue(i,j) == 1){
						this.wMatrix.setValue(i, j, 1);
					}
				}else if(this.wMatrix.getValue(i, j) == Infinity && this.adjMatrix.getValue(i,j) == 1){
					this.wMatrix.setValue(i, j, 1);

				}else if(this.wMatrix.getValue(i, j) != Infinity && this.adjMatrix.getValue(i,j) == 0){
					this.wMatrix.setValue(i, j, Infinity);
				}
				if(this instanceof UndirectedGraph){
					this.wMatrix.setValue(j, i, this.wMatrix.getValue(i, j));	
				}

			}
		}
	}

	computeWarshall(n = this.getVertixCount()){
		//predecessors
		var firstPredecessor = new Matrix(this.getVertixCount());
		for (var i = 0; i < this.getVertixCount(); i++) {
				for (var j = 0; j < this.getVertixCount(); j++) {
					if(this.wMatrix.getValue(i,j) == Infinity || i == j){
						firstPredecessor.setValue(i, j, '×');
					}else{
						firstPredecessor.setValue(i, j, i+1);
					}
				}
			}
		this.warshallPredecessors = [firstPredecessor]

		this.warshalls = [this.wMatrix];

		//algorithm
		for (var k = 1; k <= n; k++) {
			this.warshalls.push(new Matrix(this.getVertixCount()));
			this.warshallPredecessors.push(new Matrix(this.getVertixCount()));
			for (var i = 0; i < this.getVertixCount(); i++) {
				for (var j = 0; j < this.getVertixCount(); j++) {
					if(this.warshalls[k-1].getValue(i,j) <= this.warshalls[k-1].getValue(i,k-1)+this.warshalls[k-1].getValue(k-1,j)){
						this.warshalls[k].setValue(i,j, this.warshalls[k-1].getValue(i,j));
						this.warshallPredecessors[k].setValue(i, j, this.warshallPredecessors[k-1].getValue(i,j));
					}else{
						this.warshalls[k].setValue(i, j, this.warshalls[k-1].getValue(i,k-1)+this.warshalls[k-1].getValue(k-1,j));
						this.warshallPredecessors[k].setValue(i, j, this.warshallPredecessors[k-1].getValue(k-1,j));
					}
				}
			}
		}
	}

	elementarySubdivision(from, to){
		this.removeEdge(from,to);
		this.addVertix();
		let lastVertix = this.getVertixCount()-1;
		this.addEdge(from, lastVertix);
		this.addEdge(lastVertix,to);
	}

}

class UndirectedGraph extends Graph {

	constructor(vertices = 1, weights = []){
		super(vertices, weights);
	}

	getType(){
		if(super.hasMultipleEdges() && super.hasLoops()){
			return 'pseudograph';
		}else if (super.hasMultipleEdges()){
			return 'multigraph';
		}else{
			return 'simple graph';
		}
	}

	addEdge(from, to){
		super.addEdge(from, to);
		super.addEdge(to, from);
	}

	removeEdge(from, to){
		super.removeEdge(from, to);
		super.removeEdge(to, from);
	}

	getDegree(vertix){
		var degree = 0;
		for (var i = 0; i < this.getVertixCount(); i++) {
				degree += this.adjMatrix.getValue(i, vertix);
		}
		return degree;
	}

	getDegreeSequence(){
		var sequence = [];
		for (var i = 0; i < this.getVertixCount(); i++) {
			sequence.push(this.getDegree(i));
		}
		sequence.sort(function(a, b){return b-a});
		return sequence;
	}

	generateGraph(type, a = 1, b = 1){
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
					var b = (i-1) % a;
					if(b < 0){
						b = a + b;
					}
					matrix[i][b] = 1;
				}
				break;
			case 'wheel':
				matrix.push(new Array(a+1));
				for (var j = 0; j < a+1; j++) {
					matrix[a][j] = 0;
				}

				for (var i = 0; i < a; i++) {
					matrix[i][(i+1) % a] = 1;
					var b = (i-1) % a;
					if(b < 0){
						b = a + b;	
					}
					matrix[i][b] = 1;

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
		this.adjMatrix = new Matrix(matrix);
		this.updateWeightMatrix();
		return this;
	}

}

class DirectedGraph extends Graph {

	constructor(vertices = 1, weights = []){
		super(vertices, weights);
	}

	getType(){
		if(super.hasMultipleEdges()){
			return 'directed multigraph';
		}else{
			return 'directed graph';
		}
	}

	getDegree(vertix){
		return this.getInDegree(vertix)+this.getOutDegree(vertix);
	}

	getInDegree(vertix){
		var degree = 0;
		for (var i = 0; i < this.getVertixCount(); i++) {
			degree += this.adjMatrix.getValue(i, vertix);
		}
		return degree;
	}

	getOutDegree(vertix){
		var degree = 0;
		for (var i = 0; i < this.getVertixCount(); i++) {
			degree += this.adjMatrix.getValue(vertix, i);
		}
		return degree;
	}

	getDegreeSequence(){
		var sequence = [];
		for (var i = 0; i < this.getVertixCount(); i++) {
			sequence.push(this.getDegree(i));
		}
		sequence.sort(function(a, b){return b-a});
		return sequence;
	}

}



