
function getArrivalTimes(form) {
    return form.arrivalTimes.value;
}

function getCpuCycles(form) {
    return form.cpuCycles.value;
}

function getCpuPriority(form) {
    return form.priorityForm.value;
}

function convertData(string) {
    let array = string.split(" ").map(Number);
    return array;
}

function combineArrays(arrival_array, burst_array, priority_array) {
    let pair_array = [];
    // Combine the two arrays to form a key value pair
    for (let i = 0; i < arrival_array.length; i++) {
        let pair = {};
        pair["ID"] = "P" + (i+1);
        pair["arrival"] = arrival_array[i];
        pair["burst"] = burst_array[i];
        pair["priority"] = priority_array[i];
        pair["startTime"] = -1;
        pair["endTime"] = -1;
        pair["waiting"] = 0;
        pair["turnaround"] = 0;
        pair["remainingBurst"] = burst_array[i];
        pair_array.push(pair);
        
    }
    pair_array.sort((a,b) => a.arrival - b.arrival);
    
    return pair_array;
}
function priorityScheduling(pair_array) {
    let currentTime = 0;
    let completedProcess = 0;
    let currentProcess = null;
    let ganttChart = [];

            while (completedProcess < pair_array.length) {
                let highestPriorityProcess = null;

                for (let i = 0; i < pair_array.length; i++) {
                    if (pair_array[i].arrival <= currentTime && pair_array[i].remainingBurst > 0) {
                        if (highestPriorityProcess === null || pair_array[i].priority < highestPriorityProcess.priority) {
                            highestPriorityProcess = pair_array[i];
                        }
                    }
                }

                if (highestPriorityProcess !== null) {
                    if (currentProcess !== highestPriorityProcess) {
                        // Context switch detected
                        if (currentProcess !== null) {
                            ganttChart.push({ process: currentProcess.ID, start: currentProcess.arrival, end: currentTime });
                        }
                        currentProcess = highestPriorityProcess;
                    }
                    if (currentProcess.startTime === -1) {
                        if (currentTime < currentProcess.arrival) {
                            ganttChart.push({ process: 'Idle', start: currentTime, end: currentProcess.arrival });
                            currentTime = currentProcess.arrival;
                        }
                        currentProcess.startTime = currentTime;
                    }

                    currentProcess.remainingBurst--;

                    if (currentProcess.remainingBurst === 0) {
                        currentProcess.endTime = currentTime + 1;
                        currentProcess.turnaround = currentProcess.endTime - currentProcess.arrival;
                        currentProcess.waiting = currentProcess.turnaround - currentProcess.burst;
                        
                        ganttChart.push({
                            process: currentProcess.ID,
                            start: currentProcess.startTime,
                            end: currentProcess.endTime,
                        });

                        completedProcess++;
                        currentProcess = null;
                    }
                }
                else {
                    // If no process is available at the current time, create an idle task
                    ganttChart.push({ process: 'Idle', start: currentTime, end: currentTime + 1 });
                    console.log("yes");
                }
                
                currentTime++;
                
            }
            if (currentTime < ganttChart[ganttChart.length - 1].end) {
                ganttChart.push({ process: 'Idle', start: currentTime, end: ganttChart[ganttChart.length - 1].end });
            }
            console.log("Gantt Chart:");
    for (let i = 0; i < ganttChart.length; i++) {
        console.log(`${ganttChart[i].process}\tStart Time: ${ganttChart[i].start}\tEnd Time: ${ganttChart[i].end}`);
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
    var headers = ['Process ID', 'Arrival Times', 'Burst Times', 'Priority','Start Times', 'End Times', 'Waiting Times', 'Turnover Times'];

    for (let i = 0; i < headers.length; i++) {
        let headerCell = headerRow.insertCell(i);
        headerCell.textContent = headers[i];
    }

    // Create table rows with data
    for (let i = 0; i < pair_array.length; i++) {
        var row = table.insertRow(i + 1);
        var cells = [pair_array[i].ID, pair_array[i].arrival, pair_array[i].burst, pair_array[i].priority, pair_array[i].startTime, pair_array[i].endTime, pair_array[i].waiting, pair_array[i].turnaround];

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
     var avgCells = ['', '', '', '', '', 'Average:', '' + avgWaiting.toFixed(2), '' + avgTurnaround.toFixed(2)];
 
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
    let space = "         ";
        
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
// get function
function processData(form) {
    let x = getArrivalTimes(form);
    let y = getCpuCycles(form);
    let z = getCpuPriority(form);

    // Convert the string to an array
    let arrival_array = convertData(x);
    let burst_array = convertData(y);
    let priority_array = convertData(z);

    // Check first if the length of the two arrays are equal
    if (arrival_array.length !== burst_array.length) {
        alert("Invalid Input. Arrival Times and CPU Cycle count are not the same!")
        return;
    }
    else if (priority_array.length !== arrival_array.length){
        alert("Invalid Input. Arrival Times and CPU Cycle Priority count are not the same!")
        return;
    }
    
    // This array does not know if it contains idle
    let pair_array = combineArrays(arrival_array, burst_array,priority_array);
    let ganttChart = priorityScheduling(pair_array);
    createTable(pair_array);
    createGanttChart(ganttChart);

}
