let array = [];
let delay = 500;
let abortController = null;

// Delay slider handler
document.getElementById('delaySlider').addEventListener('input', function () {
  delay = Number(this.value);
  document.getElementById('delayValue').innerText = delay;
});

// Button event listeners with algorithm identifier (the button's id)
document.getElementById('generateArrayBtn').addEventListener('click', generateArray);
document.getElementById('bubbleSortBtn').addEventListener('click', function () {
  startSort(bubbleSortLogic, 'bubbleSortBtn');
});
document.getElementById('insertionSortBtn').addEventListener('click', function () {
  startSort(insertionSortLogic, 'insertionSortBtn');
});
document.getElementById('selectionSortBtn').addEventListener('click', function () {
  startSort(selectionSortLogic, 'selectionSortBtn');
});
document.getElementById('mergeSortBtn').addEventListener('click', function () {
  startSort(mergeSortLogic, 'mergeSortBtn');
});
document.getElementById('quickSortBtn').addEventListener('click', function () {
  startSort(quickSortLogic, 'quickSortBtn');
});

// Generates a new array of random heights and creates visual bars.
function generateArray() {
  const arrayContainer = document.getElementById('array-container');
  arrayContainer.innerHTML = '';
  array = [];

  for (let i = 0; i < 50; i++) {
    const height = Math.floor(Math.random() * 200) + 10;
    array.push(height);
    const bar = document.createElement('div');
    bar.classList.add('bar');
    bar.style.height = `${height}px`;
    arrayContainer.appendChild(bar);
  }
}

// Starts the sort function with abort support, highlights the running sort,
// and measures the time taken.
async function startSort(sortFunction, algoBtnId) {
  // Remove "running" class from all sort buttons
  const sortButtons = ['bubbleSortBtn', 'insertionSortBtn', 'selectionSortBtn', 'mergeSortBtn', 'quickSortBtn'];
  sortButtons.forEach(id => {
    document.getElementById(id).classList.remove('running');
  });
  
  // Add running class to the selected algorithm's button
  const runningButton = document.getElementById(algoBtnId);
  runningButton.classList.add('running');

  // Reset the time taken display
  document.getElementById('timeTaken').innerText = "Time Taken: ...";

  if (abortController) {
    abortController.abort();
  }
  abortController = new AbortController();

  let startTime = performance.now();
  try {
    await sortFunction(abortController.signal);
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Sorting was aborted.');
      document.getElementById('timeTaken').innerText = "Time Taken: Aborted";
      runningButton.classList.remove('running');
      return;
    } else {
      throw error;
    }
  }
  let endTime = performance.now();
  let totalTime = Math.round(endTime - startTime);
  document.getElementById('timeTaken').innerText = `Time Taken: ${totalTime} ms`;
  runningButton.classList.remove('running');
  abortController = null;
}

// Removes visual highlights from all bars.
function resetBarColors() {
  const bars = document.querySelectorAll('.bar');
  bars.forEach(bar => bar.classList.remove('selected'));
}

// Bubble Sort
async function bubbleSortLogic(signal) {
  resetBarColors();
  const bars = document.querySelectorAll('.bar');
  for (let i = 0; i < array.length; i++) {
    if (signal.aborted) throw new Error('AbortError');
    for (let j = 0; j < array.length - i - 1; j++) {
      if (signal.aborted) throw new Error('AbortError');

      bars[j].classList.add('selected');
      bars[j + 1].classList.add('selected');
      await new Promise(resolve => setTimeout(resolve, delay));

      if (array[j] > array[j + 1]) {
        const temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;
        bars[j].style.height = `${array[j]}px`;
        bars[j + 1].style.height = `${array[j + 1]}px`;
      }

      bars[j].classList.remove('selected');
      bars[j + 1].classList.remove('selected');
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Insertion Sort
async function insertionSortLogic(signal) {
  resetBarColors();
  const bars = document.querySelectorAll('.bar');
  for (let i = 1; i < array.length; i++) {
    if (signal.aborted) throw new Error('AbortError');

    let key = array[i];
    let j = i - 1;

    while (j >= 0 && array[j] > key) {
      if (signal.aborted) throw new Error('AbortError');

      bars[j].classList.add('selected');
      bars[j + 1].classList.add('selected');
      await new Promise(resolve => setTimeout(resolve, delay));

      array[j + 1] = array[j];
      bars[j + 1].style.height = `${array[j + 1]}px`;

      bars[j].classList.remove('selected');
      bars[j + 1].classList.remove('selected');
      j--;
    }
    array[j + 1] = key;
    bars[j + 1].style.height = `${key}px`;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}

// Selection Sort
async function selectionSortLogic(signal) {
  resetBarColors();
  const bars = document.querySelectorAll('.bar');
  for (let i = 0; i < array.length - 1; i++) {
    if (signal.aborted) throw new Error('AbortError');

    let minIndex = i;
    for (let j = i + 1; j < array.length; j++) {
      if (signal.aborted) throw new Error('AbortError');

      bars[minIndex].classList.add('selected');
      bars[j].classList.add('selected');
      await new Promise(resolve => setTimeout(resolve, delay));

      if (array[j] < array[minIndex]) {
        minIndex = j;
      }

      bars[minIndex].classList.remove('selected');
      bars[j].classList.remove('selected');
    }
    const temp = array[i];
    array[i] = array[minIndex];
    array[minIndex] = temp;
    bars[i].style.height = `${array[i]}px`;
    bars[minIndex].style.height = `${array[minIndex]}px`;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}

// Merge Sort
async function mergeSortLogic(signal) {
  resetBarColors();
  await mergeSort(array, 0, array.length - 1, signal);
}

async function mergeSort(arr, start, end, signal) {
  if (start < end) {
    if (signal.aborted) throw new Error("AbortError");
    const mid = Math.floor((start + end) / 2);
    await mergeSort(arr, start, mid, signal);
    await mergeSort(arr, mid + 1, end, signal);
    await merge(arr, start, mid, end, signal);
  }
}

async function merge(arr, start, mid, end, signal) {
  const leftArr = arr.slice(start, mid + 1);
  const rightArr = arr.slice(mid + 1, end + 1);
  let i = 0, j = 0, k = start;
  const bars = document.querySelectorAll('.bar');

  while (i < leftArr.length && j < rightArr.length) {
    if (signal.aborted) throw new Error("AbortError");
    bars[k].classList.add('selected');
    await new Promise(resolve => setTimeout(resolve, delay));

    if (leftArr[i] <= rightArr[j]) {
      arr[k] = leftArr[i];
      bars[k].style.height = `${leftArr[i]}px`;
      i++;
    } else {
      arr[k] = rightArr[j];
      bars[k].style.height = `${rightArr[j]}px`;
      j++;
    }
    bars[k].classList.remove('selected');
    k++;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  while (i < leftArr.length) {
    if (signal.aborted) throw new Error("AbortError");
    bars[k].classList.add('selected');
    await new Promise(resolve => setTimeout(resolve, delay));

    arr[k] = leftArr[i];
    bars[k].style.height = `${leftArr[i]}px`;
    bars[k].classList.remove('selected');
    i++;
    k++;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  while (j < rightArr.length) {
    if (signal.aborted) throw new Error("AbortError");
    bars[k].classList.add('selected');
    await new Promise(resolve => setTimeout(resolve, delay));

    arr[k] = rightArr[j];
    bars[k].style.height = `${rightArr[j]}px`;
    bars[k].classList.remove('selected');
    j++;
    k++;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}

// Quick Sort
async function quickSortLogic(signal) {
  resetBarColors();
  await quickSort(array, 0, array.length - 1, signal);
}

async function quickSort(arr, low, high, signal) {
  if (low < high) {
    let pi = await partition(arr, low, high, signal);
    await quickSort(arr, low, pi - 1, signal);
    await quickSort(arr, pi + 1, high, signal);
  }
}

async function partition(arr, low, high, signal) {
  const bars = document.querySelectorAll('.bar');
  let pivot = arr[high];
  let i = low - 1;
  // Highlight the pivot
  bars[high].classList.add('selected');
  for (let j = low; j <= high - 1; j++) {
    if (signal.aborted) throw new Error('AbortError');
    bars[j].classList.add('selected');
    await new Promise(resolve => setTimeout(resolve, delay));
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      bars[i].style.height = `${arr[i]}px`;
      bars[j].style.height = `${arr[j]}px`;
    }
    bars[j].classList.remove('selected');
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  bars[i + 1].style.height = `${arr[i + 1]}px`;
  bars[high].style.height = `${arr[high]}px`;
  bars[high].classList.remove('selected');
  await new Promise(resolve => setTimeout(resolve, delay));
  return i + 1;
}