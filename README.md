# CSVChart

Feed CSV files into various chart/plot displays.

# Libraries

- **CSVChart**: [CSVChart](lib/csvchart.js)

- **CSV**: [PapaParse](https://papaparse.com)

- **Plots**: [Awesome List](https://github.com/zingchart/awesome-charting)

  - [Google Charts](https://developers.google.com/chart)

  - [Chart.js](https://www.chartjs.org)
  - [Chart.js/datalabels](https://github.com/chartjs/chartjs-plugin-datalabels)

- **PDF**: [jsPDF](https://github.com/parallax/jsPDF)

- **UI**: [MaterializeCSS](https://materializecss.com)

# TODO

## High Priority

- [ ] CSV Data/Point Merging (Partial support, with caveats.)

- [ ] Excel-style Data Filtering (ChartJS supports this from the ground up, so
  it shouldn't be hard; not sure about Google Charts.)

## Low Priority

- [x] Mouse Drag Scrolling (**DONE**)

- [ ] Download PDF/SVG (jsPDF currently just "rasters" the Canvas as a static
  PNG embedded inside the file; this is **NOT** what we want.)

- [ ] Interactive Static Sizing (ChartJS relies on the **PARENT DIV SIZE** to
  implicitly determine its own size; Google Charts accepts width/height
  arguments during the *draw* API call.)

- [ ] Migrate To MaterializeCSS (This just trounces Bootstrap.)

- [ ] Header/Footer Element Minimization (The top/bottom elements should be able
  hide themselves after being used--and subsequently show themselves on
  mouseover--freeing up visualization space for the chart itself.)

- [ ] Visually Select Region To Re-draw (Using the mouse, the user should be
  able to drag-select a rectangular region of the current chart and re-draw it
  using only the selected data points.)
