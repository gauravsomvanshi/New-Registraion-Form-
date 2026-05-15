// Global State for Mock Data
let mockRecords = [];
let isAdminLoggedIn = false;

/**
 * Switch views between User and Admin panels
 */
function switchView(viewName) {
    // Hide all panels
    document.querySelectorAll('.view-panel').forEach(panel => {
        panel.classList.add('hidden');
    });

    // Update Nav Buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    if (viewName === 'user') {
        document.getElementById('userPanel').classList.remove('hidden');
        document.getElementById('navUser').classList.add('active');
    } else if (viewName === 'adminLogin') {
        if (isAdminLoggedIn) {
            // Skip login if already authenticated
            showAdminDashboard();
        } else {
            document.getElementById('adminLoginPanel').classList.remove('hidden');
            document.getElementById('navAdmin').classList.add('active');
        }
    }
}

/**
 * Handle Admin Login
 */
function handleLogin(event) {
    event.preventDefault();
    const user = document.getElementById('adminUser').value;
    const pass = document.getElementById('adminPass').value;
    const errorMsg = document.getElementById('loginError');

    // Mock authentication
    if (user === 'admin' && pass === 'admin') {
        isAdminLoggedIn = true;
        errorMsg.style.display = 'none';
        document.getElementById('loginForm').reset();
        showAdminDashboard();
    } else {
        errorMsg.style.display = 'block';
    }
    return false;
}

/**
 * Logout Admin
 */
function logoutAdmin() {
    isAdminLoggedIn = false;
    document.getElementById('navLogout').classList.add('hidden');
    switchView('user');
}

/**
 * Show Admin Dashboard
 */
function showAdminDashboard() {
    document.getElementById('adminLoginPanel').classList.add('hidden');
    document.getElementById('adminDashboardPanel').classList.remove('hidden');
    document.getElementById('navAdmin').classList.add('active');
    document.getElementById('navLogout').classList.remove('hidden');
    renderTable();
    updateDashboardStats();
}

/**
 * Toggle the visibility of the vehicle number input based on checkbox selection
 */
function toggleVehicleInput() {
    const hasVehicle = document.getElementById('hasVehicle').checked;
    const vehicleContainer = document.getElementById('vehicleNumberContainer');
    const vehicleInput = document.getElementById('vehicleNumber');

    if (hasVehicle) {
        vehicleContainer.style.display = 'flex';
        vehicleInput.setAttribute('required', 'required');
        vehicleContainer.style.opacity = '0';
        setTimeout(() => {
            vehicleContainer.style.transition = 'opacity 0.3s ease';
            vehicleContainer.style.opacity = '1';
        }, 10);
    } else {
        vehicleContainer.style.display = 'none';
        vehicleInput.removeAttribute('required');
        vehicleInput.value = '';
    }
}

/**
 * Update the placeholder and validation pattern of the ID Number input
 */
function updateIdFormat() {
    const idType = document.getElementById('idType').value;
    const idInput = document.getElementById('idNumber');

    switch(idType) {
        case 'aadhar':
            idInput.placeholder = '12-digit Aadhar Number (e.g. 1234 5678 9012)';
            idInput.pattern = '\\d{12}';
            idInput.title = 'Must be a 12-digit number';
            break;
        case 'pan':
            idInput.placeholder = '10-character PAN (e.g. ABCDE1234F)';
            idInput.pattern = '[A-Z]{5}[0-9]{4}[A-Z]{1}';
            idInput.title = 'Must be 5 letters, 4 numbers, and 1 letter';
            idInput.oninput = function() { this.value = this.value.toUpperCase(); };
            break;
        case 'dl':
            idInput.placeholder = 'Driving License Number (e.g. MH1220110012345)';
            idInput.removeAttribute('pattern');
            idInput.title = 'Enter valid Driving License Number';
            idInput.oninput = function() { this.value = this.value.toUpperCase(); };
            break;
        case 'voter':
            idInput.placeholder = 'Voter ID Number (e.g. ABC1234567)';
            idInput.removeAttribute('pattern');
            idInput.title = 'Enter valid Voter ID';
            idInput.oninput = function() { this.value = this.value.toUpperCase(); };
            break;
        default:
            idInput.placeholder = 'Enter ID number';
            idInput.removeAttribute('pattern');
            idInput.oninput = null;
    }
}

/**
 * Handle form submission
 */
function submitForm(event) {
    event.preventDefault();
    const form = document.getElementById('registrationForm');
    const btn = document.querySelector('#userPanel .submit-btn');
    const msg = document.getElementById('formMessage');

    if (!form.checkValidity()) {
        form.reportValidity();
        return false;
    }

    btn.classList.add('loading');
    btn.disabled = true;
    msg.className = 'form-message';
    msg.style.display = 'none';

    setTimeout(() => {
        btn.classList.remove('loading');
        btn.disabled = false;
        msg.textContent = 'Registration Successful! Please collect your visitor pass from the reception.';
        msg.className = 'form-message success';
        
        // Save new entry to mock data
        const now = new Date();
        const deptValue = document.getElementById('department').value || 'general';
        const newRecord = {
            time: now,
            timeString: now.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
            name: document.getElementById('fullName').value || 'New Visitor',
            phone: document.getElementById('phone').value || '1234567890',
            dept: deptValue.charAt(0).toUpperCase() + deptValue.slice(1),
            purpose: document.getElementById('purpose').value || 'Meeting',
            status: 'Pending',
            isNew: true // Flag to highlight in UI
        };
        
        mockRecords.unshift(newRecord);

        form.reset();
        document.getElementById('vehicleNumberContainer').style.display = 'none';
        document.getElementById('idNumber').placeholder = 'Enter ID number';

        setTimeout(() => {
            msg.style.display = 'none';
        }, 5000);

    }, 1500);

    return false;
}

/**
 * Demo Data Generation for Recent Entries
 */
function generateDemoRecords() {
    const mockNames = ['Rahul Sharma', 'Priya Singh', 'Amit Kumar', 'Sneha Patel', 'Vikram Desai', 'Anjali Gupta', 'Rohan Mehta', 'Kavita Reddy', 'Suresh Nair', 'Pooja Joshi', 'Rajesh Verma', 'Neha Chawla', 'Manoj Tiwari', 'Divya Iyer', 'Sanjay Dutt', 'Ritu Kapoor', 'Arjun Yadav', 'Kiran Bedi', 'Deepak Chopra', 'Sunita Williams'];
    const mockDepts = ['cyber', 'traffic', 'narcotics', 'general', 'fir', 'other'];
    const mockPurposes = ['Official Meeting', 'Follow-up', 'Complaint Registration', 'Document Submission', 'Interrogation', 'Inquiry'];

    const now = new Date();
    
    for (let i = 0; i < 25; i++) {
        const time = new Date(now.getTime() - Math.floor(Math.random() * 10000000 * (i + 1)));
        const deptValue = mockDepts[Math.floor(Math.random() * mockDepts.length)];
        
        mockRecords.push({
            time: time,
            timeString: time.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
            name: mockNames[i % mockNames.length],
            phone: '98' + Math.floor(10000000 + Math.random() * 90000000),
            dept: deptValue.charAt(0).toUpperCase() + deptValue.slice(1),
            purpose: mockPurposes[Math.floor(Math.random() * mockPurposes.length)],
            status: Math.random() > 0.3 ? 'Approved' : 'Pending',
            isNew: false
        });
    }
}

/**
 * Render the Admin Table
 */
function renderTable() {
    const tableBody = document.getElementById('recordsBody');
    tableBody.innerHTML = '';
    
    mockRecords.forEach((record, index) => {
        const tr = document.createElement('tr');
        if (record.isNew) {
            tr.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
            setTimeout(() => {
                tr.style.backgroundColor = '';
                tr.style.transition = 'background 1s ease';
                record.isNew = false;
            }, 3000);
        }
        
        let actionButtons = '';
        if (record.status === 'Pending') {
            actionButtons = `
                <button class="action-btn btn-approve" onclick="approveRecord(${index})" title="Approve">✓</button>
                <button class="action-btn btn-reject" onclick="rejectRecord(${index})" title="Reject">✗</button>
            `;
        } else {
            actionButtons = `<span style="color: var(--text-muted); font-size: 0.8rem;">-</span>`;
        }

        let statusClass = 'status-pending';
        if (record.status === 'Approved') statusClass = 'status-approved';
        if (record.status === 'Rejected') statusClass = 'status-rejected';

        tr.innerHTML = `
            <td>${record.timeString}</td>
            <td><strong>${record.name}</strong></td>
            <td>${record.phone}</td>
            <td>${record.dept}</td>
            <td>${record.purpose}</td>
            <td><span class="status-badge ${statusClass}">${record.status}</span></td>
            <td>${actionButtons}</td>
        `;
        tableBody.appendChild(tr);
    });
}

/**
 * Approve a record
 */
function approveRecord(index) {
    mockRecords[index].status = 'Approved';
    renderTable();
    updateDashboardStats();
}

/**
 * Reject a record
 */
function rejectRecord(index) {
    mockRecords[index].status = 'Rejected';
    renderTable();
    updateDashboardStats();
}

/**
 * Update Dashboard Stats
 */
function updateDashboardStats() {
    const total = mockRecords.length;
    const approved = mockRecords.filter(r => r.status === 'Approved').length;
    const pending = mockRecords.filter(r => r.status === 'Pending').length;

    document.getElementById('statTotal').textContent = total;
    document.getElementById('statApproved').textContent = approved;
    document.getElementById('statPending').textContent = pending;
}

// Initialize application
window.addEventListener('DOMContentLoaded', () => {
    generateDemoRecords();
    switchView('user'); // Ensure we start on User Panel
});

/**
 * Export records to CSV (Excel compatible)
 */
function exportToExcel() {
    if (mockRecords.length === 0) {
        alert("No records to export.");
        return;
    }

    // Define CSV Headers
    let csvContent = "Time,Name,Phone,Department,Purpose,Status\n";

    // Map records to CSV rows
    mockRecords.forEach(record => {
        // Escape commas and quotes for CSV
        const safeName = `"${record.name.replace(/"/g, '""')}"`;
        const safePurpose = `"${record.purpose.replace(/"/g, '""')}"`;
        // Remove commas from timeString just in case
        const safeTime = `"${record.timeString.replace(/"/g, '""')}"`;
        
        csvContent += `${safeTime},${safeName},${record.phone},${record.dept},${safePurpose},${record.status}\n`;
    });

    // Create a Blob from the CSV string
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link element and trigger download
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `visitor_records_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
