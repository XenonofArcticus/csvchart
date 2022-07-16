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

- [x] Mouse Drag Scrolling (**DONE**)

- [ ] Download PDF/SVG (jsPDF currently just "rasters" the Canvas as a static
  PNG embedded inside the file; this is **NOT** what we want.)

- [ ] CSV Data/Point Merging (Partial support, with caveats.)

- [ ] Interactive Static Sizing (ChartJS relies on the **PARENT DIV SIZE** to
  implicitly determine its own size; Google Charts accepts width/height
  arguments during the *draw* API call.)

- [ ] Excel-style Data Filtering (ChartJS supports this from the ground up, so
  it shouldn't be hard. Not sure about Google Charts yet.)

- [ ] Migrate To MaterializeCSS
