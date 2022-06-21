# CSVChart

Feed CSV files into various chart/plot displays.

# Description

- It needs to be a plain HTML/js document. No server side PHP or NodeJS unless
  absolutely necessary.

- The user will select a CSV file from their local drive and "upload" it.
  Javascript now has local file access capabilities.

- JS will parse it into a 2d array. There will be about 3 main columns of
  interest in each row: Difficulty (percent), search volume (int), and
  keyword (string).

- The numeric columns we care about are always "Search Volume" (X axis) and
  "Keyword Difficulty" (Y axis). The labels for each point are "Keyword"

- We make a carrier 2d dot plot similar to [this](https://images.app.goo.gl/bVYjQdWPGGGPPwZi8)

- X axis is the search volume, with logarithmic scaling, ranged between the min
  and max values found in the dataset.

- Y is the difficulty, linear, also auto ranged. Difficulty is usually from 30
  to about 90.

- The trick is we need data labels.

- Each dot needs to be labeled with the string keyword(s).

- And if two dots have exactly the same x and Y, the dot can be in the same
  place, but we need to declutter the text labels so we can see both strings
  somehow.

- Most chart toolkits can auto declutter labels so we need to select a JS
  chart/graph library that can do this.

- Bonus points if the dot can show extra columns of data on hover.

- I can send example CSVs and examples of the chart we currently make in Excel

- Stretch goal 1 is to have a tab where we can see the table of the uploaded CSV
  and hide or delete unwanted records

- Stretch goal 2 would be to be able to download a SVG and or PDF of the chart

# Libraries

- **CSV**: [PapaParse](https://papaparse.com)

- **Plots**: [Awesome List](https://github.com/zingchart/awesome-charting)

  - [Google Charts](https://developers.google.com/chart)

  - [...](#)

