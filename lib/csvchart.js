if(typeof exports !== "undefined") {
	global.Papa = require("./papaparse.min.js");
}

((exports) => {
// (exports => {
	exports.parse = (data) => {
	// exports.parse = data => {
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
		parse: data => {
			var csvData = exports.parse(data);
			var chartData = new Array();

			for(const [kx, vx] of csvData) {
				for(var [ky, vy] of vx) {
					// chartData.push({x: kx, y: ky, label: vy.join(", ")});
					chartData.push({x: kx, y: ky, label: vy});
				}
			}

			return chartData;
		},

		create: (id, d) => {
			const ctx = document.getElementById(id).getContext("2d");
			const half = Math.ceil(d.length / 2);

			/* const data = {
				datasets: [{
					label: "Foo",
					data: d.splice(0, half),
					backgroundColor: "#9be"
				}, {
					label: "Bar",
					data: d.splice(-half),
					backgroundColor: "#b72"
				}]
			}; */

			const data = {
				datasets: [{
					// label: "Main",
					data: d,
					// backgroundColor: "#36f"
					backgroundColor: "rgba(60, 120, 200, 50)"
				}]
			};

			return new Chart(ctx, {
				type: "scatter",
				plugins: [ChartDataLabels, ChartZoom],
				data: data,
				options: {
					// responsive: false,
					// animations: false,
					maintainAspectRatio: false,
					elements: {
						point: {
							radius: 3
							// radius: ctx => { return randomInteger(1, 10); }
						}
					},
					animation: {
						onComplete: updateFooter
					},
					plugins: {
						legend: {
							display: false
						},
						// https://www.chartjs.org/docs/latest/configuration/tooltip.html
						tooltip: {
							callbacks: {
								// TODO: ctx is actually an array, as is raw.label (which will
								// contain multiple strings if the ptoins have been "merged").
								title: ctx => {
									// return ctx[0].raw.label[0];
									// return ctx[0].raw.label.join(", ");
									return ctx[0].raw.label;
								},
								label: ctx => {
									return "Vol " + ctx.parsed.x + " Diff " + ctx.parsed.y;
								}
							}

							/*
							// TODO: https://www.chartjs.org/docs/latest/samples/tooltip/html.html
							enabled: false,
							external: function (context) {
								// Tooltip Element
								let tooltipEl = document.getElementById('chartjs-tooltip');

								// Create element on first render
								if (!tooltipEl) {
									tooltipEl = document.createElement('div');
									tooltipEl.id = 'chartjs-tooltip';
									tooltipEl.innerHTML = '<table></table>';
									document.body.appendChild(tooltipEl);
								}

								// Hide if no tooltip
								const tooltipModel = context.tooltip;
								if (tooltipModel.opacity === 0) {
									tooltipEl.style.opacity = 0;
									return;
								}

								// Set caret Position
								tooltipEl.classList.remove('above', 'below', 'no-transform');
								if (tooltipModel.yAlign) {
									tooltipEl.classList.add(tooltipModel.yAlign);
								} else {
									tooltipEl.classList.add('no-transform');
								}

								function getBody(bodyItem) {
									return bodyItem.lines;
								}

								// Set Text
								if (tooltipModel.body) {
									const titleLines = tooltipModel.title || [];
									const bodyLines = tooltipModel.body.map(getBody);

									let innerHtml = '<thead>';

									titleLines.forEach(function (title) {
										innerHtml += '<tr><th>' + title + '</th></tr>';
									});
									innerHtml += '</thead><tbody>';

									bodyLines.forEach(function (body, i) {
										const colors = tooltipModel.labelColors[i];
										let style = 'background:' + colors.backgroundColor;
										style += '; border-color:' + colors.borderColor;
										style += '; border-width: 2px';
										const span = '<span style="' + style + '"></span>';
										innerHtml += '<tr><td>' + span + body + '</td></tr>';
									});
									innerHtml += '</tbody>';

									let tableRoot = tooltipEl.querySelector('table');
									tableRoot.innerHTML = innerHtml;
								}

								const position = context.chart.canvas.getBoundingClientRect();
								const bodyFont = Chart.helpers.toFont(tooltipModel.options.bodyFont);

								// Display, position, and set styles for font
								tooltipEl.style.opacity = 1;
								tooltipEl.style.position = 'absolute';
								tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
								tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
								tooltipEl.style.font = bodyFont.string;
								tooltipEl.style.padding = tooltipModel.padding + 'px ' + tooltipModel.padding + 'px';
								tooltipEl.style.pointerEvents = 'none';
							} */
						},
						// https://chartjs-plugin-datalabels.netlify.app/guide/options.html#scriptable-options
						datalabels: {
							// https://chartjs-plugin-datalabels.netlify.app/guide/positioning.html#overlap
							display: "auto",
							align: "top",
							// color: "rgb(240, 240, 240)",
							// color: "rgb(255, 99, 132)",
							// backgroundColor: "rgb(175, 175, 175)",
							font: {
								size: 11,
								lineHeight: 1
								// weight: "bold"
							},
							formatter: function(e) {
								return e.label;
							}
						},
						// https://www.chartjs.org/chartjs-plugin-zoom/latest/guide/options.html
						zoom: {
							/* limits: {
								x: {min: 0, max: 1000, minRange: 1},
								y: {min: 0, max: 100, minRange: 1}
							}, */
							pan: {
								enabled: true,
								mode: "xy"
							},
							zoom: {
								wheel: {
									enabled: true
								},
								mode: "xy"
							}
						}
					},
					// https://www.chartjs.org/docs/3.6.0/samples/scale-options/grid.html
					scales: {
						x: {
							type: "logarithmic",
							grid: {
								// drawBorder: false,
								color: ctx => {
									if(ctx.tick.value == 10) return "#f00";

									return "#bbb";
								}
							},
							ticks: {
								color: "#f00",
								font: {
									weight: "bold"
								}
							},
							/* grid: {
								display: DISPLAY,
								drawBorder: BORDER,
								drawOnChartArea: CHART_AREA,
								drawTicks: TICKS,
							} */
						},
						y: {
							ticks: {
								color: "#f00",
								font: {
									weight: "bold"
								}
							},
							grid: {
								// drawBorder: false,
								color: ctx => {
									if(ctx.tick.value == 0) return "#f00";

									return "#bbb";
								}
							}
						}
					}
				}
			});
		}
	},

	exports.Tabulator = {
		parse: data => {
			return Papa.parse(data, {
				dynamicTyping: true,
				skipEmptyLines: true,
				header: true
			}).data.map(e => { return {
				"Volume": e["Search Volume"],
				"Difficulty": e["Keyword Difficulty"],
				"Keyword": e["Keyword"]
			}});
		},

		create: (id, d) => {
			return new Tabulator(id, {
				data: d,
				/* columnDefaults: {
					headerTooltip: true,
					tooltip: true
				}, */
				// autoColumns: true,
				columns: [
					// http://tabulator.info/examples/5.3#selectable-tick
					/* {
						formatter: "rowSelection",
						titleFormatter: "rowSelection",
						hozAlign: "center",
						headerSort: false,
						cellClick: (e, cell) => {
							cell.getRow().toggleSelect();
							console.log("Toggling:", cell.getRow());
						}
					}, */
					// http://tabulator.info/docs/5.3/edit#editor-checkbox
					// http://tabulator.info/docs/5.3/format#formatter-tickcross
					{
						title: "Visible",
						field: "Visible",
						formatter: (cell, formatterParams, onRendered) => {
							// cell - the cell component
							// formatterParams - parameters set for the column
							// onRendered - function to call when the formatter has been rendered
							// return "Mr" + cell.getValue();
							return `<label><input type="checkbox" class="filled-in" checked><span></span></label>`;
						},
						// titleFormatter: "rowSelection",
						hozAlign: "center",
						headerSort: false,
						// TODO: This needs to be set on the INPUT, not on the ENTIRE CELL DIV!
						// Unless, somehow, I can programmatically change the checked/unchecked
						// state!
						cellClick: (e, cell) => { if(e.detail == 1) {
							var d = cell.getRow().getData();

							cell.getRow().toggleSelect();

							if(d.Visible == undefined) d.Visible = true;

							d.Visible = !d.Visible;

							// TODO: Clean this up!
							// cell.getElement().children[0].children[0].checked = d.Visible;

							console.log(`${d.Keyword} = ${d.Visible}`);
						}}
					},
					{ title: "Volume", field: "Volume", sorter: "number" },
					{ title: "Difficulty", field: "Difficulty", sorter: "number" },
					{ title: "Keyword", field: "Keyword" }
				],
				initialSort: [{
					column: "Volume",
					dir: "desc"
				}]
			});
		}
	}

	exports.testCSV = `Keyword,Position,Previous position,Search Volume,Keyword Difficulty,CPC,URL,Traffic,Traffic (%),Traffic Cost,Competition,Number of Results,Trends,Timestamp,SERP Features by Keyword,Keyword Intents
gravity aerial arts,1,1,260,24,0.00,http://www.gravityaerialarts.com/,208,63.03,0.00,0.02,4400000,"[44,44,44,54,54,54,67,82,100,82,82,82]",2022-01-26,"Knowledge panel, Site links, Reviews, Video Carousel, FAQ",navigational
aerial dance colorado,1,3,90,23,0.00,http://www.gravityaerialarts.com/,42,12.72,0.00,0,18500000,"[100,0,14,0,14,14,29,14,29,14,0,29]",2022-01-29,"Local pack, Site links, Reviews, Video, People also ask",commercial
aerial arts,13,13,3600,30,1.51,http://www.gravityaerialarts.com/,32,9.69,48.00,0.1,407000000,"[67,67,100,81,100,100,100,100,100,100,100,100]",2022-01-27,"Local pack, Image pack, Site links, Reviews, Video, Video Carousel, People also ask",commercial
aerial arts summer camp,1,1,30,7,0.00,http://www.gravityaerialarts.com/camps,14,4.24,0.00,0.14,7940000,"[20,0,80,40,20,20,40,20,20,20,100,20]",2022-01-30,Reviews,informational
aerial dance classes denver,2,2,70,33,0.00,http://www.gravityaerialarts.com/,9,2.72,0.00,0.43,6300000,"[20,0,20,40,40,100,0,80,80,20,0,20]",2022-01-16,"Local pack, Site links, Reviews, Video",commercial
aerial yoga denver,9,9,210,41,1.97,http://www.gravityaerialarts.com/,6,1.81,12.00,0.14,2820000,"[42,35,65,65,81,100,65,100,81,65,100,81]",2022-01-27,"Local pack, Reviews, Video, Video Carousel, People also ask, FAQ",commercial
gravity arts dance center,3,3,70,0,0.00,http://www.gravityaerialarts.com/,6,1.81,0.00,0,11300000,"[0,11,22,56,0,0,11,0,0,0,56,100]",2022-01-17,"Site links, Reviews, Video Carousel",informational
aerial classes,20,25,1900,40,1.23,http://www.gravityaerialarts.com/,5,1.51,7.00,0.05,1040000000,"[54,54,79,79,79,100,100,100,100,79,100,100]",2022-01-29,"Local pack, Video Carousel, People also ask, FAQ",commercial
aerial silks colorado springs,10,18,90,10,0.00,http://www.gravityaerialarts.com/,2,0.6,0.00,0.02,91,"[14,14,14,43,14,14,14,14,14,71,100,14]",2022-01-29,"Local pack, Image pack, Site links, Reviews, Video, People also ask",commercial
aerial dance classes,17,17,590,42,2.02,http://www.gravityaerialarts.com/,2,0.6,4.00,0.08,23600000,"[67,54,67,67,82,82,100,67,82,100,82,67]",2022-01-16,"Local pack, Reviews, Video Carousel, People also ask",commercial
circus school denver,5,5,40,15,0.00,http://www.gravityaerialarts.com/,2,0.6,0.00,0.03,5380000,"[100,43,14,14,43,71,29,43,14,14,14,29]",2022-01-26,"Local pack, Site links, Reviews, Video",commercial
denver trapeze school,5,5,30,10,0.00,http://www.gravityaerialarts.com/,1,0.3,0.00,0,548000,"[0,0,0,0,0,0,0,0,0,100,0,100]",2022-01-29,"Local pack, Site links, Reviews, Video",commercial
dancing superhero audition 2019,7,9,30,8,0.00,http://www.gravityaerialarts.com/workshopsandevents/2019/12/14/auditon-for-an-aeiral-superhero-production,1,0.3,0.00,0,44,"[0,0,0,0,50,0,0,100,0,0,50,0]",2022-01-29,"Image pack, Video Carousel",informational
aerial dance academy,93,93,30,26,0.00,http://www.gravityaerialarts.com/,0,0,0.00,0,8820000,"[100,0,20,40,20,20,20,20,0,20,80,20]",2022-01-29,"Knowledge panel, Image pack, Site links, Reviews, Video Carousel, People also ask",informational
pole dancing classes denver co,57,57,30,19,0.00,http://www.gravityaerialarts.com/,0,0,0.00,0.09,9190000,"[3,3,3,3,3,3,5,100,3,3,3,5]",2022-01-26,"Local pack, Site links, Reviews, Video, People also ask, FAQ",commercial
aerial snack,63,63,70,11,0.00,http://www.gravityaerialarts.com/camps,0,0,0.00,0.93,13900000,"[25,0,25,25,25,50,25,25,25,25,25,100]",2022-01-16,"Knowledge panel, Image pack, Site links, Reviews, Image, Video Carousel","informational, transactional"
msa circus arts,50,50,170,28,1.37,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0.01,98,"[35,27,27,35,54,65,65,65,100,81,81,100]",2022-01-19,"Knowledge panel, Site links, Reviews, FAQ",navigational
contortion convention,61,39,30,12,0.00,http://www.gravityaerialarts.com/workshopsandevents/2018/3/28/contortion-and-all-level-flexibility,0,0,0.00,0.06,97,"[0,0,11,11,11,100,0,0,11,11,11,11]",2022-01-29,"Site links, Reviews",informational
aerial hoop leg warmers,89,89,40,0,0.00,http://www.gravityaerialarts.com/workshopsandevents/2020/1/5/solo-amp-duo-tippy-lyra-series,0,0,0.00,1,805000,"[75,100,0,0,0,25,25,25,100,0,0,25]",2022-01-26,"Image pack, Reviews, Video",informational
circus themed summer camp,50,48,90,29,0.00,http://www.gravityaerialarts.com/camps/2018/6/18/summer-aerial-circus-camp,0,0,0.00,0,8940000,"[0,0,0,0,33,0,33,100,33,33,33,0]",2022-01-29,"Image pack, Video, FAQ",informational
aerial arts gym,44,44,30,22,0.00,http://www.gravityaerialarts.com/,0,0,0.00,0.05,20700000,"[20,20,40,80,20,100,60,20,20,20,20,20]",2022-01-29,"Local pack, Reviews",transactional
pole dancing classes denver,62,62,590,23,1.29,http://www.gravityaerialarts.com/,0,0,0.00,0.18,1830000,"[30,24,55,100,82,100,82,82,82,82,67,67]",2022-01-16,"Local pack, Site links, Reviews, Video, People also ask, FAQ",commercial
aerial hire,64,64,50,48,0.00,http://www.gravityaerialarts.com/hire-an-aerialist,0,0,0.00,0,73800000,"[0,0,0,0,0,0,14,14,57,100,0,0]",2022-01-18,,informational
how to become a professional aerialist,85,85,50,14,0.00,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0,1430000,"[20,60,20,100,20,20,20,20,20,20,20,20]",2022-01-19,"Video, Featured snippet, People also ask",informational
circus camp los angeles,77,77,40,8,0.00,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0.21,12700000,"[40,0,0,20,20,0,20,20,20,40,60,100]",2022-01-26,"Local pack, Site links, Reviews, Video",commercial
circus school new orleans,67,79,30,5,0.00,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0,7040000,"[14,29,100,71,100,29,71,0,14,14,14,14]",2022-01-29,"Local pack, Site links, Reviews",commercial
booth dance studio denver,67,0,30,17,0.00,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0,3700000,"[0,0,0,0,0,0,100,0,100,0,100,0]",2022-01-29,"Knowledge panel, Site links, Reviews, Video",informational
aerial dance near me,67,67,390,34,3.07,http://www.gravityaerialarts.com/,0,0,0.00,0.07,84800000,"[66,54,54,54,81,100,81,81,81,81,66,66]",2022-01-18,People also ask,transactional
imperial flyers denver,58,58,30,15,0.00,http://www.gravityaerialarts.com/workshopsandevents,0,0,0.00,0,1570000,"[100,0,80,20,0,0,100,100,40,20,20,20]",2022-01-25,"Knowledge panel, Image pack, Site links, Video",navigational
circus in denver 2019,87,87,70,5,0.00,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0,8890000,"[0,0,0,0,0,0,0,0,0,0,100,0]",2022-01-16,"Reviews, Video",informational
youth aerial classes near me,41,41,170,20,2.82,http://www.gravityaerialarts.com/,0,0,0.00,0.07,17500000,"[54,42,42,42,65,81,81,81,81,100,100,54]",2022-01-28,"Local pack, People also ask, FAQ",transactional
expertease fitness mn,76,76,70,21,0.00,http://www.gravityaerialarts.com/workshopsandevents/2019/3/31/vertical-workshop-with-lisa-natoli,0,0,0.00,0,95,"[0,0,100,40,0,0,0,0,0,20,0,0]",2022-01-17,"Knowledge panel, Image pack, Reviews, FAQ",transactional
anna belle aerial,59,0,30,19,0.00,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0,7840000,"[33,33,33,33,33,33,33,100,33,33,67,67]",2022-01-29,"Knowledge panel, Image pack, Reviews, Video, Video Carousel, FAQ",informational
gravity dance ball,86,86,30,0,0.00,http://www.gravityaerialarts.com/,0,0,0.00,0,45200000,"[0,0,0,0,43,0,0,0,0,100,0,29]",2022-01-25,"Image pack, Reviews, Video, Video Carousel, People also ask, FAQ",informational
the gravity arts,2,2,30,34,0.00,http://www.gravityaerialarts.com/,0,0,0.00,0,393000000,"[0,0,0,100,0,0,100,100,0,0,0,0]",2022-01-27,"Knowledge panel, Site links, Reviews, Video, Video Carousel",navigational
contortion classes dallas,44,44,50,9,0.00,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0,3540000,"[20,100,20,40,20,40,0,0,40,20,20,0]",2022-01-19,"Local pack, Site links, Video",commercial
duo trapeze,60,60,50,22,0.00,http://www.gravityaerialarts.com/workshopsandevents/2019/3/16/duo-trapeze-with-jessie-miller,0,0,0.00,0.04,5110000,"[11,22,33,11,11,22,11,11,44,100,11,11]",2022-01-19,"Site links, Video, Featured snippet, People also ask",informational
dance studios in denver colorado,96,96,20,33,1.08,http://www.gravityaerialarts.com/,0,0,0.00,0.16,12900000,"[2,3,1,100,1,36,1,16,1,1,1,3]",2022-01-13,"Local pack, Site links, AdWords bottom, FAQ",commercial
denver circus 2020,91,91,40,41,0.00,http://www.gravityaerialarts.com/camps/2018/6/18/summer-aerial-circus-camp,0,0,0.00,0,7120000,"[0,0,0,14,0,14,0,100,0,0,0,14]",2022-01-26,"Site links, Reviews, People also ask",informational
aerial straps cirque,93,93,40,31,0.00,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0,409000,"[0,0,0,0,0,0,100,0,0,0,40,20]",2022-01-25,"Knowledge panel, Reviews, Video","informational, navigational"
aerial dance rigging,86,86,50,24,0.00,http://www.gravityaerialarts.com/workshopsandevents/2019/5/11/rigging-for-aerialists-with-mike-payne,0,0,0.00,1,7500000,"[22,11,11,100,11,11,33,33,11,11,22,33]",2022-01-18,"Site links, Video Carousel, People also ask",informational
art aerial,96,91,90,30,0.00,http://www.gravityaerialarts.com/,0,0,0.00,0.09,5210000000,"[33,100,0,33,100,0,33,33,67,33,33,33]",2022-01-29,"Image pack, Site links, Reviews, Video Carousel, People also ask",informational
aerial silks camp,8,8,30,15,0.00,http://www.gravityaerialarts.com/camps,0,0,0.00,0,5900000,"[100,0,33,33,33,33,33,33,33,33,100,33]",2022-01-29,"Local pack, Video Carousel, People also ask",commercial
aerial dance,85,0,6600,41,1.22,http://www.gravityaerialarts.com/,0,0,0.00,0.05,116000000,"[82,82,100,82,100,100,100,100,100,100,100,100]",2022-01-30,"Knowledge panel, Local pack, Site links, Reviews, Video, Video Carousel, People also ask","informational, transactional"
aerial rigging safety,95,0,30,9,0.00,http://www.gravityaerialarts.com/workshopsandevents/2019/5/11/rigging-for-aerialists-with-mike-payne,0,0,0.00,0.48,6330000,"[33,0,100,0,33,67,67,100,33,33,33,67]",2022-01-29,"Site links, Reviews, Video Carousel, People also ask",informational
gravity studio,64,64,320,40,3.27,http://www.gravityaerialarts.com/,0,0,0.00,0.03,68600000,"[54,54,54,67,81,81,81,81,81,100,67,67]",2022-01-19,"Knowledge panel, Site links, Video","informational, navigational"
silk dancing lessons,73,0,90,25,0.00,http://www.gravityaerialarts.com/,0,0,0.00,0,11200000,"[20,20,20,20,0,100,20,20,40,40,20,0]",2022-01-30,"Site links, Video Carousel, People also ask","informational, transactional"
gravity dance utah,71,71,30,21,0.00,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0,5810000,"[29,71,0,14,14,29,14,14,100,43,0,14]",2022-01-25,"Knowledge panel, Site links, Reviews, Video, Video Carousel",informational
circus rigging training,98,0,30,3,0.00,http://www.gravityaerialarts.com/workshopsandevents/2019/5/11/rigging-for-aerialists-with-mike-payne,0,0,0.00,0,6250000,"[100,0,0,0,0,0,0,0,0,0,0,0]",2022-01-29,"Reviews, Video",informational
aerialists for hire,26,26,20,8,3.05,http://www.gravityaerialarts.com/hire-an-aerialist,0,0,0.00,0.14,607000,"[29,14,14,14,29,14,14,14,100,29,29,14]",2022-01-27,"Reviews, Video, People also ask",informational
silk dancing classes,53,53,170,31,2.46,http://www.gravityaerialarts.com/,0,0,0.00,0.15,6230000,"[35,42,81,65,42,54,81,65,81,81,65,100]",2022-01-28,"Local pack, Video Carousel, People also ask",informational
presshandstands,54,54,30,39,0.00,http://www.gravityaerialarts.com/workshopsandevents/2017/5/7/quest-for-press-handstands,0,0,0.00,0,509000,"[100,100,50,100,50,100,50,50,50,100,50,100]",2022-01-26,"Reviews, Video, Featured snippet, People also ask",informational
gravity netflix,39,39,170,41,0.00,http://www.gravityaerialarts.com/workshopsandevents/2021/11/12/netflix-and-thrill-graivtys-9th-showcase,0,0,0.00,0,36200000,"[66,100,81,66,53,66,66,53,34,44,44,53]",2022-01-27,"Reviews, Featured snippet, Video Carousel, People also ask",informational
contortion teacher training,47,47,70,27,0.00,http://www.gravityaerialarts.com/workshopsandevents/2018/3/28/contortion-and-all-level-flexibility,0,0,0.00,0.25,6200000,"[50,0,50,0,50,0,100,50,50,50,100,50]",2022-01-16,"Site links, Reviews, People also ask, FAQ",informational
reed photo art denver,68,0,40,29,2.75,http://www.gravityaerialarts.com/,0,0,0.00,0.16,5650000,"[25,25,25,25,25,25,50,50,100,25,50,25]",2022-01-29,"Knowledge panel, Site links, Reviews",navigational
silk rope classes near me,77,77,20,22,1.13,http://www.gravityaerialarts.com/,0,0,0.00,0.06,11400000,"[50,50,50,50,50,100,50,50,50,50,50,100]",2022-01-27,"Local pack, Reviews, People also ask",transactional
aerial straps circus,83,72,90,11,0.00,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0.88,477000,"[67,100,33,100,33,33,0,33,33,33,33,33]",2022-01-29,"Image pack, Site links, Reviews, Video Carousel, People also ask","informational, transactional"
tanya evans personal trainer,62,0,40,11,0.00,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0,4840000,"[100,50,0,0,0,0,0,0,50,0,0,0]",2022-01-29,"Image pack, Reviews",informational
aerial arts america,49,51,90,7,0.00,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0,96,"[100,40,40,20,20,20,40,20,20,20,20,20]",2022-01-29,"Image pack, Site links, Video Carousel",navigational
aerial rope dancing,92,92,50,39,0.00,http://www.gravityaerialarts.com/,0,0,0.00,0.99,5370000,"[100,29,14,14,43,14,14,29,14,43,14,14]",2022-01-18,"Image pack, Site links, Video, Video Carousel, People also ask",informational
circus denver colorado 2015,34,34,50,18,0.00,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0,82,"[0,0,0,0,0,0,0,0,0,0,0,100]",2022-01-18,"Local pack, Image pack",commercial
tanya burka,36,36,30,20,0.00,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0,3910000,"[11,22,44,11,33,11,11,11,11,11,11,100]",2022-01-27,"Image pack, Site links, Reviews, Video Carousel",informational
aerial acrobatics near me,71,71,260,35,1.83,http://www.gravityaerialarts.com/,0,0,0.00,0.04,7970000,"[67,54,54,44,28,36,82,100,67,54,82,67]",2022-01-17,"Local pack, People also ask",transactional
expertease minneapolis,66,66,30,20,0.00,http://www.gravityaerialarts.com/workshopsandevents/2018/8/12/lyra-theory-with-lisa-natoli,0,0,0.00,0,16600,"[0,0,11,0,11,0,22,11,11,11,0,100]",2022-01-25,"Knowledge panel, Reviews",informational
netflix showcase,58,58,50,56,0.00,http://www.gravityaerialarts.com/workshopsandevents/2021/11/12/netflix-and-thrill-graivtys-9th-showcase,0,0,0.00,0,45300000,"[29,14,29,57,29,14,14,14,100,14,71,57]",2022-01-20,"Top stories, Video, Video Carousel, People also ask",informational
aerial hoop birds nest,30,30,50,13,0.00,http://www.gravityaerialarts.com/workshopsandevents/2020/8/3/aerial-hoop-intensive-with-daniel-sulivan,0,0,0.00,0,65,"[20,100,20,100,20,0,20,20,0,20,0,20]",2022-01-18,"Image pack, Video Carousel",informational
decadence denver 2013,72,72,50,7,0.00,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0,3110000,"[29,14,14,29,0,29,14,14,100,29,0,14]",2022-01-19,Video Carousel,informational
gravity code ticket price,76,80,90,3,0.00,http://www.gravityaerialarts.com/workshopsandevents,0,0,0.00,0,9730000,"[0,0,0,0,0,100,100,0,0,0,0,0]",2022-01-30,"Site links, Reviews, FAQ",transactional
aerial arts studio,14,9,90,24,0.00,http://www.gravityaerialarts.com/,0,0,0.00,0,45000000,"[14,14,14,14,29,14,14,71,100,14,29,100]",2022-01-29,"Local pack, Site links, Reviews, Video Carousel",commercial
zero gravity aerial,90,90,90,21,0.00,http://www.gravityaerialarts.com/,0,0,0.00,0.04,4970000,"[33,33,33,33,33,67,33,33,33,67,100,33]",2022-01-16,"Knowledge panel, Site links, Reviews, Video, Video Carousel",navigational
anti gravity yoga denver,18,18,40,19,0.00,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0,85,"[67,33,100,33,67,0,0,33,33,33,33,0]",2022-01-26,"Local pack, Image pack, Site links, Reviews, Video, People also ask",commercial
dance studios denver,93,93,390,41,1.14,http://www.gravityaerialarts.com/,0,0,0.00,0.13,11700000,"[81,54,81,100,81,81,67,100,100,100,100,100]",2022-01-18,"Local pack, Site links, FAQ",commercial
aerial silks studio,92,92,50,22,0.00,http://www.gravityaerialarts.com/,0,0,0.00,0.08,967000,"[8,4,4,8,12,4,4,100,19,35,27,4]",2022-01-18,"Site links, People also ask, FAQ",commercial
circus camp nyc,80,84,30,18,0.00,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0,12200000,"[0,11,22,0,44,11,78,100,22,11,11,11]",2022-01-29,"Site links, Reviews, Video",informational
aerial dance festival colorado,85,85,70,16,0.00,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0,22700000,"[20,40,20,0,20,0,40,100,40,20,40,0]",2022-01-16,"Reviews, Video",informational
aerial rigging rope,33,33,30,5,0.00,http://www.gravityaerialarts.com/workshopsandevents/2019/5/11/rigging-for-aerialists-with-mike-payne,0,0,0.00,1,7330000,"[20,20,20,20,100,60,40,20,40,60,40,60]",2022-01-29,"Image pack, Reviews, Video Carousel, People also ask",informational
aerial dance center,52,42,90,30,0.00,http://www.gravityaerialarts.com/,0,0,0.00,0,55300000,"[25,25,0,0,0,0,50,0,50,25,100,0]",2022-01-29,"Local pack, Image pack, Site links, Reviews, Video, People also ask, FAQ",transactional
aerial revolution summer camp,58,58,70,28,0.00,http://www.gravityaerialarts.com/camps,0,0,0.00,0.14,93,"[0,60,40,0,0,0,20,100,20,0,0,40]",2022-01-16,"Knowledge panel, Image pack, Site links, Reviews, AdWords bottom",navigational
jen wheeler,69,69,40,30,0.00,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0.02,15500000,"[1,3,1,1,3,1,6,1,3,1,100,1]",2022-01-27,"Image pack, Site links, Reviews, Video, Video Carousel",informational
santa cruz circus arts,33,0,110,15,0.00,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0,3440000,"[6,6,9,13,13,13,16,44,100,81,53,53]",2022-01-30,"Knowledge panel, Image pack, Reviews, Video Carousel, FAQ",transactional
aerial bondage,57,57,40,14,0.00,http://www.gravityaerialarts.com/workshopsandevents/2019/5/11/rigging-for-aerialists-with-mike-payne,0,0,0.00,0,6160000,"[100,75,25,50,25,100,100,25,25,100,50,25]",2022-01-26,"Site links, Reviews",informational
ashley fox pole dancer,87,87,30,34,0.00,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0,99,"[0,0,0,0,0,0,0,0,0,0,100,100]",2022-01-29,"Reviews, People also ask, FAQ",informational
moth circus denver,37,30,90,12,0.00,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0,532000,"[0,0,0,50,50,0,0,0,100,50,50,50]",2022-01-30,"Knowledge panel, Reviews, Video Carousel, FAQ",informational
francoise voranger,47,47,50,17,0.00,http://www.gravityaerialarts.com/workshopsandevents/2021/8/6/spins,0,0,0.00,0,25200,"[33,11,11,11,11,100,11,22,22,11,11,44]",2022-01-19,,informational
francoise voranger,48,48,50,17,0.00,http://www.gravityaerialarts.com/workshopsandevents/2021/3/6/ballet-technique-for-aerialists-workshop,0,0,0.00,0,25200,"[33,11,11,11,11,100,11,22,22,11,11,44]",2022-01-19,,informational
gravity gym price,62,62,50,10,0.00,http://www.gravityaerialarts.com/pricing,0,0,0.00,0,8840000,"[0,0,0,50,50,0,100,0,0,0,50,0]",2022-01-19,"Site links, Reviews, Video, People also ask, FAQ",transactional
aerial arts costumes,34,0,90,16,0.00,http://www.gravityaerialarts.com/camps/2018/12/26/winter-aerial-circus-camp,0,0,0.00,1,84,"[25,50,25,100,25,25,25,25,75,25,100,25]",2022-01-29,"Site links, Reviews",informational
aerial arts new orleans,50,50,40,23,0.00,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0.02,4590000,"[60,20,100,100,40,80,20,20,20,20,20,20]",2022-01-26,"Local pack, Site links, Reviews, Video",commercial
gravity prices,59,79,110,25,0.39,http://www.gravityaerialarts.com/pricing,0,0,0.00,0.04,99400000,"[53,65,65,65,100,100,65,82,65,53,100,53]",2022-01-29,"Site links, Reviews, Video, People also ask",navigational
circus aerial straps,91,91,50,7,0.00,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,1,511000,"[11,11,100,11,11,11,11,11,11,11,11,11]",2022-01-19,"Knowledge panel, Video Carousel, People also ask","informational, transactional"
voler thieves of flight,68,68,110,23,0.00,http://www.gravityaerialarts.com/workshopsandevents/2017/8/3/inversion-workshop-begint,0,0,0.00,0,79,"[29,29,41,53,82,53,65,100,100,65,53,41]",2022-01-16,"Knowledge panel, Image pack, Site links, Reviews, Video Carousel, FAQ","navigational, transactional"
aerial silk classes,92,92,2400,42,1.27,http://www.gravityaerialarts.com/,0,0,0.00,0.07,3180000,"[66,66,83,83,83,83,100,83,83,83,66,66]",2022-01-28,"Local pack, Video Carousel, People also ask, FAQ",commercial
aerials east colorado springs,64,64,30,14,0.00,http://www.gravityaerialarts.com/,0,0,0.00,0,30900000,"[0,0,0,0,0,0,0,0,0,100,0,0]",2022-01-29,"Local pack, Site links, Reviews, FAQ",commercial
what is an aerial in dance,99,99,50,34,0.00,http://www.gravityaerialarts.com/,0,0,0.00,0,140000000,"[60,20,20,20,40,20,100,40,80,20,20,40]",2022-01-21,"Knowledge panel, Reviews, Video, People also ask",informational
aerial hoop pike,63,0,30,19,0.00,http://www.gravityaerialarts.com/workshopsandevents/2017/5/7/lyra-rolls-and-dynamic-movement-workshop,0,0,0.00,0,79,"[14,0,14,0,14,14,0,57,100,100,0,0]",2022-01-29,"Reviews, People also ask",informational
circus school austin,63,78,30,21,0.00,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0.05,9340000,"[14,14,14,14,14,100,57,14,29,14,14,71]",2022-01-29,"Local pack, Site links, Reviews, Video",commercial
boulder aerial,71,71,40,26,0.00,http://www.gravityaerialarts.com/,0,0,0.00,0,26800000,"[11,22,11,11,11,11,22,56,56,100,11,11]",2022-01-26,"Local pack, Image pack, Site links, Reviews, Video, FAQ",navigational
contortion backbend,48,48,140,0,0.00,http://www.gravityaerialarts.com/workshopsandevents/2017/5/8/backbends-contortion-workshop,0,0,0.00,0,95,"[81,100,81,81,81,67,81,67,67,52,67,43]",2022-01-27,"Reviews, People also ask",informational
guerrilla gravity denver,90,90,70,34,0.00,http://www.gravityaerialarts.com/,0,0,0.00,0.14,98,"[11,11,56,11,11,11,100,100,11,11,11,11]",2022-01-17,"Knowledge panel, Site links, Video, AdWords top, Video Carousel, People also ask, FAQ",navigational
dancers doing aerials,82,68,90,29,0.00,http://www.gravityaerialarts.com/,0,0,0.00,0,15600000,"[14,14,14,14,14,0,100,0,29,0,0,0]",2022-01-29,"Image pack, Video, People also ask",informational
cat circus denver,17,17,50,11,0.00,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0,6400000,"[0,100,100,0,0,0,100,0,100,0,0,0]",2022-01-19,"Site links, Video, Video Carousel, FAQ",informational
aerial gym near me,77,77,320,35,2.26,http://www.gravityaerialarts.com/,0,0,0.00,0.12,22600000,"[82,67,100,82,82,82,100,82,100,82,54,67]",2022-01-19,"Local pack, Site links, People also ask",transactional
aerial arts world,69,0,30,9,0.00,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0,4700000000,"[0,0,0,0,0,0,0,0,0,0,100,0]",2022-01-29,"Image pack, Video Carousel",informational
trapeze class dallas,85,85,40,22,0.00,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0.04,592000,"[20,40,100,20,20,80,40,40,20,20,80,20]",2022-01-28,"Local pack, Site links, Reviews, Video",commercial
aerial over denver,14,14,40,29,0.00,http://www.gravityaerialarts.com/,0,0,0.00,0.1,13400000,"[14,71,14,29,14,29,14,14,14,57,29,100]",2022-01-26,"Knowledge panel, Site links, Reviews, Video, Video Carousel, FAQ",navigational
msa circus arts chicago,67,67,30,24,0.00,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0,574000,"[33,0,33,0,0,33,33,33,100,100,33,0]",2022-01-26,"Knowledge panel, Site links, Reviews, Video, FAQ",navigational
denver circus collective,38,38,140,35,1.46,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0.01,3120000,"[41,41,82,65,53,53,82,100,82,82,100,100]",2022-01-26,"Knowledge panel, Site links, Reviews, Video",navigational
air yoga denver,12,12,40,28,0.00,http://www.gravityaerialarts.com/,0,0,0.00,0.08,31800000,"[20,20,100,60,80,20,20,20,20,80,80,20]",2022-01-26,"Knowledge panel, Site links, Reviews, Video",informational
lyra classes melbourne,68,68,50,1,0.00,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0,2390000,"[0,0,0,33,0,100,0,0,0,0,0,0]",2022-01-20,"Site links, Video, People also ask",informational
dance classes arvada,61,61,20,25,0.92,http://www.gravityaerialarts.com/,0,0,0.00,0.15,98,"[11,100,56,11,11,11,11,11,11,11,11,11]",2022-01-11,"Local pack, Site links, Reviews, Video, FAQ",commercial
dance classes arvada co,67,60,30,26,0.00,http://www.gravityaerialarts.com/,0,0,0.00,0,768000,"[20,100,40,100,100,40,60,0,20,20,20,0]",2022-01-29,"Local pack, Site links, Reviews, FAQ",commercial
aerial dance boulder,29,29,70,26,0.00,http://www.gravityaerialarts.com/,0,0,0.00,0.02,7320000,"[100,11,11,11,22,33,11,11,11,11,11,44]",2022-01-16,"Local pack, Image pack, Site links, Reviews, Video Carousel",informational
aerial acrobatics dance,39,54,30,31,0.00,http://www.gravityaerialarts.com/,0,0,0.00,0,28900000,"[33,33,0,0,33,33,100,33,100,0,0,0]",2022-01-29,"Local pack, Video, People also ask","navigational, transactional"
spanish web circus,44,44,110,0,0.00,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0.02,8180000,"[29,41,53,29,53,65,65,65,100,100,65,65]",2022-01-16,"Knowledge panel, Site links, Reviews, Video, Video Carousel","informational, transactional"
mcmaster aerial photos,29,29,30,20,0.00,http://www.gravityaerialarts.com/,0,0,0.00,0,97,"[0,0,0,0,0,0,0,0,0,0,0,100]",2022-01-26,"Image pack, Reviews, FAQ",transactional
aerial aerobics near me,62,66,170,45,1.73,http://www.gravityaerialarts.com/,0,0,0.00,0.1,3050000,"[42,35,81,65,65,100,65,65,81,65,54,65]",2022-01-29,"Local pack, Site links, People also ask",transactional
costa allen ballet,56,39,30,6,0.00,http://www.gravityaerialarts.com/workshopsandevents/2021/3/6/ballet-technique-for-aerialists-workshop,0,0,0.00,0,98,"[22,11,100,33,11,33,22,11,11,22,0,22]",2022-01-29,"Image pack, Reviews, Video Carousel",informational
aerial silks gym near me,99,99,20,33,2.32,http://www.gravityaerialarts.com/,0,0,0.00,0.09,74800000,"[14,14,14,100,14,14,14,14,29,43,14,57]",2021-12-21,"Local pack, Site links, People also ask, FAQ",transactional
how to become an aerialist,66,66,40,15,0.00,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0.01,884000,"[14,100,14,14,14,29,43,14,14,14,14,29]",2022-01-27,"Video, Featured snippet, Video Carousel, People also ask",informational
colorado aerial yoga,41,28,30,26,0.00,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0.02,19900000,"[20,40,20,60,20,40,100,20,20,40,100,20]",2022-01-29,"Knowledge panel, Site links, Reviews, Video, FAQ",navigational
air fitness denver,27,27,30,34,0.00,http://www.gravityaerialarts.com/,0,0,0.00,0.04,19300000,"[25,25,75,75,25,50,25,25,100,25,75,25]",2022-01-29,"Knowledge panel, Site links, Reviews, Video, AdWords bottom, Video Carousel",navigational
circus denver 2016,67,67,40,22,0.00,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0,8800000,"[0,100,0,0,0,0,0,0,0,0,100,0]",2022-01-26,"Local pack, Image pack, Reviews, Video, FAQ",commercial
art gym denver,71,71,140,30,3.37,http://www.gravityaerialarts.com/,0,0,0.00,0.02,30100000,"[81,67,67,67,52,52,67,52,100,81,52,67]",2022-01-27,"Knowledge panel, Site links, Reviews, Video, FAQ",navigational
born to fly aerial teacher training,60,60,40,8,0.00,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0,5860000,"[33,33,33,33,100,0,33,0,33,0,0,0]",2022-01-26,"Site links, Reviews, Video, People also ask",navigational
aerial ballet nyc,93,93,40,13,0.00,http://www.gravityaerialarts.com/workshopsandevents/2021/3/6/ballet-technique-for-aerialists-workshop,0,0,0.00,0,1480000,"[0,25,25,0,100,75,25,25,25,25,25,25]",2022-01-26,"Site links, Reviews, Video, People also ask",commercial
aerial arts near me,90,90,720,39,2.57,http://www.gravityaerialarts.com/,0,0,0.00,0.05,127000000,"[48,48,59,48,72,72,88,100,72,88,72,72]",2022-01-26,"Local pack, Reviews",transactional
aerial silk dancing classes,42,42,110,35,0.00,http://www.gravityaerialarts.com/,0,0,0.00,0.06,4540000,"[53,82,82,65,53,53,82,100,82,53,41,53]",2022-01-28,"Local pack, Video Carousel, People also ask",commercial
aerial arts santa cruz schedule,28,28,40,0,0.00,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0,7930000,"[0,0,0,0,0,0,0,100,0,0,0,0]",2022-01-26,"Site links, Reviews, Video",commercial
aerial silks santa cruz,55,34,90,11,0.00,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0,1120000,"[20,20,100,40,20,20,20,40,20,20,20,20]",2022-01-29,"Local pack, Site links, Reviews, Video Carousel",commercial
lisa natoli,54,54,110,36,0.00,http://www.gravityaerialarts.com/workshopsandevents/2019/3/31/vertical-workshop-with-lisa-natoli,0,0,0.00,0.04,341000,"[67,67,100,81,52,52,33,52,67,52,43,43]",2022-01-28,"Knowledge panel, Site links, Video, Video Carousel","informational, navigational"
pole dancing classes in aurora co,39,39,30,21,0.00,http://www.gravityaerialarts.com/,0,0,0.00,0,6290000,"[0,0,0,11,100,0,0,0,0,0,11,0]",2022-01-26,"Local pack, Site links, Reviews, FAQ",commercial
aerials gymnastics colorado springs co,72,72,30,35,0.00,http://www.gravityaerialarts.com/,0,0,0.00,0,99,"[33,22,56,11,11,11,100,11,11,11,11,11]",2022-01-29,"Knowledge panel, Site links, Reviews, Video, FAQ",navigational
aerial art studio,10,12,30,30,0.00,http://www.gravityaerialarts.com/,0,0,0.00,0.02,107000000,"[33,33,33,33,33,67,33,33,100,100,33,33]",2022-01-29,"Local pack, Site links, Reviews, Video Carousel, People also ask",transactional
aerial dance studio,17,17,20,21,0.96,http://www.gravityaerialarts.com/,0,0,0.00,0.04,13900000,"[1,10,1,2,1,2,8,10,24,6,100,44]",2022-01-09,"Image pack, Site links, Reviews",transactional
nina reed photography,77,72,90,17,0.00,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0,8740000,"[20,40,40,20,20,100,20,60,20,20,100,20]",2022-01-29,"Image pack, Site links",informational
denver aerial park,50,50,30,39,0.00,http://www.gravityaerialarts.com/,0,0,0.00,0,15600000,"[0,0,0,0,0,0,0,0,14,100,100,0]",2022-01-21,"Local pack, Site links, Reviews, Video, Video Carousel",commercial
gravity serie netflix,42,42,30,50,0.00,http://www.gravityaerialarts.com/workshopsandevents/2021/11/12/netflix-and-thrill-graivtys-9th-showcase,0,0,0.00,0,11300000,"[100,14,14,0,29,100,0,14,0,0,0,0]",2022-01-25,"Image pack, Site links, Reviews, Video Carousel, People also ask","informational, transactional"
aerialist auditions,94,94,30,15,0.00,http://www.gravityaerialarts.com/workshopsandevents/2019/12/14/auditon-for-an-aeiral-superhero-production,0,0,0.00,0.06,7510000,"[20,100,20,40,20,20,20,20,20,40,20,20]",2022-01-29,"Reviews, Video, Video Carousel, People also ask",informational
aerial silks photography,45,45,90,15,0.00,http://www.gravityaerialarts.com/,0,0,0.00,0.87,12300000,"[79,100,79,64,64,64,79,64,79,50,50,50]",2022-01-14,"Image pack, Reviews, Video Carousel",informational
texas circus and aerial,71,71,140,38,2.25,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0.14,3640000,"[33,33,52,24,43,43,67,67,100,100,100,67]",2022-01-26,"Knowledge panel, Site links, Reviews, Video","navigational, transactional"
contortion classes melbourne,57,57,70,5,0.00,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0,2010000,"[0,0,50,0,0,0,0,0,0,100,0,0]",2022-01-17,"Site links, People also ask",informational
gravity dance studio,48,48,20,10,2.76,http://www.gravityaerialarts.com/,0,0,0.00,0.05,15800000,"[2,15,2,2,2,4,2,2,29,100,35,2]",2022-01-03,"Local pack, Site links, Reviews, FAQ",transactional
aerial silks new orleans,29,0,30,20,0.00,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0.01,5370000,"[14,14,14,14,100,14,57,29,14,14,14,14]",2022-01-29,"Local pack, Site links, Reviews, Video, People also ask",commercial
gravady waiver,91,91,70,30,1.44,http://www.gravityaerialarts.com/,0,0,0.00,0.13,2550,"[14,29,43,14,29,100,14,14,14,29,43,14]",2022-01-16,People also ask,informational
stilting,79,79,170,31,0.00,http://www.gravityaerialarts.com/workshopsandevents/stiltingforshorties,0,0,0.00,0,327000,"[81,81,67,100,100,67,81,52,67,67,67,81]",2022-01-28,"Reviews, Featured snippet, Video Carousel, People also ask",informational
aerial yoga new orleans,47,47,70,21,0.00,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0.03,4520000,"[11,11,11,11,100,11,11,33,11,11,11,11]",2022-01-16,"Local pack, Site links, Reviews, Video, FAQ",commercial
adagio circus,65,65,30,18,0.00,http://www.gravityaerialarts.com/workshopsandevents/2019/6/23/adagio-workshop,0,0,0.00,0,3110000,"[14,57,57,57,14,71,100,14,14,14,29,43]",2022-01-29,"Image pack, Site links, Reviews, Video","informational, transactional"
lyra workshop,50,50,70,0,0.00,http://www.gravityaerialarts.com/workshopsandevents/2020/9/6/lyra-workshop-with-artoor-voskanian,0,0,0.00,0.03,11800000,"[0,33,100,33,0,33,33,33,33,33,33,33]",2022-01-17,"Site links, Video Carousel, People also ask",informational
what is an aerial dancer,85,85,210,13,0.00,http://www.gravityaerialarts.com/,0,0,0.00,0,21700000,"[44,66,66,81,81,66,81,81,100,81,81,53]",2022-01-28,"Knowledge panel, Site links, Reviews, Video, Video Carousel, People also ask",informational
vertical workshop,67,67,30,26,0.00,http://www.gravityaerialarts.com/workshopsandevents/2019/3/31/vertical-workshop-with-lisa-natoli,0,0,0.00,0.12,4800000000,"[33,33,33,67,33,33,33,100,67,33,33,33]",2022-01-27,"Site links, Reviews, Video Carousel","informational, navigational"
aerial entertainment studios,91,91,40,12,0.00,http://www.gravityaerialarts.com/hire-an-aerialist,0,0,0.00,0,16100000,"[14,71,14,14,14,43,100,14,29,14,14,0]",2022-01-26,"Site links, Reviews, Video, Video Carousel",informational
gravity falls summer camp,34,34,40,13,0.00,http://www.gravityaerialarts.com/camps,0,0,0.00,0,10500000,"[0,11,11,11,44,11,100,11,56,11,33,56]",2022-01-27,Reviews,"informational, transactional"
intermediate contortion poses,24,24,30,14,0.00,http://www.gravityaerialarts.com/classes-and-open-gyms,0,0,0.00,0,75,"[0,0,0,0,0,0,0,0,0,0,100,33]",2022-01-29,"Reviews, Featured snippet, People also ask",informational
circus denver 2018,55,55,50,7,0.00,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0,5650000,"[0,33,100,33,0,33,0,0,33,0,0,0]",2022-01-19,"Image pack, Site links, Video, Video Carousel, FAQ",informational
aerial cirque over denver,24,27,140,20,0.75,http://www.gravityaerialarts.com/,0,0,0.00,0.02,89,"[43,43,67,52,81,67,81,100,100,100,67,81]",2022-01-30,"Knowledge panel, Image pack, Site links, Reviews, Video Carousel, FAQ",navigational
aerial arts classes,78,73,90,42,0.00,http://www.gravityaerialarts.com/,0,0,0.00,0.04,18900000,"[14,29,100,14,14,43,14,14,14,14,43,14]",2022-01-30,"Local pack, Site links, Video Carousel, People also ask",commercial
gravity dance,45,45,170,8,1.96,http://www.gravityaerialarts.com/,0,0,0.00,0.04,44500000,"[34,28,34,34,44,44,53,66,81,100,53,53]",2022-01-28,"Local pack, Site links, Reviews, Video, Video Carousel","informational, transactional"
gravity training prices 2019,40,40,30,1,0.00,http://www.gravityaerialarts.com/camps,0,0,0.00,0,41100000,"[0,0,0,0,0,0,0,0,100,0,0,0]",2022-01-25,Reviews,transactional
daniel catanach,57,0,30,19,0.00,http://www.gravityaerialarts.com/workshopsandevents/2021/8/6/spins,0,0,0.00,0.04,71000,"[14,14,57,71,100,57,14,43,14,14,14,14]",2022-01-29,"Image pack, Site links, Reviews, Video, Video Carousel",informational
dance camp denver,90,0,30,22,0.00,http://www.gravityaerialarts.com/,0,0,0.00,0.43,15900000,"[0,0,33,33,67,100,33,33,33,33,33,33]",2022-01-29,"Local pack, Site links, Reviews",commercial
how to become a contortionist at home,68,67,110,25,0.00,http://www.gravityaerialarts.com/workshopsandevents/2018/3/28/contortion-and-all-level-flexibility,0,0,0.00,0.01,4110000,"[41,65,65,100,82,65,82,65,82,53,53,100]",2022-01-30,"Image pack, Site links, Reviews, Video, Featured snippet, Video Carousel, People also ask, FAQ",informational
gravity art,59,59,170,18,0.00,http://www.gravityaerialarts.com/,0,0,0.00,0.72,290000000,"[81,67,81,100,81,81,67,52,81,67,81,67]",2022-01-28,"Image pack, Reviews, Featured snippet, Video Carousel, People also ask",informational
ribbon acrobatics,94,94,320,38,0.00,http://www.gravityaerialarts.com/,0,0,0.00,0.85,4510000,"[67,67,67,82,82,82,82,82,82,100,82,100]",2022-01-25,"Image pack, Site links, Reviews, Video Carousel, People also ask",informational
boulder circus school,41,29,90,12,0.00,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0,6840000,"[20,20,20,40,100,20,20,20,20,20,20,20]",2022-01-29,"Knowledge panel, Site links, Reviews, Video","navigational, transactional"
ron jordan natoli photography studio,88,88,30,24,0.00,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0.03,432000,"[20,20,20,20,20,100,40,20,20,20,20,20]",2022-01-26,"Knowledge panel, Image pack, Reviews, Video","informational, navigational"
circus camp 2018,65,65,30,2,0.00,http://www.gravityaerialarts.com/camps/2018/12/26/winter-aerial-circus-camp,0,0,0.00,0,9830000,"[0,0,0,0,0,100,0,0,0,0,0,0]",2022-01-28,"Image pack, Reviews, Video, Video Carousel",informational
aerial arts classes near me,73,73,170,38,2.47,http://www.gravityaerialarts.com/,0,0,0.00,0.09,38000000,"[52,43,81,81,81,67,100,100,100,81,81,81]",2022-01-29,Local pack,transactional
nina wheeler dance,94,94,30,17,0.00,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0,10300000,"[20,80,20,40,20,80,100,20,20,20,20,20]",2022-01-26,"Reviews, Video",transactional
circo en denver,46,46,20,14,1.06,http://www.gravityaerialarts.com/gravity-staff,0,0,0.00,0.07,891000,"[22,33,100,0,0,0,0,22,0,11,11,100]",2022-01-09,"Local pack, Site links, Reviews, Video",commercial
aerial silk dancing lessons,92,92,40,44,0.00,http://www.gravityaerialarts.com/,0,0,0.00,0,5610000,"[0,25,0,25,0,0,0,25,0,75,25,100]",2022-01-26,"Local pack, Video Carousel, People also ask","informational, transactional"`;
})(typeof exports === "undefined" ? this["CSVChart"] = {} : exports);
