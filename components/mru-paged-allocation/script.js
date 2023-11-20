function getFrameSize(form) {
    try {
        const frameSize = parseInt(form.frameSizeForm.value);
        console.log("Frame Count" + frameSize);
        if (isNaN(frameSize)) {
            throw new Error('Please input integers only');
        }
        
        return frameSize;
    } catch (error) {
        alert(error.message);
        return null; // or any other value that suits your needs
    }
}

function getPages(form) {
    let string = form.pageNumbersForm.value.trim();
  
    // Check if the input contains non-numeric characters or spaces only
    if (!string.match(/^[0-9\s]+$/)) {
      alert("Pages can only contain numbers separated by spaces");
      return;
    }
  
    // Split the string by spaces and convert each part to a number
    return string.split(/\s+/).map(Number);
  }

function runMRU(form) {
    MRU(getPages(form), getFrameSize(form));
}

function MRU(pages, frameSize) {
    const frames = [];
    const framesHistory = [];
    const pageFaultsHistory = [];
    let pageFaults = 0;
    let x = pages.length;

    for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        let pageFault = false;

        if (frames.includes(page)) {
            framesHistory.push([...frames]);
        } else {
            pageFault = true;
            pageFaults++;

            if (frames.length < frameSize) {
                frames.unshift(page); // Add the new page at the beginning (most recently used position)
            } else {
                frames.pop(); // Remove the least recently used page (last element in array)
                frames.unshift(page); // Add the new page at the beginning
            }

            framesHistory.push([...frames]);
        }

        pageFaultsHistory.push(pageFault);
    }

    // Create a table dynamically
    var table = document.getElementById("outputTable");
    table.innerHTML = '';
    // Create header row
    const headerRow = table.insertRow();
    const stepHeader = document.createElement('th');
    stepHeader.textContent = 'Step';
    headerRow.appendChild(stepHeader);

    for (let i = 1; i <= frameSize; i++) {
        const frameHeader = document.createElement('th');
        frameHeader.textContent = `Frame ${i}`;
        headerRow.appendChild(frameHeader);
    }

    const pageFaultHeader = document.createElement('th');
    pageFaultHeader.textContent = 'Page Fault';
    headerRow.appendChild(pageFaultHeader);

    // Create rows for each step
    for (let i = 0; i < framesHistory.length; i++) {
        const row = table.insertRow();
        const stepCell = row.insertCell(0);
        stepCell.textContent = i + 1;

        for (let j = 0; j < frameSize; j++) {
            const cell = row.insertCell(j + 1);
            cell.textContent = framesHistory[i][j] || '-';
        }

        const pageFaultCell = row.insertCell(frameSize + 1);
        pageFaultCell.textContent = pageFaultsHistory[i] ? 'Yes' : 'No';
    }

    // Append the table to the body
    //document.body.appendChild(table);
    var outputDiv = document.getElementById("outputTable-container")
    outputDiv.innerHTML += '<br>Total Failure: ' + pageFaults;
    outputDiv.innerHTML += '<br>Total Success: ' + (x - pageFaults);
    outputDiv.innerHTML += '<br>Failure Rate: ' + (((pageFaults / x) * 100).toFixed(2));
    outputDiv.innerHTML += '<br>Success Rate: ' + (((x - pageFaults) / x) * 100).toFixed(2);
    console.log('Total Page Faults:', pageFaults);
}
