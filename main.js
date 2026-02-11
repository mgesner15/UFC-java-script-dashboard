//Fetching data from the JSON file and initialize charts
fetch('mmaData.json')
  .then(response => response.json())
  .then(data => {
    const classData = data.classData;

//Creating chart 1: Bar Chart for Attendance
    const attendanceLabels = classData.map(entry => entry.date);
    const attendanceData = classData.map(entry => entry.attendance);
    
    const attendanceChart = new Chart(document.getElementById('attendanceChart'), {
      type: 'bar',
      data: {
        labels: attendanceLabels,
        datasets: [{
          label: 'Daily Attendance',
          data: attendanceData,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

//Creating chart 2: Line Chart for Calories Burned
    const caloriesData = classData.map(entry => entry.calories);

    const caloriesChart = new Chart(document.getElementById('caloriesChart'), {
      type: 'line',
      data: {
        labels: attendanceLabels,
        datasets: [{
          label: 'Calories Burned',
          data: caloriesData,
          fill: false,
          borderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

//Creating chart 3: Pie Chart for Training Focus (Striking, Grappling, Conditioning)
    const trainingData = classData.map(entry => entry.training);
    const trainingLabels = ['Striking', 'Grappling', 'Conditioning'];
    const trainingTotals = trainingData.map(training => (
      [
        training.striking,
        training.grappling,
        training.conditioning
      ]
    ));

    const trainingPieChart = new Chart(document.getElementById('trainingPieChart'), {
      type: 'pie',
      data: {
        labels: trainingLabels,
        datasets: [{
          label: 'Training Focus (Minutes)',
          data: trainingTotals.flat(),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true
      }
    });

//Creating chart 4: Radar Chart for Average Training Minutes (Striking, Grappling, Conditioning)
    const averageTrainingData = classData.map(entry => (
      [
        entry.training.striking,
        entry.training.grappling,
        entry.training.conditioning
      ]
    ));

    const averageRadarData = averageTrainingData.reduce((acc, cur) => {
      cur.forEach((time, i) => acc[i] += time);
      return acc;
    }, [0, 0, 0]).map(sum => sum / classData.length); // Average

    const trainingRadarChart = new Chart(document.getElementById('trainingRadarChart'), {
      type: 'radar',
      data: {
        labels: trainingLabels,
        datasets: [{
          label: 'Average Training Minutes',
          data: averageRadarData,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true
      }
    });

//Adding a date picker
    document.getElementById('startDate').addEventListener('input', updateCaloriesChart);
    document.getElementById('endDate').addEventListener('input', updateCaloriesChart);

    function updateCaloriesChart() {
      const startDate = new Date(document.getElementById('startDate').value);
      const endDate = new Date(document.getElementById('endDate').value);
      const filteredData = classData.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= startDate && entryDate <= endDate;
      });

      const filteredLabels = filteredData.map(entry => entry.date);
      const filteredCalories = filteredData.map(entry => entry.calories);

      caloriesChart.data.labels = filteredLabels;
      caloriesChart.data.datasets[0].data = filteredCalories;
      caloriesChart.update();
    }

//Adding a refresh button for Radar Chart
    document.getElementById('refreshRadar').addEventListener('click', () => {
      trainingRadarChart.data.datasets[0].data = averageRadarData.map(() => Math.floor(Math.random() * 40));
      trainingRadarChart.update();
    });
  })

  //Error handling
  .catch(error => console.error('Error loading data:', error));
