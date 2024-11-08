let users = JSON.parse(localStorage.getItem('users')) || { sender: [], volunteer: [] };
let availableRequests = JSON.parse(localStorage.getItem('availableRequests')) || [];
let pendingJobs = [];
let currentUser = null;

function saveData() {
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('availableRequests', JSON.stringify(availableRequests));
}

function showSenderLogin() {
    resetVisibility();
    document.getElementById('senderLoginForm').classList.remove('hidden');
}

function showVolunteerLogin() {
    resetVisibility();
    document.getElementById('volunteerLoginForm').classList.remove('hidden');
}

function showSenderRegisterForm() {
    resetVisibility();
    document.getElementById('senderRegisterForm').classList.remove('hidden');
}

function showVolunteerRegisterForm() {
    resetVisibility();
    document.getElementById('volunteerRegisterForm').classList.remove('hidden');
}

function login(role) {
    const username = document.getElementById(`${role}LoginUsername`).value;
    const password = document.getElementById(`${role}LoginPassword`).value;
    const user = users[role].find(u => u.username === username && u.password === password);
    if (user) {
        currentUser = user;
        document.getElementById(`${role}Name`).textContent = user.name;
        resetVisibility();
        document.getElementById(`${role}Section`).classList.remove('hidden');
    } else {
        alert('Invalid login credentials');
    }
}

function register(role) {
    const name = document.getElementById(`${role}RegisterName`).value;
    const phone = document.getElementById(`${role}RegisterPhone`).value;
    const username = document.getElementById(`${role}RegisterUsername`).value;
    const password = document.getElementById(`${role}RegisterPassword`).value;

    if (!name || !phone || !username || !password) {
        alert('Please fill in all fields.');
        return;
    }

    // Check if the username already exists
    if (users[role].some(u => u.username === username)) {
        alert('Username already taken, please choose another one.');
        return;
    }

    users[role].push({ name, phone, username, password });
    alert(`${role === 'sender' ? 'Sender' : 'Volunteer'} registration successful!`);
    saveData();
    role === 'sender' ? showSenderLogin() : showVolunteerLogin();
}

function showSendFoodForm() {
    resetVisibility();
    document.getElementById('sendFoodForm').classList.remove('hidden');
}

function sendFoodSubmit() {
    const houseNo = document.getElementById('sendHouseNo').value;
    const area = document.getElementById('sendArea').value;
    const plates = document.getElementById('sendPlates').value;
    const senderName = document.getElementById('sendName').value;
    const senderPhone = document.getElementById('sendPhone').value;

    if (!houseNo || !area || !plates || !senderName || !senderPhone) {
        alert('Please fill in all fields.');
        return;
    }

    // Validate Indian phone number (10 digits)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(senderPhone)) {
        alert('Please enter a valid Indian phone number.');
        return;
    }

    // Add the request to the available requests
    availableRequests.push({ houseNo, area, plates, senderName, senderPhone });
    saveData();

    // Show thank you message to the sender after submission
    alert('Food request submitted successfully! Thank you! Our volunteer will reach you soon.');

    backToSenderSection();
}

function showReceiveFoodSection() {
    resetVisibility();
    document.getElementById('receiveFoodSection').classList.remove('hidden');
    renderAvailableRequests();
    renderPendingJobs();
}

function renderAvailableRequests() {
    const availableRequestsDiv = document.getElementById('availableRequests');
    availableRequestsDiv.innerHTML = availableRequests.map((req, index) => `
        <div class="food-request">
            <p><strong>Location:</strong> ${req.houseNo}, ${req.area} - Plates: ${req.plates}</p>
            <p><strong>Contact:</strong> ${req.senderName} - ${req.senderPhone}</p>
            <button onclick="takeRequest(${index})">Take Job</button>
        </div>
    `).join('');
}

function takeRequest(index) {
    const selectedRequest = availableRequests[index];

    // Add the job to the volunteer's pending jobs
    pendingJobs.push(selectedRequest);
    availableRequests.splice(index, 1);
    saveData();

    alert('You have taken this job.');

    renderAvailableRequests();
    renderPendingJobs();
}

function renderPendingJobs() {
    const pendingJobsDiv = document.getElementById('pendingJobs');
    pendingJobsDiv.innerHTML = pendingJobs.map((job, index) => `
        <div class="food-request">
            <p><strong>Location:</strong> ${job.houseNo}, ${job.area} - Plates: ${job.plates}</p>
            <p><strong>Volunteer:</strong> ${currentUser.name}</p>
            <button onclick="markJobCompleted(${index})">Completed</button>
        </div>
    `).join('');
}

function markJobCompleted(jobIndex) {
    // Remove the completed job from the pending jobs list
    const completedJob = pendingJobs.splice(jobIndex, 1)[0];
    
    // Optionally, you can log this completed job or send a notification if necessary.
    console.log(`Job completed: ${completedJob.houseNo}, ${completedJob.area}`);

    // Save updated data
    saveData();

    // Re-render the pending jobs list
    renderPendingJobs();
}

function backToSenderSection() {
    resetVisibility();
    document.getElementById('senderSection').classList.remove('hidden');
}

function backToVolunteerSection() {
    resetVisibility();
    document.getElementById('volunteerSection').classList.remove('hidden');
}

function logout() {
    currentUser = null;
    resetVisibility();
    showRoleSelection();
}

function resetVisibility() {
    document.querySelectorAll('.form-container').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.section-container').forEach(el => el.classList.add('hidden'));
}

function showRoleSelection() {
    document.getElementById('roleSelection').classList.remove('hidden');
}
