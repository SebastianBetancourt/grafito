class Matrix{
	constructor(vertices){
		if(Array.isArray(vertices) && Array.isArray(vertices[0])){
			this.matrix = vertices;
		} else {
			this.matrix = new Array(vertices);
			for (var i = 0; i < vertices; i++) {
				this.matrix[i] = new Array(vertices);
				for (var j = 0; j < vertices; j++) {
					this.matrix[i][j] = 0;
				}
			}
		}
	}

	getValue(i, j){
		return this.matrix[i][j];
	}

	setValue(i, j, value){
		this.matrix[i][j] = value;
	}

	getRowCount(){
		return this.matrix.length;
	}


	getColumnCount(){
		return this.matrix[0].length;
	}

	addRow(value = 0, at = this.matrix.length){
		// at: me paro en at y de aquí para adelante añado
		this.matrix.splice(at, 0, new Array(this.getColumnCount()).fill(value));
	}

	removeRow(at, howMany = 1){
		this.matrix.splice(at, howMany);
	}

	addColumn(value = 0, at = this.matrix.length){
		for (var i = 0; i < this.getRowCount(); i++) {
			this.matrix[i].splice(at, 0, value);
		}
	}

	removeColumn(at = this.matrix.length){
		for (var i = 0; i < this.getRowCount(); i++) {
			this.matrix[i].splice(at, 1);
		}
	}

	toString(){
		var text = "";
		this.matrix.map(row => {
			let line = "";
			row.forEach(value => {line += value + ",";});
			return line.slice(0,-1);
		}).forEach(cmprssdLine => {text += cmprssdLine + "\n";});
		return text;
	}

	fromString(text){
		this.matrix = text.split('\n').map(col => {
			return col.split(',').map(x => {return parseInt(x, 10)});
		});
		return this;
}

	copy(){
		return new Matrix(this.matrix.map(function(row){return row.slice();}));
	}

}

