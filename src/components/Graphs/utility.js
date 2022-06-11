function round(value) {
  return Math.round(value * 100) / 100;
}

function generateRandomBackgroundColors() {
  var x = Math.floor(Math.random() * 256);
  var y = Math.floor(Math.random() * 256);
  var z = Math.floor(Math.random() * 256);
  var bgColor = "rgb(" + x + "," + y + "," + z + ",0.75)";
  return bgColor;
}

function processChart(data, title, type) {
  const length = data.length;
  const bgColor = [];
  for (var i = 0; i < length; i++) {
    bgColor.push(generateRandomBackgroundColors());
  }
  const labels = data.map((item) => item.url);
  const values = data.map((item) => round(item.data));
  const datasets = [
    {
      label: title,
      backgroundColor: bgColor,
      data: values,
      hoverOffset: 4,
    },
  ];

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

export { processChart };
