let array = [];
let arrayContainer = document.getElementById('array-container');
let messagesContainer = document.getElementById('messages');
let currentStep = 0;
let searchValue = null;
let isSearching = false;

function generateArray() {
    const size = parseInt(document.getElementById('arraySize').value);
    array = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
    updateArrayDisplay();
    addMessage("Generated new array: " + array.join(', '));
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
    addMessage(`Searching for value: ${searchValue}`);
    currentStep = 0;
    isSearching = true;
    document.getElementById('stepButton').disabled = false;
    document.getElementById('resetButton').disabled = false;
}

function stepSearch() {
    if (!isSearching || currentStep >= array.length) {
        return;
    }
    highlightBars([currentStep], 'highlight');

    if (array[currentStep] === searchValue) {
        highlightBars([currentStep], 'found');
        addMessage(`Value ${searchValue} found at index ${currentStep}.`);
        isSearching = false;
        document.getElementById('stepButton').disabled = true;
    } else {
        addMessage(`Value ${searchValue} not at index ${currentStep}.`);
        currentStep++;
        if (currentStep >= array.length) {
            addMessage(`Value ${searchValue} not found in array.`);
            document.getElementById('stepButton').disabled = true;
        }
    }
}

function resetSearch() {
    isSearching = false;
    currentStep = 0;
    searchValue = null;
    document.getElementById('stepButton').disabled = true;
    document.getElementById('resetButton').disabled = true;
    resetBars();
    messagesContainer.innerHTML = '';
}

function resetSearchControls() {
    isSearching = false;
    currentStep = 0;
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
