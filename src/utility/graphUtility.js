/**
 * Function to round off the data to 2 decimal places 
 * @param {Number} value - The value of the data
 * @returns {Number} - The value of the data rounded off to 2 decimal places
 */
function round(value) {
  return Math.round(value * 100) / 100;
}


/**
 * Function to generate random background colors
 * @returns {String} - A random background color in the form of (r,g,b,a)
 */
function generateRandomBackgroundColors() {
  var x = Math.floor(Math.random() * 256);
  var y = Math.floor(Math.random() * 256);
  var z = Math.floor(Math.random() * 256);
  var bgColor = "rgb(" + x + "," + y + "," + z + ",0.75)";
  return bgColor;
}


/**
 * Function to generate the configuration for the chart
 * @param {object} data - The data to be used for the chart
 * @param {string} title - The title of the chart
 * @param {string} type - The type of chart to be generated
 * @returns {object} - The configuration for the chart
 */
function processChart(data, title, type) {
  const length = data.length;

  // Initialising the background color array
  const bgColor = []

  // Generating the background colors and storing the backgrond colors in the bgColor array
  for (var i = 0; i < length; i++) {
    bgColor.push(generateRandomBackgroundColors());
  }

  // Generating the labels for the graph
  const labels = data.map(item => item.url);

  // Generating the data for the graph rounded off to 2 decimal places
  const values = data.map(item => round(item.data));


  // Generating the dataset for the graph
  const datasets = [
    {
      label: title,
      backgroundColor: bgColor,
      data: values,
      hoverOffset: 4 // This is the offset of the hover box
    }
  ]

  data = {
    type: type,
    data: {
      labels,
      datasets,
      hoverOffset: 4,
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: title,
          position: "top",
        },
        legend: {
          display: false,
        },
      },
    },
  };
  return data;
}



/**
 * Function to generate the configuration for the bar chart
 * @param {object} data - The data to be used for the chart
 * @param {string} title - The title of the chart
 * @param {string} type - The type of chart to be generated
 * @returns {object} - The configuration for the chart
 */
function renderBar(data, title, type) {
  const length = data.length;
  data=data.sort((a, b) =>
    b.data -
    a.data
  )
  // Initialising the background color array
  const bgColor = []

  // Generating the background colors and storing the backgrond colors in the bgColor array
  for (var i = 0; i < length; i++) {
    bgColor.push(generateRandomBackgroundColors());
  }

  // Generating the labels for the graph
  const labels = data.map(item => item.url);

  // Generating the data for the graph rounded off to 2 decimal places
  const values = data.map(item => round(item.data));


  // Generating the dataset for the graph
  const datasets = [
    {
      label: title,
      backgroundColor: bgColor,
      data: values,
      hoverOffset: 4 // This is the offset of the hover box
    }
  ]

  data = {
    labels,
    datasets
  }


  let config = {
    type: 'bar',
    data,
    options: {
      indexAxis: 'y',
      scales: {
        y: {
          beginAtZero: true,
          ticks:{
            display:false
          },
          title: {
            display: true,
            text: 'Labels'
          }
        },
        x:{
          title: {
            display: true,
            text: title+' in '+type
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: title,
          position: "top",
        },
        legend: {
          display: false,
        }
      },
    },
  };
  return config;
}




export { processChart, renderBar, round };
