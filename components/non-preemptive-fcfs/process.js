function getArrivalTimes(form) {
    return form.arrivalTimes.value;
}

function getCpuCycles(form) {
    return form.cpuCycles.value;
}

function convertData(string) {
    let array = string.split(" ").map(Number);
    return array;
}

function combineArrays(arrival_array, burst_array) {
    let pair_array = [];
    
    // Combine the two arrays to form a key value pair
    for (let i = 0; i < arrival_array.length; i++) {
        let pair = {};
        pair["ID"] = "P" + (i+1);
        pair["arrival"] = arrival_array[i];
        pair["burst"] = burst_array[i];
        pair["startTime"] = -1;
        pair["endTime"] = -1;
        pair["waiting"] = 0;
        pair["turnaround"] = 0;
        pair_array.push(pair);
    }

    // Sort array
    pair_array.sort((a,b) => a.arrival - b.arrival);
    console.log(pair_array[0]);
    return pair_array;
}

/*
    Include the idle!
    pair_array Must already be sorted!
*/
function schedule(process) {
    let ganttChart = [];

    // Check for idle time before the first process
    if (process[0].arrival > 0) {
        let start = 0;
        let end = process[0].arrival;
        ganttChart.push({ process: 'Idle', start: start, end: end});
    }
    // Start time for the first process is its arrival time
    process[0].startTime = process[0].arrival;

    // Calculate waiting time, turnaround time, start time, and end time for each process
    for (let i = 0; i < process.length; i++) {
        if (i > 0 && process[i].arrival > process[i - 1].endTime) {
            let start = process[i - 1].endTime;
            let end = process[i].arrival;

            ganttChart.push({ process: 'Idle', start: start, end: end});
        }
        // Calculate waiting time using the given formula
        process[i].waiting = i > 0 ? (process[i - 1].arrival + process[i - 1].burst + process[i - 1].waiting) - process[i].arrival: 0 ;
        // Calculate start time for the current process
        process[i].startTime = process[i].arrival + process[i].waiting;

        // Calculate end time for the current process
        process[i].endTime = process[i].startTime + process[i].burst;

        // Calculate turnaround time for the current process
        process[i].turnaround = process[i].endTime - process[i].arrival;
        ganttChart.push({
            process: process[i].ID,
            start: process[i].startTime,
            end: process[i].endTime,
        });

    }
    return ganttChart;
}

function createTable(pair_array) {
 

    var table = document.getElementById("outputTable");
    
    if (!table) {
        console.error("Table element not found");
        return;
    }

    table.innerHTML = ''; // Clear any existing content within the table
    
    // Create table header
    var headerRow = table.insertRow(0);
    var headers = ['Process ID', 'Arrival Times', 'Burst Times', 'Start Times', 'End Times', 'Waiting Times', 'Turnover Times'];

    for (let i = 0; i < headers.length; i++) {
        let headerCell = headerRow.insertCell(i);
        headerCell.textContent = headers[i];
    }

    // Create table rows with data
    for (let i = 0; i < pair_array.length; i++) {
        var row = table.insertRow(i + 1);
        var cells = [pair_array[i].ID, pair_array[i].arrival, pair_array[i].burst, pair_array[i].startTime, pair_array[i].endTime, pair_array[i].waiting, pair_array[i].turnaround];

        for (let j = 0; j < cells.length; j++) {
            let cell = row.insertCell(j);
            cell.textContent = cells[j];
        }
    }
 // Calculate average turnaround and waiting times
 var avgTurnaround = 0;
 var avgWaiting = 0;

 for (let i = 0; i < pair_array.length; i++) {
     avgTurnaround += pair_array[i].turnaround;
     avgWaiting += pair_array[i].waiting;
 }

 avgTurnaround /= pair_array.length;
 avgWaiting /= pair_array.length;

 // Add a new row for average times
 var avgRow = table.insertRow(pair_array.length + 1);
 var avgCells = ['', '', '', '', 'Average:', '' + avgWaiting.toFixed(2), '' + avgTurnaround.toFixed(2)];

 for (let j = 0; j < avgCells.length; j++) {
     let cell = avgRow.insertCell(j);
     cell.textContent = avgCells[j];
 }
}

function createGanttChart(ganttChart) {
    var table = document.getElementById("gnattChart");
    
    if (!table) {
        console.error("Gantt Chart element not found");
        return;
    }

    table.innerHTML = ''; // Clear any existing content within the Gantt chart
    var jobRow = table.insertRow(0);
    var timeRow = table.insertRow(1);
        
    for (let i = 0; i < ganttChart.length; i++) {
        let jobCell = jobRow.insertCell(i);
        let timeCell = timeRow.insertCell(i);

        let jobLabel = ganttChart[i].process;
        let startTime = ganttChart[i].start;
        let endTime = ganttChart[i].end;

        jobCell.textContent = jobLabel;
        jobCell.classList.add('job-cell');

        if (i === 0){
        timeCell.textContent = `${startTime} ---- ${endTime}`;
        }
        else
        {
            timeCell.textContent = endTime;
        }

        timeCell.classList.add('time-cell');

        jobCell.setAttribute('data-start', startTime);
        jobCell.setAttribute('data-end', endTime);
        timeCell.setAttribute('data-start', startTime);
        timeCell.setAttribute('data-end', endTime);
    }
    
}

function processData(form) {
    let x = getArrivalTimes(form).trim();
    let y = getCpuCycles(form).trim();

    function containsLettersOrSpecialCharacters(inputString) {
        return /[^\d\s]/.test(inputString); // Regex to check for characters other than digits and spaces
    }

    // Check if inputs contain letters or special characters
    if (containsLettersOrSpecialCharacters(x) || containsLettersOrSpecialCharacters(y)) {
        alert("Invalid Input. Please enter only numbers separated by spaces in Arrival Times and CPU Cycles!");
        return;
    }

    // Convert the string to an array
    let arrival_array = convertData(x);
    let burst_array = convertData(y);

    // Check first if the length of the two arrays are equal
    if (arrival_array.length !== burst_array.length) {
        alert("Invalid Input. Arrival Times and CPU Cycle count are not the same!")
        return;
    }
    
    // This array does not know if it contains idle
    let pair_array = combineArrays(arrival_array, burst_array);
    console.log(pair_array[0]);
    let ganttChart = schedule(pair_array);
    createTable(pair_array);
    createGanttChart(ganttChart);
}