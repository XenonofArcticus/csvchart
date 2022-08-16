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

- **Spreadsheet**: [JSpreadsheets](https://jspreadsheets.com)

  - [Tabulator](http://tabulator.info)
  - [Tabulator/MaterializeCSS](http://tabulator.info/docs/5.3/theme#framework-materialize)

# TODO

## High Priority

- [x] CSV Data/Point Merging (This only currently works for EXACT matches).

- [ ] Excel-style Data Filtering (ChartJS supports this from the ground up, so
  it shouldn't be hard; not sure about Google Charts).

- [ ] Convert all `<script>` sources to local copies.

- [ ] Add "Total Rows" display for Tabulator.

- [ ] Support loading multiple CSV files.

- [ ] Constrain ZOOM and PAN options to something sensible.

## Low Priority

- [ ] Color and/or scale data points based on some constraints (such as green
  for the "ideal" locations, etc).

- [ ] Replace or fix Tabulators AWFUL "editor" features, particularly the black
  borders and poor checkbox visualization. This may require creating a 100%
  custom formatter/editor combo.

- [x] Mouse Drag Scrolling.

- [ ] Download PDF/SVG (jsPDF currently just "rasters" the Canvas as a static
  PNG embedded inside the file; this is **NOT** what we want).

- [ ] Interactive Static Sizing (ChartJS relies on the **PARENT DIV SIZE** to
  implicitly determine its own size; Google Charts accepts width/height
  arguments during the *draw* API call).

- [x] Migrate To MaterializeCSS (This just trounces Bootstrap).

- [ ] Header/Footer Element Minimization (The top/bottom elements should be able
  hide themselves after being used--and subsequently show themselves on
  mouseover--freeing up visualization space for the chart itself).

- [ ] Investigate embedding small Tabulator instances inside ChartJS tooltips.

- [ ] Visually Select Region To Re-draw (Using the mouse, the user should be
  able to drag-select a rectangular region of the current chart and re-draw it
  using only the selected data points).

- [ ] Detect "fullscreen" request (F11, usually) and hide header/footer.

- [ ] Understand [this](https://towardsdev.com/logarithmic-scale-how-to-plot-and-actually-understand-it-c38f00212206),
  and determine how ChartJS chooses axis "ticks".
