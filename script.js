// Global variables
let passwordStrengthHistory = [];
let currentStrength = 0;

// Password strength checker function
function checkPasswordStrength(password) {
    let strength = 0;
    let feedback = [];
    
    // Check length (most important factor)
    if (password.length >= 8) {
        strength += 1;
        document.getElementById('length').classList.add('valid');
    } else {
        document.getElementById('length').classList.remove('valid');
        feedback.push('Password too short');
    }
    
    // Check for uppercase letters
    if (/[A-Z]/.test(password)) {
        strength += 1;
        document.getElementById('uppercase').classList.add('valid');
    } else {
        document.getElementById('uppercase').classList.remove('valid');
        feedback.push('Add uppercase letters');
    }
    
    // Check for lowercase letters
    if (/[a-z]/.test(password)) {
        strength += 1;
        document.getElementById('lowercase').classList.add('valid');
    } else {
        document.getElementById('lowercase').classList.remove('valid');
        feedback.push('Add lowercase letters');
    }
    
    // Check for numbers
    if (/[0-9]/.test(password)) {
        strength += 1;
        document.getElementById('number').classList.add('valid');
    } else {
        document.getElementById('number').classList.remove('valid');
        feedback.push('Add numbers');
    }
    
    // Check for special characters
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        strength += 1;
        document.getElementById('special').classList.add('valid');
    } else {
        document.getElementById('special').classList.remove('valid');
        feedback.push('Add special characters');
    }
    
    // Bonus checks for even stronger passwords
    let bonusPoints = 0;
    
    // Length bonus
    if (password.length >= 12) bonusPoints += 0.5;
    if (password.length >= 16) bonusPoints += 0.5;
    
    // Variety bonus
    if (password.length >= 8 && strength >= 4) {
        const uniqueChars = new Set(password.toLowerCase()).size;
        if (uniqueChars >= 8) bonusPoints += 0.5;
    }
    
    // Common pattern penalties
    if (/123456|password|qwerty|admin|letmein/i.test(password)) {
        bonusPoints -= 1;
        feedback.push('Avoid common patterns');
    }
    
    // Repeated characters penalty
    if (/(.)\1{2,}/.test(password)) {
        bonusPoints -= 0.5;
        feedback.push('Avoid repeated characters');
    }
    
    const finalStrength = Math.max(0, Math.min(5, strength + bonusPoints));
    
    return { 
        strength: finalStrength, 
        feedback: feedback,
        criteria: {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            numbers: /[0-9]/.test(password),
            special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
        }
    };
}

// Update strength meter with smooth animation
function updateStrengthMeter(strength) {
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    
    // Calculate percentage
    const percentage = (strength / 5) * 100;
    
    // Update bar width with animation
    strengthBar.style.width = percentage + '%';
    
    // Remove all strength classes
    strengthBar.classList.remove('very-weak', 'weak', 'fair', 'good', 'strong');
    
    // Update text and color based on strength
    if (strength <= 1) {
        strengthBar.classList.add('very-weak');
        strengthText.textContent = 'Very Weak 😰';
        strengthText.style.color = '#dc3545';
        strengthText.style.backgroundColor = '#f8d7da';
    } else if (strength <= 2) {
        strengthBar.classList.add('weak');
        strengthText.textContent = 'Weak 😟';
        strengthText.style.color = '#fd7e14';
        strengthText.style.backgroundColor = '#fdf4e6';
    } else if (strength <= 3) {
        strengthBar.classList.add('fair');
        strengthText.textContent = 'Fair 😐';
        strengthText.style.color = '#ffc107';
        strengthText.style.backgroundColor = '#fff9e6';
    } else if (strength <= 4) {
        strengthBar.classList.add('good');
        strengthText.textContent = 'Good 😊';
        strengthText.style.color = '#20c997';
        strengthText.style.backgroundColor = '#e6f9f5';
    } else {
        strengthBar.classList.add('strong');
        strengthText.textContent = 'Very Strong 🔒';
        strengthText.style.color = '#28a745';
        strengthText.style.backgroundColor = '#e8f5e8';
    }
    
    // Store current strength for analytics
    currentStrength = strength;
}

// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.toggle-btn');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.textContent = '🙈';
        toggleBtn.setAttribute('aria-label', 'Hide password');
    } else {
        passwordInput.type = 'password';
        toggleBtn.textContent = '👁️';
        toggleBtn.setAttribute('aria-label', 'Show password');
    }
}

// Generate password suggestion
function generatePasswordSuggestion() {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let password = '';
    
    // Ensure at least one character from each category
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Fill remaining length with random characters
    const allChars = lowercase + uppercase + numbers + symbols;
    for (let i = password.length; i < 12; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
}

// Add password suggestion feature
function addPasswordSuggestion() {
    const container = document.querySelector('.container');
    const suggestDiv = document.createElement('div');
    suggestDiv.className = 'password-suggestion';
    suggestDiv.innerHTML = `
        <h3>💡 Need a strong password?</h3>
        <button onclick="useGeneratedPassword()" class="generate-btn">Generate Strong Password</button>
        <div id="suggestedPassword" style="display: none;"></div>
    `;
    
    // Add CSS for the suggestion box
    const style = document.createElement('style');
    style.textContent = `
        .password-suggestion {
            margin: 20px 0;
            padding: 20px;
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 12px;
            text-align: center;
        }
        
        .generate-btn {
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s ease;
        }
        
        .generate-btn:hover {
            background: #0056b3;
        }
        
        .suggested-password {
            margin-top: 15px;
            padding: 10px;
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            font-family: monospace;
            font-size: 16px;
            word-break: break-all;
        }
    `;
    
    document.head.appendChild(style);
    container.appendChild(suggestDiv);
}

// Use generated password
function useGeneratedPassword() {
    const password = generatePasswordSuggestion();
    const passwordInput = document.getElementById('password');
    const suggestedDiv = document.getElementById('suggestedPassword');
    
    passwordInput.value = password;
    suggestedDiv.innerHTML = `
        <div class="suggested-password">
            <strong>Generated Password:</strong><br>
            ${password}
            <br><br>
            <small>💡 This password has been automatically filled in the field above!</small>
        </div>
    `;
    suggestedDiv.style.display = 'block';
    
    // Trigger password strength check
    passwordInput.dispatchEvent(new Event('input'));
}

// Enhanced input event listener with debouncing
let debounceTimer;
function handlePasswordInput() {
    const passwordInput = document.getElementById('password');
    const password = passwordInput.value;
    
    // Clear previous timer
    clearTimeout(debounceTimer);
    
    // Set new timer
    debounceTimer = setTimeout(() => {
        if (password.length === 0) {
            // Reset everything when password is empty
            document.getElementById('strengthBar').style.width = '0%';
            document.getElementById('strengthText').textContent = 'Password strength will appear here';
            document.getElementById('strengthText').style.color = '#666';
            document.getElementById('strengthText').style.backgroundColor = '#f8f9fa';
            
            // Reset all requirement indicators
            const requirements = ['length', 'uppercase', 'lowercase', 'number', 'special'];
            requirements.forEach(req => {
                document.getElementById(req).classList.remove('valid');
            });
            
            return;
        }
        
        // Check password strength
        const result = checkPasswordStrength(password);
        updateStrengthMeter(result.strength);
        
        // Store in history for analytics
        passwordStrengthHistory.push({
            timestamp: new Date().toISOString(),
            strength: result.strength,
            length: password.length,
            criteria: result.criteria
        });
        
        // Keep only last 10 entries
        if (passwordStrengthHistory.length > 10) {
            passwordStrengthHistory.shift();
        }
        
        // Log to console for debugging (remove in production)
        console.log('Password Analysis:', {
            strength: result.strength,
            feedback: result.feedback,
            criteria: result.criteria
        });
        
    }, 300); // 300ms delay
}

// Error handling and edge cases
function handleErrors() {
    // Handle missing DOM elements
    const requiredElements = ['password', 'strengthBar', 'strengthText'];
    const missingElements = requiredElements.filter(id => !document.getElementById(id));
    
    if (missingElements.length > 0) {
        console.error('Missing required elements:', missingElements);
        alert('Some page elements are missing. Please refresh the page.');
        return false;
    }
    
    // Handle browser compatibility
    if (!('addEventListener' in window)) {
        alert('Your browser is not supported. Please use a modern browser like Chrome, Firefox, or Safari.');
        return false;
    }
    
    return true;
}

// Initialize the application
function initializeApp() {
    console.log('🔐 Password Strength Checker Initialized');
    
    // Check for errors first
    if (!handleErrors()) {
        return;
    }
    
    // Add event listeners
    const passwordInput = document.getElementById('password');
    passwordInput.addEventListener('input', handlePasswordInput);
    
    // Add password suggestion feature
    addPasswordSuggestion();
    
    // Add accessibility features
    passwordInput.setAttribute('autocomplete', 'new-password');
    passwordInput.setAttribute('aria-describedby', 'strengthText requirements');
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl+G to generate password
        if (e.ctrlKey && e.key === 'g') {
            e.preventDefault();
            useGeneratedPassword();
        }
        
        // Ctrl+H to toggle password visibility
        if (e.ctrlKey && e.key === 'h') {
            e.preventDefault();
            togglePassword();
        }
    });
    
    // Add helpful tooltips
    const tooltips = {
        'password': 'Press Ctrl+G to generate a strong password, Ctrl+H to toggle visibility',
        'strengthBar': 'Visual indicator of your password strength',
        'strengthText': 'Detailed strength assessment'
    };
    
    Object.keys(tooltips).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.setAttribute('title', tooltips[id]);
        }
    });
    
    console.log('✅ App initialization complete');
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        checkPasswordStrength,
        updateStrengthMeter,
        togglePassword,
        generatePasswordSuggestion
    };
}
