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

We want to find all of the things customers might search for if they HAVEN'T
decided who/what to buy.

So, we want to throw out any terms like "creality blah blah" or "prusa blah
blah" and focus just on searches like "best 3d printer for making warhammer 40k
figures" or "how do I 3d print dungeon tiles" or "3d printing model rocket
parts" and then write web pages for OUR customer that feature THAT content to
get undecided people on their site and convince them to buy from them

We usually go through each CSV in Excel and manually examine and delete at
least half of the records as not being generic or useful, and then plot the
rest this way to judge which ones are the best opportunity.

So if you feel like the chart is adequately done (where does PDF export stand?)
then we could move on to the spreadsheet view where we want to be able to query
records to identify things like company or product names and hide those junk
records from the chart. So, I'd like to have a UI where I can list unwanted
words like "prusa", "prusa3d", "creality", "ender" "halot", and have it disable
any records with any of those strings. And then also have a way to individually
manually disable records (checkbox at the start of the record's row?) that the
human decides are not wanted, like "circus denver 2016". That's not a useful
query, but we don't want to exclude it by globally excluding "circus", "denver"
or "2016"

## High Priority

- [x] CSV Data/Point Merging

- [ ] Excel-style Data Filtering (ChartJS supports this from the ground up, so
  it shouldn't be hard; not sure about Google Charts.)

- [ ] Convert all `<script>` sources to local copies.

## Low Priority

- [x] Mouse Drag Scrolling (**DONE**)

- [ ] Download PDF/SVG (jsPDF currently just "rasters" the Canvas as a static
  PNG embedded inside the file; this is **NOT** what we want.)

- [ ] Interactive Static Sizing (ChartJS relies on the **PARENT DIV SIZE** to
  implicitly determine its own size; Google Charts accepts width/height
  arguments during the *draw* API call.)

- [x] Migrate To MaterializeCSS (This just trounces Bootstrap.)

- [ ] Header/Footer Element Minimization (The top/bottom elements should be able
  hide themselves after being used--and subsequently show themselves on
  mouseover--freeing up visualization space for the chart itself.)

- [ ] Visually Select Region To Re-draw (Using the mouse, the user should be
  able to drag-select a rectangular region of the current chart and re-draw it
  using only the selected data points.)

- [ ] Detect "fullscreen" request (F11, usually) and hide header/footer.

- [ ] Understand [this](https://towardsdev.com/logarithmic-scale-how-to-plot-and-actually-understand-it-c38f00212206),
  and determine how ChartJS chooses axis "ticks".
