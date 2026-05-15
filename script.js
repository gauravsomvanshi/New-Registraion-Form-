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
        // Smooth fade in
        vehicleContainer.style.opacity = '0';
        setTimeout(() => {
            vehicleContainer.style.transition = 'opacity 0.3s ease';
            vehicleContainer.style.opacity = '1';
        }, 10);
    } else {
        vehicleContainer.style.display = 'none';
        vehicleInput.removeAttribute('required');
        vehicleInput.value = ''; // clear value
    }
}

/**
 * Update the placeholder and validation pattern of the ID Number input
 * based on the selected ID type.
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
            // Convert to uppercase on input
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
    event.preventDefault(); // Prevent actual form submission

    const form = document.getElementById('registrationForm');
    const btn = document.querySelector('.submit-btn');
    const msg = document.getElementById('formMessage');

    // Basic custom validation (HTML5 covers most, but just to be sure)
    if (!form.checkValidity()) {
        form.reportValidity();
        return false;
    }

    // Set loading state
    btn.classList.add('loading');
    btn.disabled = true;
    msg.className = 'form-message'; // reset message classes
    msg.style.display = 'none';

    // Simulate API Call / Registration Process
    setTimeout(() => {
        // Reset loading state
        btn.classList.remove('loading');
        btn.disabled = false;

        // Show Success Message
        msg.textContent = 'Registration Successful! Please collect your visitor pass from the reception.';
        msg.className = 'form-message success';
        
        // Reset the form
        form.reset();
        
        // Hide the vehicle input if it was shown
        document.getElementById('vehicleNumberContainer').style.display = 'none';
        document.getElementById('idNumber').placeholder = 'Enter ID number';

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
            msg.style.display = 'none';
        }, 5000);

    }, 2000); // 2 second mock delay

    return false;
}
