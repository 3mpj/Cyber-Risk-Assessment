document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('risk-assessment-form');
    const resultsSection = document.getElementById('results-section');
    const riskScores = document.getElementById('risk-scores');
    const riskInputs = document.querySelectorAll('select');
    let chart;
    let barChart;
    let pieChart;
    let stackedBarChart;
    let lineChart;
    let timeLabels = []; // Stores the time points (e.g., dates or assessment numbers)
    let riskOverTimeData = []; // Stores the average risk score over time


    // Risk level mapping
    const riskMapping = {
        'high': 3,
        'medium': 2,
        'low': 1
    };

    // Risk categories
    const categories = ['Identify', 'Protect', 'Detect', 'Respond', 'Recover'];
    let riskData = {
        'Identify': [],
        'Protect': [],
        'Detect': [],
        'Respond': [],
        'Recover': []
    };

    function initializePieChart() {
        const ctx = document.getElementById('pieChart').getContext('2d');
        pieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['High Risk', 'Medium Risk', 'Low Risk'], // Risk levels
                datasets: [{
                    label: 'Risk Distribution',
                    data: [], // updated dynamically based on the risk levels
                    backgroundColor: [
                        'rgba(255, 69, 0, 0.2)', // High Risk
                        'rgba(255, 165, 0, 0.2)', // Medium Risk
                        'rgba(50, 205, 50, 0.2)'  // Low Risk
                    ],
                    borderColor: [
                        'rgba(255, 69, 0, 1)',
                        'rgba(255, 165, 0, 1)',
                        'rgba(50, 205, 50, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: top,
                    },
                    title: {
                        display: true,
                        text: 'Risk Distribution'
                    }
                }
            }
        });
    }

    function updatePieChart() {
        let highRiskCount = 0;
        let mediumRiskCount = 0;
        let lowRiskCount = 0;
    
        // risk levels count from the riskData
        for (let category in riskData) {
            riskData[category].forEach(score => {
                if (score >= 2.5) {
                    highRiskCount++;
                } else if (score >= 1.5) {
                    mediumRiskCount++;
                } else {
                    lowRiskCount++;
                }
            });
        }
    
        // Update pie chart's data
        pieChart.data.datasets[0].data = [highRiskCount, mediumRiskCount, lowRiskCount];
    
        pieChart.update();
    }


    function updateFindingsTable() {
        const tableBody = document.querySelector('#findingsTable tbody');
        tableBody.innerHTML = ''; // Clear existing table rows
    
        // Iterate through each category and add the corresponding risk level, score, and recommendations
        categories.forEach(category => {
            let riskLevel = 'Low';
            let recommendation = '';
    
            // Calculate the average risk score for the category
            const averageScore = (riskData[category].reduce((a, b) => a + b, 0) / riskData[category].length || 0).toFixed(2);
    
            // Determine risk level based on the score
            if (averageScore >= 2.5) {
                riskLevel = 'High';
            } else if (averageScore >= 1.5) {
                riskLevel = 'Medium';
            }
    
            // Assign recommendations based on the category and risk level
            if (category === 'Identify') {
                if (riskLevel === 'High') {
                    recommendation = 'Immediate review and upgrade of asset management and governance policies is required.';
                } else if (riskLevel === 'Medium') {
                    recommendation = 'Regularly review asset inventories and consider enhancements to current policies.';
                } else {
                    recommendation = 'Maintain current asset management and governance practices.';
                }
            } else if (category === 'Protect') {
                if (riskLevel === 'High') {
                    recommendation = 'Strengthen access controls and ensure all security protocols are enforced immediately.';
                } else if (riskLevel === 'Medium') {
                    recommendation = 'Improve security awareness training and reinforce existing protection mechanisms.';
                } else {
                    recommendation = 'Continue with regular security training and protection strategies.';
                }
            } else if (category === 'Detect') {
                if (riskLevel === 'High') {
                    recommendation = 'Deploy advanced threat detection tools and review monitoring systems urgently.';
                } else if (riskLevel === 'Medium') {
                    recommendation = 'Enhance current detection capabilities and consider increasing monitoring coverage.';
                } else {
                    recommendation = 'Maintain detection systems with periodic reviews for effectiveness.';
                }
            } else if (category === 'Respond') {
                if (riskLevel === 'High') {
                    recommendation = 'Improve incident response plans and ensure all teams are trained for emergency situations.';
                } else if (riskLevel === 'Medium') {
                    recommendation = 'Review incident response strategies and test response times with simulated incidents.';
                } else {
                    recommendation = 'Continue regular incident response drills and plan updates.';
                }
            } else if (category === 'Recover') {
                if (riskLevel === 'High') {
                    recommendation = 'Enhance disaster recovery plans and ensure backup systems are reliable and regularly tested.';
                } else if (riskLevel === 'Medium') {
                    recommendation = 'Review and update disaster recovery procedures and test backup restoration processes.';
                } else {
                    recommendation = 'Maintain recovery processes and perform periodic restoration tests.';
                }
            }
    
            // Create a new row in the table
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${category}</td>
                <td>${averageScore}</td>  <!-- Display Risk Score -->
                <td data-risk="${riskLevel}">${riskLevel}</td>  <!-- Apply data attribute for Risk Level -->
                <td>${recommendation}</td>  <!-- Show custom recommendations -->
            `;
    
            tableBody.appendChild(row);
        });
    }
    
    
    

    function initializeLineChart() {
        const ctx = document.getElementById('lineChart').getContext('2d');
        lineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: timeLabels, 
                datasets: [{
                    label: 'Average Risk Over Time',
                    data: riskOverTimeData, // Dynamically updated with the average risk scores
                    backgroundColor: 'rgba(75, 192, 192, 0.2)', // Line color
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: true
                }]
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Time (Assessments or Dates)'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Average Risk Score'
                        },
                        max: 3 
                    }
                }
            }
        });
    }

    function updateLineChart() {
        const currentTime = new Date().toLocaleString(); 
    
        // Calculate the current average risk score across all categories
        let totalRisk = 0;
        let count = 0;
    
        for (let category in riskData) {
            riskData[category].forEach(score => {
                totalRisk += score;
                count++;
            });
        }
    
        const averageRiskScore = (count > 0) ? (totalRisk / count).toFixed(2) : 0;
    
        // Push the current time and risk score to the chart data
        timeLabels.push(currentTime);
        riskOverTimeData.push(averageRiskScore);
    
        lineChart.update();
    }

    


    function initializeStackedBarChart() {
        const ctx = document.getElementById('stackedBarChart').getContext('2d');
        stackedBarChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: categories, // identify, protect....
                datasets: [{
                    label: 'High Risk',
                    data: [], 
                    backgroundColor: 'rgba(255, 99, 132, 0.2)', // High Risk
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }, {
                    label: 'Medium Risk',
                    data: [], 
                    backgroundColor: 'rgba(54, 162, 235, 0.2)', // Medium Risk
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }, {
                    label: 'Low Risk',
                    data: [],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)', // Low Risk
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    x: {
                        stacked: true
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true,
                        max: 10 
                    }
                }
            }
        });
    }

    function updateStackedBarChart() {
        let highRiskCounts = [];
        let mediumRiskCounts = [];
        let lowRiskCounts = [];
    
        categories.forEach(category => {
            let highRisk = 0;
            let mediumRisk = 0;
            let lowRisk = 0;
    
            riskData[category].forEach(score => {
                if (score >= 2.5) {
                    highRisk++;
                } else if (score >= 1.5) {
                    mediumRisk++;
                } else {
                    lowRisk++;
                }
            });
    
            highRiskCounts.push(highRisk);
            mediumRiskCounts.push(mediumRisk);
            lowRiskCounts.push(lowRisk);
        });
    
        // Update the datasets for the stacked bar chart
        stackedBarChart.data.datasets[0].data = highRiskCounts;
        stackedBarChart.data.datasets[1].data = mediumRiskCounts;
        stackedBarChart.data.datasets[2].data = lowRiskCounts;
    
        stackedBarChart.update();
    }
    

function initializeBarChart() {
    const ctx = document.getElementById('barChart').getContext('2d');
    barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categories,
            datasets: [{
                label: 'Average Risk Score',
                data: [], 
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Categories/Function)'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Average Risk Score'
                    },
                    max: 3 
                }
            }
        }
    });
}
function updateBarChart() {
    const averageScores = categories.map(category => {
        const scores = riskData[category];
        return (scores.length > 0) ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2) : 0;
    });

    // Update the chart's data
    barChart.data.datasets[0].data = averageScores;

    barChart.update();
}
window.onload = function() {
    // Initialize the bar chart 
    initializeBarChart();
    // Initialize the pie chart
    initializePieChart();
    // Initialize the stacked bar chart
    initializeStackedBarChart();
    // Initialize the line chart for risk over time
    initializeLineChart();
};
    // Initialize radar chart with empty data
    function initializeChart() {
        const ctx = document.getElementById('riskChart').getContext('2d');
        chart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: categories,
                datasets: [{
                    label: 'Risk Levels',
                    data: [0, 0, 0, 0, 0], 
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scale: {
                    ticks: {
                        beginAtZero: true,
                        min: 0,
                        max: 3,
                        stepSize: 1
                    }
                },
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    // Update the chart data based on current risk levels
    function updateChart() {
        const averages = categories.map(category => {
            const scores = riskData[category];
            if (scores.length === 0) return 0;
            const sum = scores.reduce((a, b) => a + b, 0);
            return (sum / scores.length).toFixed(2); 
        });

        chart.data.datasets[0].data = averages;
        chart.update();
    }

    function calculateRisk() {
        // Reset the risk data object
        riskData = {
            'Identify': [],
            'Protect': [],
            'Detect': [],
            'Respond': [],
            'Recover': []
        };

        // categorize risk lvl
        riskInputs.forEach(input => {
            const value = input.value;
            const riskScore = riskMapping[value];
            const fieldId = input.id;

            // Map inputs to their category
            if (fieldId.startsWith('identify')) {
                riskData['Identify'].push(riskScore);
            } else if (fieldId.startsWith('protect')) {
                riskData['Protect'].push(riskScore);
            } else if (fieldId.startsWith('detect')) {
                riskData['Detect'].push(riskScore);
            } else if (fieldId.startsWith('respond')) {
                riskData['Respond'].push(riskScore);
            } else if (fieldId.startsWith('recover')) {
                riskData['Recover'].push(riskScore);
            }
        });

        // Update charts with the new risk data
        updateChart();
        updateBarChart();
        updatePieChart();
        updateStackedBarChart();
        updateLineChart();
        updateFindingsTable();

        resultsSection.style.display = 'block'; 
        riskScores.innerHTML = ''; 

        categories.forEach(category => {
            const scores = riskData[category];
            const avgScore = (scores.length > 0) ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2) : '0.00';
            const riskLevel = avgScore >= 2.5 ? 'High' : avgScore >= 1.5 ? 'Medium' : 'Low';

            const resultElement = document.createElement('div');
            resultElement.innerHTML = `
                <h3>${category}</h3>
                <p>Average Risk Score: ${avgScore}</p>
                <p>Risk Level: ${riskLevel}</p>
            `;
            riskScores.appendChild(resultElement);
        });
    }

    // Initialize the radar chart
    initializeChart();

    riskInputs.forEach(input => {
        input.addEventListener('change', calculateRisk);
    });

    
});


