let array = [];
let arrayContainer = document.getElementById('array-container');
let messagesContainer = document.getElementById('messages');
let sortingProcess = null;
let isSorting = false;

function generateArray() {
    const size = parseInt(document.getElementById('arraySize').value);
    array = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
    updateArrayDisplay();
    addMessage("Generated new array: " + array.join(', '));
    resetSortingControls();
}

function updateArrayDisplay() {
    arrayContainer.innerHTML = '';
    const maxValue = Math.max(...array);
    array.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${(value / maxValue) * 280}px`;
        bar.id = `bar-${index}`;
        
        const label = document.createElement('div');
        label.className = 'bar-label';
        label.textContent = value;
        
        bar.appendChild(label);
        arrayContainer.appendChild(bar);
    });
}

function addMessage(message) {
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function addElement() {
    const newValue = Math.floor(Math.random() * 100) + 1;
    array.push(newValue);
    updateArrayDisplay();
    addMessage(`Added element: ${newValue}`);
    resetSortingControls();
}

function removeElement() {
    if (array.length > 0) {
        const removedValue = array.pop();
        updateArrayDisplay();
        addMessage(`Removed element: ${removedValue}`);
        resetSortingControls();
    } else {
        addMessage("Cannot remove element from an empty array.");
    }
}

async function startSort() {
    if (!isSorting) {
        isSorting = true;
        messagesContainer.innerHTML = '';
        sortingProcess = quickSort(0, array.length - 1);
        document.getElementById('stepButton').disabled = false;
        document.getElementById('removeStepButton').disabled = false;
        await runSort();
    }
}

async function runSort() {
    while (isSorting) {
        const result = await sortingProcess.next();
        if (result.done) {
            addMessage("Sorting completed!");
            resetSortingControls();
            break;
        }
        await new Promise(resolve => setTimeout(resolve, 500));
    }
}

async function stepSort() {
    if (sortingProcess) {
        const result = await sortingProcess.next();
        if (result.done) {
            addMessage("Sorting completed!");
            resetSortingControls();
        }
    }
}

function removeStep() {
    if (isSorting) {
        isSorting = false;
        addMessage("Sorting process stopped.");
        resetSortingControls();
    }
}

function resetSortingControls() {
    isSorting = false;
    sortingProcess = null;
    document.getElementById('stepButton').disabled = true;
    document.getElementById('removeStepButton').disabled = true;
    document.querySelectorAll('.bar').forEach(bar => {
        bar.classList.remove('highlight', 'sorted');
    });
}

async function* quickSort(low, high) {
    if (low < high) {
        const pivotIndex = yield* partition(low, high);
        yield* quickSort(low, pivotIndex - 1);
        yield* quickSort(pivotIndex + 1, high);
    }
}

async function* partition(low, high) {
    const pivot = array[high];
    highlightBars([high]);
    addMessage(`Choosing pivot: ${pivot}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        highlightBars([j, i + 1]);
        await new Promise(resolve => setTimeout(resolve, 500));

        if (array[j] <= pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
            updateBar(i, array[i]);
            updateBar(j, array[j]);
            yield;
        }
    }
    
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    updateBar(i + 1, array[i + 1]);
    updateBar(high, array[high]);
    
    addMessage(`Partitioned: ${array.slice(low, high + 1).join(', ')}`);
    yield;
    return i + 1;
}

function highlightBars(indices) {
    document.querySelectorAll('.bar').forEach(bar => bar.classList.remove('highlight'));
    indices.forEach(index => {
        document.getElementById(`bar-${index}`).classList.add('highlight');
    });
}

function updateBar(index, value) {
    const bar = document.getElementById(`bar-${index}`);
    const maxValue = Math.max(...array);
    bar.style.height = `${(value / maxValue) * 280}px`;
    bar.querySelector('.bar-label').textContent = value;
    bar.classList.add('highlight');
    setTimeout(() => bar.classList.remove('highlight'), 300);
}

generateArray();
