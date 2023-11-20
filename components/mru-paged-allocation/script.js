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
      throw new Error("Pages can only contain numbers separated by spaces");
    }
  
    // Split the string by spaces and convert each part to a number
    return string.split(/\s+/).map(Number);
  }

function runMRU(form) {
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = ''; // Clear the content of the output div
    try {
    const inputString = getPages(form);
    let x = inputString.length;
    const frameSize = getFrameSize(form); // Set the size of the page frames
    const frames = [];
    let pageFaults = 0;

    function displayFrames() {
        outputDiv.innerHTML += 'Frames: ' + frames.join(' ') + '<br>';
    }

    for (let i = 0; i < inputString.length; i++) {
        const page = inputString[i];

        // Check if the page is already in the frame
        if (frames.includes(page)) {
            displayFrames();
        } else {
            pageFaults++;

            // Check if there is space in the frame
            if (frames.length < frameSize) {
                frames.push(page);
            } else {
                // Find the index of the most recently used page in the frame and replace it
                const lastUsedIndex = frames.map((p, index) => ({ page: p, lastIndex: inputString.lastIndexOf(p, i - 1) })).sort((a, b) => b.lastIndex - a.lastIndex)[0];
                const index = frames.indexOf(lastUsedIndex.page);
                frames[index] = page;
            }

            displayFrames();
        }
    }

    outputDiv.innerHTML += '<br>Total Failure: ' + pageFaults;
    outputDiv.innerHTML += '<br>Total Success: ' + (x - pageFaults);
    outputDiv.innerHTML += '<br>Failure Rate: ' + (((pageFaults / x) * 100).toFixed(2));
    outputDiv.innerHTML += '<br>Success Rate: ' + (((x - pageFaults) / x) * 100).toFixed(2);
    console.log((((x - pageFaults) / x) * 100).toFixed(2));
    console.log(x);
} catch (error) {
    alert(error.message);
}
}