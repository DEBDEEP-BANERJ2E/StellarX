const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});

function showErrorMessage(inputId, message) {
    let errorElement = document.getElementById(`${inputId}-error`);
    if (!errorElement) {
        errorElement = document.createElement("p");
        errorElement.id = `${inputId}-error`;
        errorElement.style.color = "red";
        errorElement.style.fontSize = "14px";
        errorElement.style.margin = "0px";
        document.getElementById(inputId).insertAdjacentElement("afterend", errorElement);
    }
    errorElement.innerText = message;
}

function clearErrorMessage(inputId) {
    let errorElement = document.getElementById(`${inputId}-error`);
    if (errorElement) {
        errorElement.innerText = "";
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    const requirements = {
        length: { met: password.length >= 10, message: "At least 10 characters" },
        uppercase: { met: /[A-Z]/.test(password), message: "At least 1 uppercase letter" },
        lowercase: { met: /[a-z]/.test(password), message: "At least 1 lowercase letter" },
        numbers: { met: /\d/.test(password), message: "At least 1 number" },
        special: { met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password), message: "At least 1 special character" }
    };

    let requirementsList = document.getElementById('password-requirements');
    if (!requirementsList) {
        requirementsList = document.createElement('ul');
        requirementsList.id = 'password-requirements';
        
        // Insert after password input container and before confirm password container
        const passwordContainer = document.querySelector('.password-container');
        passwordContainer.insertAdjacentElement('afterend', requirementsList);
    }

    requirementsList.innerHTML = '';

    Object.entries(requirements).forEach(([key, {met, message}]) => {
        const li = document.createElement('li');
        li.innerHTML = `${met ? '✅' : '❌'} ${message}`;
        li.style.color = met ? '#00cc00' : '#ff0000';
        requirementsList.appendChild(li);
    });

    return Object.values(requirements).every(req => req.met);
}

window.validateSignUp = async function () {
    var name = document.getElementById("name").value.trim();
    var email = document.getElementById("signup-email").value.trim();
    var password = document.getElementById("signup-password").value.trim();
    var confirmPassword = document.getElementById("confirm-password").value.trim();
    var checkbox = document.getElementById("t_and_c").checked;

    let isValid = true;

    // Name validation
    if (!name) {
        showErrorMessage("name", "Name is required");
        isValid = false;
    } else if (name.length < 2) {
        showErrorMessage("name", "Name must be at least 2 characters long");
        isValid = false;
    } else {
        clearErrorMessage("name");
    }

    // Email validation
    if (!validateEmail(email)) {
        showErrorMessage("signup-email", "Please enter a valid email address");
        isValid = false;
    } else {
        clearErrorMessage("signup-email");
    }

    // Password validation
    if (!validatePassword(password)) {
        isValid = false;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
        showErrorMessage("confirm-password", "Passwords must match");
        isValid = false;
    }

    // Terms checkbox validation
    if (!checkbox) {
        alert("Please agree to the Terms of Service");
        isValid = false;
    }

    if (!isValid) return;

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Registration successful! Please log in.");
        container.classList.remove("right-panel-active");
    } catch (error) {
        alert("Error: " + error.message);
    }
};

window.validateSignIn = async function () {
    var email = document.getElementById("signin-email").value.trim();
    var password = document.getElementById("signin-password").value.trim();

    let isValid = true;

    if (!validateEmail(email)) {
        showErrorMessage("email1", "Invalid email format.");
        isValid = false;
    } else {
        clearErrorMessage("email1");
    }

    if (!validatePassword(password)) {
        showErrorMessage("password1", "Password must be at least 6 characters.");
        isValid = false;
    } else {
        clearErrorMessage("password1");
    }

    if (!isValid) return;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "next_index.html";
    } catch (error) {
        alert("Error: " + error.message);
    }
};

function togglePassword(inputId, icon) {
    const inputField = document.getElementById(inputId);
    if (inputField.type === "password") {
        inputField.type = "text"; // Change to text to show the password
        icon.classList.remove("fa-eye-slash"); // Remove the eye-slash icon
        icon.classList.add("fa-eye"); // Add the eye icon to indicate visible
    } else {
        inputField.type = "password"; // Change back to password to hide the password
        icon.classList.remove("fa-eye"); // Remove the eye icon
        icon.classList.add("fa-eye-slash"); // Add the eye-slash icon to indicate hidden
    }
}

function generateStrongPassword() {
    const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerCase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const specialChars = "!@#$%^&*()-_+=";

    let password = "";

    // Ensure at least one of each required character type
    password += upperCase[Math.floor(Math.random() * upperCase.length)];
    password += lowerCase[Math.floor(Math.random() * lowerCase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];

    // Fill the rest of the password
    const allChars = upperCase + lowerCase + numbers + specialChars;
    for (let i = password.length; i < 12; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    document.getElementById("signup-password").value = password;

    // Clear any error messages
    clearErrorMessage("signup-password");
}

// Add these functions after the existing validation functions

function setupImmediateValidation() {
    // Name field validation
    const nameInput = document.getElementById('name');
    nameInput.addEventListener('blur', function() {
        const name = this.value.trim();
        if (!name) {
            showErrorMessage("name", "Name is required");
            this.focus();
            return false;
        } else if (name.length < 2) {
            showErrorMessage("name", "Name must be at least 2 characters long");
            this.focus();
            return false;
        } else {
            clearErrorMessage("name");
            return true;
        }
    });

    // Email field validation
    const emailInput = document.getElementById('signup-email');
    emailInput.addEventListener('input', function() {
        const email = this.value.trim();
        if (!validateEmail(email)) {
            showErrorMessage("signup-email", "Please enter a valid email address");
        } else {
            clearErrorMessage("signup-email");
        }
    });

    // Password field validation
    const passwordInput = document.getElementById('signup-password');
    passwordInput.addEventListener('input', function() {
        validatePassword(this.value);
    });

    // Confirm password validation
    const confirmPasswordInput = document.getElementById('confirm-password');
    confirmPasswordInput.addEventListener('input', function() {
        const password = passwordInput.value;
        const confirmPassword = this.value;
        if (password !== confirmPassword) {
            showErrorMessage("confirm-password", "Passwords do not match");
        } else {
            clearErrorMessage("confirm-password");
        }
    });

    // Prevent moving to email if name is invalid
    emailInput.addEventListener('focus', function(e) {
        const name = nameInput.value.trim();
        if (!name || name.length < 2) {
            e.preventDefault();
            nameInput.focus();
            showErrorMessage("name", "Please enter a valid name first");
        }
    });

    // Prevent moving to password if email is invalid
    passwordInput.addEventListener('focus', function(e) {
        const email = emailInput.value.trim();
        if (!validateEmail(email)) {
            e.preventDefault();
            emailInput.focus();
            showErrorMessage("signup-email", "Please enter a valid email first");
        }
    });

    // Prevent moving to confirm password if password is invalid
    confirmPasswordInput.addEventListener('focus', function(e) {
        const password = passwordInput.value;
        if (!validatePassword(password)) {
            e.preventDefault();
            passwordInput.focus();
        }
    });
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', setupImmediateValidation);

document.querySelector('.generate-password').addEventListener('mouseenter', function() {
    const passwordInput = document.getElementById('signup-password');
    const eyeIcon = passwordInput.nextElementSibling; // Gets the eye icon
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
});

document.querySelector('.generate-password').addEventListener('mouseleave', function() {
    const passwordInput = document.getElementById('signup-password');
    const eyeIcon = passwordInput.nextElementSibling; // Gets the eye icon
    if (passwordInput.type === 'text') {
        passwordInput.type = 'password';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    }
});




