// script.js

// --- DOM Elements ---
const homePage = document.getElementById('home-page');
const processPage = document.getElementById('process-page');
const successPage = document.getElementById('success-page');

const injectionForm = document.getElementById('injection-form');
const platformSelect = document.getElementById('platform');
const typeSelect = document.getElementById('type');
const usernameInput = document.getElementById('username');
const targetCountInput = document.getElementById('target-count');

const progressBar = document.getElementById('progress-bar');
const progressPercentage = document.getElementById('progress-percentage');
const currentStatus = document.getElementById('current-status');
const currentInjectedCount = document.getElementById('current-injected-count');
const injectedLabel = document.getElementById('injected-label');

const summaryPlatform = document.getElementById('summary-platform');
const summaryUsername = document.getElementById('summary-username');
const summaryType = document.getElementById('summary-type');
const summaryTarget = document.getElementById('summary-target');

const repeatBtn = document.getElementById('repeat-btn');
const backBtn = document.getElementById('back-btn');

// --- State Variables ---
let injectionData = {};
let animationInterval;
let statusInterval;

// --- Utility Functions ---

/**
 * Switches the active page view.
 * @param {HTMLElement} pageToShow - The page element to show.
 */
function showPage(pageToShow) {
    [homePage, processPage, successPage].forEach(page => {
        page.classList.add('hidden');
        page.classList.remove('active');
    });
    pageToShow.classList.remove('hidden');
    pageToShow.classList.add('active');
}

/**
 * Formats a number with dots as thousands separators.
 * @param {number} num - The number to format.
 * @returns {string} The formatted number string.
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// --- Main Logic ---

/**
 * Handles the form submission and starts the process.
 * @param {Event} e - The form submission event.
 */
function handleFormSubmit(e) {
    e.preventDefault();

    // 1. Collect data
    injectionData = {
        platform: platformSelect.value,
        type: typeSelect.value,
        username: usernameInput.value,
        target: parseInt(targetCountInput.value),
        injected: 0
    };

    // 2. Validate data (HTML validation handles min/max, but good to double-check)
    if (injectionData.target < 100 || injectionData.target > 100000000) {
        alert("Jumlah target harus antara 100 dan 100.000.000.");
        return;
    }

    // 3. Update process page label
    injectedLabel.textContent = injectionData.type;

    // 4. Switch to process page
    showPage(processPage);

    // 5. Start the simulation
    startSimulation();
}

/**
 * Starts the animated simulation process.
 */
function startSimulation() {
    let currentPercentage = 0;
    let currentStatusIndex = 0;
    const statuses = [
        "Memverifikasi data...",
        "Menghubungkan server...",
        "Mengirim paket...",
        "Mengenkripsi koneksi...",
        "Mengirim paket data 1/3...",
        "Mengirim paket data 2/3...",
        "Mengirim paket data 3/3...",
        "Finalisasi..."
    ];

    // Reset process page
    progressBar.style.width = '0%';
    progressPercentage.textContent = '0%';
    currentInjectedCount.textContent = '0';
    currentStatus.textContent = statuses[0];
    injectionData.injected = 0;

    // Status update interval (slower, step-by-step)
    statusInterval = setInterval(() => {
        if (currentStatusIndex < statuses.length - 1) {
            currentStatusIndex++;
            currentStatus.textContent = statuses[currentStatusIndex];
        }
    }, 3000); // Change status every 3 seconds

    // Injection animation interval (fast, pseudo-random)
    animationInterval = setInterval(() => {
        // 1. Update progress bar
        if (currentPercentage < 100) {
            // Progress bar moves steadily, but slightly faster than the injection count
            currentPercentage = Math.min(100, currentPercentage + 0.5);
            progressBar.style.width = currentPercentage + '%';
            progressPercentage.textContent = Math.floor(currentPercentage) + '%';
        }

        // 2. Update injected count
        if (injectionData.injected < injectionData.target) {
            // Calculate remaining amount
            const remaining = injectionData.target - injectionData.injected;

            // Determine the next step size (pseudo-random, larger steps for larger targets)
            let step;
            if (remaining > 1000000) {
                step = Math.floor(Math.random() * (injectionData.target / 5000)) + 10000;
            } else if (remaining > 100000) {
                step = Math.floor(Math.random() * (injectionData.target / 500)) + 1000;
            } else if (remaining > 1000) {
                step = Math.floor(Math.random() * 500) + 50;
            } else {
                step = Math.floor(Math.random() * 10) + 1;
            }

            // Ensure we don't overshoot the target
            injectionData.injected = Math.min(injectionData.target, injectionData.injected + step);
            currentInjectedCount.textContent = formatNumber(injectionData.injected);
        }

        // 3. Check for completion
        if (injectionData.injected >= injectionData.target && currentPercentage >= 100) {
            clearInterval(animationInterval);
            clearInterval(statusInterval);
            currentStatus.textContent = "Proses selesai. Mengalihkan...";
            
            // Ensure final display is 100% and target count
            progressBar.style.width = '100%';
            progressPercentage.textContent = '100%';
            currentInjectedCount.textContent = formatNumber(injectionData.target);

            // Wait a moment before showing success page
            setTimeout(showSuccessPage, 1500);
        }

    }, 50); // Update every 50ms for smooth animation
}

/**
 * Prepares and displays the success page.
 */
function showSuccessPage() {
    // Update summary
    summaryPlatform.textContent = injectionData.platform;
    summaryUsername.textContent = injectionData.username;
    summaryType.textContent = injectionData.type;
    summaryTarget.textContent = formatNumber(injectionData.target);

    showPage(successPage);
}

/**
 * Resets the application to the home page.
 */
function resetApp() {
    // Clear any running intervals just in case
    clearInterval(animationInterval);
    clearInterval(statusInterval);

    // Reset form
    injectionForm.reset();
    
    // Switch to home page
    showPage(homePage);
}

// --- Event Listeners ---
injectionForm.addEventListener('submit', handleFormSubmit);
repeatBtn.addEventListener('click', resetApp);
backBtn.addEventListener('click', resetApp);

// Initialize the view
showPage(homePage);
