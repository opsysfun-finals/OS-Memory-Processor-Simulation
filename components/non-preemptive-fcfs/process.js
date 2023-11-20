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
        pair["arrival"] = arrival_array[i];
        pair["burst"] = burst_array[i];
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
function schedule(pair_array) {
    let clock = 0;
    let start_times = [];
    let end_times = [];
    let waiting_times = [];
    let turnover_times = [];

    // Used by while loop below
    let i = 0;

    // Scheduling for first job
    start_times.push(pair_array[i].arrival);
    end_times.push(pair_array[i].burst + start_times[i]);
    waiting_times.push(start_times[i] - pair_array[i].arrival);
    turnover_times.push(end_times[i] - pair_array[i].arrival);

    clock += end_times[i];
    i++;

    while (i < pair_array.length) {
        // Determine if job arrival is within the current time
        if (pair_array[i].arrival <= clock) {
            start_times.push(end_times[i-1]);
            end_times.push(pair_array[i].burst + start_times[i]);
            clock++;
        } else {
            start_times.push(end_times[i-1] + (pair_array[i].arrival - clock));
            end_times.push(pair_array[i].burst + start_times[i]);
            clock += end_times[i];
        }

        // Solve for waiting and turnover
        waiting_times.push(start_times[i] - pair_array[i].arrival);
        turnover_times.push(end_times[i] - pair_array[i].arrival);
        i++;
    }
    console.log("start " +start_times);
    console.log("end " +end_times);
    console.log("wait "+waiting_times);
    console.log("twt "+turnover_times);

    return {
        start_times,
        end_times,
        waiting_times,
        turnover_times,
    };
}

function createTable(pair_array, map) {
    let start_times = map.start_times;
    let end_times = map.end_times;
    let wait_times = map.waiting_times; // Change to match the provided key in the returned object
    let turnover_times = map.turnover_times;
    let average_wait = 0;
    let average_turnaround = 0;    

    var table = document.getElementById("outputTable");
    
    if (!table) {
        console.error("Table element not found");
        return;
    }

    table.innerHTML = ''; // Clear any existing content within the table
    
    // Create table header
    var headerRow = table.insertRow(0);
    var headers = ['Arrival Times', 'Burst Times', 'Start Times', 'End Times', 'Waiting Times', 'Turnover Times'];

    for (let i = 0; i < headers.length; i++) {
        let headerCell = headerRow.insertCell(i);
        headerCell.textContent = headers[i];
    }

    // Create table rows with data
    for (let i = 0; i < start_times.length; i++) {
        var row = table.insertRow(i + 1);
        var cells = [pair_array[i].arrival, pair_array[i].burst, start_times[i], end_times[i], wait_times[i], turnover_times[i]];

        // Sum of waiting and turn around
        average_wait += wait_times[i];
        average_turnaround += turnover_times[i];

        for (let j = 0; j < cells.length; j++) {
            let cell = row.insertCell(j);
            cell.textContent = cells[j];
        }
    }

    average_wait /= wait_times.length;
    average_turnaround /= turnover_times.length;

    // Append average wait and turn around
    var endRow = table.insertRow(-1);

    for (let i = 0; i < 6; i++) {
        var endCell = endRow.insertCell(i);
        
        if (i === 4) {
            endCell.textContent = average_wait.toFixed(2);
        } else if (i === 5) {
            endCell.textContent = average_turnaround.toFixed(2);
        }
    }
}

// FIX THIS
function createGanttChart(map) {
    let start_times = map.start_times;
    let end_times = map.end_times;

    var table = document.getElementById("gnattChart");
    
    if (!table) {
        console.error("Gantt Chart element not found");
        return;
    }

    table.innerHTML = ''; // Clear any existing content within the table

    var jobRow = table.insertRow(0);
    var timeRow = table.insertRow(1);

    for (let i = 0; i < start_times.length; i++) {
        let jobCell = jobRow.insertCell(i);
        let timeCell = timeRow.insertCell(i);

        let jobLabel = "J" + (i + 1);
        let startTime = start_times[i];
        let endTime = end_times[i];

        jobCell.textContent = jobLabel;
        jobCell.classList.add('job-cell');

        timeCell.textContent = startTime;
        timeCell.classList.add('time-cell');

        jobCell.setAttribute('data-start', startTime);
        jobCell.setAttribute('data-end', endTime);
        timeCell.setAttribute('data-start', startTime);
        timeCell.setAttribute('data-end', endTime);
    }
}

function processData(form) {
    let x = getArrivalTimes(form);
    let y = getCpuCycles(form);

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
    let map = schedule(pair_array);

    createTable(pair_array, map);
    createGanttChart(map);
}