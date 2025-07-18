let array = [];
let arrayContainer = document.getElementById('array-container');
let messagesContainer = document.getElementById('messages');
let low = 0, high = 0, mid = 0;
let searchValue = null;
let isSearching = false;

function generateArray() {
    const size = parseInt(document.getElementById('arraySize').value);
    array = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
    array.sort((a, b) => a - b); // Sorting the array
    updateArrayDisplay();
    addMessage("Generated sorted array: " + array.join(', '));
    resetSearchControls();
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

function startSearch() {
    searchValue = parseInt(document.getElementById('searchValue').value);
    if (!searchValue || isNaN(searchValue)) {
        addMessage("Please enter a valid search value.");
        return;
    }
    low = 0;
    high = array.length - 1;
    mid = Math.floor((low + high) / 2);
    addMessage(`Searching for value: ${searchValue}`);
    isSearching = true;
    document.getElementById('stepButton').disabled = false;
    document.getElementById('resetButton').disabled = false;
}

function stepSearch() {
    if (!isSearching || low > high) {
        addMessage(`Value ${searchValue} not found in array.`);
        return;
    }

    mid = Math.floor((low + high) / 2);
    highlightBars([mid], 'highlight');

    if (array[mid] === searchValue) {
        highlightBars([mid], 'found');
        addMessage(`Value ${searchValue} found at index ${mid}.`);
        isSearching = false;
        document.getElementById('stepButton').disabled = true;
    } else if (array[mid] < searchValue) {
        addMessage(`Searching right half, value not at index ${mid}.`);
        low = mid + 1;
    } else {
        addMessage(`Searching left half, value not at index ${mid}.`);
        high = mid - 1;
    }

    if (low > high) {
        addMessage(`Value ${searchValue} not found in array.`);
        document.getElementById('stepButton').disabled = true;
    }
}

function resetSearch() {
    isSearching = false;
    low = 0;
    high = 0;
    mid = 0;
    searchValue = null;
    document.getElementById('stepButton').disabled = true;
    document.getElementById('resetButton').disabled = true;
    resetBars();
    messagesContainer.innerHTML = '';
}

function resetSearchControls() {
    isSearching = false;
    low = 0;
    high = 0;
    mid = 0;
    searchValue = null;
    document.getElementById('stepButton').disabled = true;
    document.getElementById('resetButton').disabled = true;
    resetBars();
    messagesContainer.innerHTML = '';
}

function resetBars() {
    document.querySelectorAll('.bar').forEach(bar => {
        bar.classList.remove('highlight', 'found');
    });
}

function highlightBars(indices, className = 'highlight') {
    document.querySelectorAll('.bar').forEach(bar => bar.classList.remove('highlight', 'found'));
    indices.forEach(index => {
        document.getElementById(`bar-${index}`).classList.add(className);
    });
}

generateArray();
