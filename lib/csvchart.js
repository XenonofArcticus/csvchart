if(typeof exports !== "undefined") {
	global.Papa = require("./papaparse.min.js");
}

((exports) => {
	exports.parse = (data) => {
		// https://www.papaparse.com/docs#config
		var csv = Papa.parse(data, {
			dynamicTyping: true,
			skipEmptyLines: true,
			header: true
		}).data.map(e => { return {
			x: e["Search Volume"],
			y: e["Keyword Difficulty"],
			z: e["Keyword"]
		}});

		var xs = new Map();

		for(var v of csv) {
			// var x = Math.log(v.x);
			var x = v.x;
			var y = v.y;

			if(!xs.has(x)) xs.set(x, new Map());

			if(!xs.get(x).has(y)) xs.get(x).set(y, new Array());

			xs.get(x).get(y).push(v.z);
		}

		return xs;
	},

	exports.ChartJS = {
		parse: (data) => {
			var csvData = exports.parse(data);
			var chartData = new Array();

			for(const [kx, vx] of csvData) {
				for(var [ky, vy] of vx) {
					// chartData.push({x: kx, y: ky, label: vy.join(", ")});
					chartData.push({x: kx, y: ky, label: vy});
				}
			}

			return chartData;
		}
	},

	exports.Tabulator = {
		parse: (data) => {
			return Papa.parse(data, {
				dynamicTyping: true,
				skipEmptyLines: true,
				header: true
			}).data.map(e => { return {
				"Volume": e["Search Volume"],
				"Difficulty": e["Keyword Difficulty"],
				"Keyword": e["Keyword"]
			}});
		}
	}
})(typeof exports === "undefined" ? this["CSVChart"] = {} : exports);
