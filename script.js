// Global variables
let passwordStrengthHistory = [];
let currentStrength = 0;

// Password strength checker function
function checkPasswordStrength(password) {
    let strength = 0;
    let feedback = [];
    
    if (password.length >= 8) {
        strength += 1;
        document.getElementById('length').classList.add('valid');
    } else {
        document.getElementById('length').classList.remove('valid');
        feedback.push('Password too short');
    }
    
    if (/[A-Z]/.test(password)) {
        strength += 1;
        document.getElementById('uppercase').classList.add('valid');
    } else {
        document.getElementById('uppercase').classList.remove('valid');
        feedback.push('Add uppercase letters');
    }
    
    if (/[a-z]/.test(password)) {
        strength += 1;
        document.getElementById('lowercase').classList.add('valid');
    } else {
        document.getElementById('lowercase').classList.remove('valid');
        feedback.push('Add lowercase letters');
    }
    
    if (/[0-9]/.test(password)) {
        strength += 1;
        document.getElementById('number').classList.add('valid');
    } else {
        document.getElementById('number').classList.remove('valid');
        feedback.push('Add numbers');
    }
    
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        strength += 1;
        document.getElementById('special').classList.add('valid');
    } else {
        document.getElementById('special').classList.remove('valid');
        feedback.push('Add special characters');
    }
    
    let bonusPoints = 0;
    if (password.length >= 12) bonusPoints += 0.5;
    if (password.length >= 16) bonusPoints += 0.5;
    
    if (password.length >= 8 && strength >= 4) {
        const uniqueChars = new Set(password.toLowerCase()).size;
        if (uniqueChars >= 8) bonusPoints += 0.5;
    }
    
    if (/123456|password|qwerty|admin|letmein/i.test(password)) {
        bonusPoints -= 1;
        feedback.push('Avoid common patterns');
    }
    
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

function updateStrengthMeter(strength) {
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    
    const percentage = (strength / 5) * 100;
    strengthBar.style.width = percentage + '%';
    
    strengthBar.classList.remove('very-weak', 'weak', 'fair', 'good', 'strong');
    
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
    
    currentStrength = strength;
}

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

function generatePasswordSuggestion() {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let password = '';
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    const allChars = lowercase + uppercase + numbers + symbols;
    for (let i = password.length; i < 12; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    return password.split('').sort(() => Math.random() - 0.5).join('');
}

function addPasswordSuggestion() {
    const container = document.querySelector('.container');
    const suggestDiv = document.createElement('div');
    suggestDiv.className = 'password-suggestion';
    suggestDiv.innerHTML = `
        <h3>💡 Need a strong password?</h3>
        <button onclick="useGeneratedPassword()" class="generate-btn">Generate Strong Password</button>
        <div id="suggestedPassword" style="display: none;"></div>
    `;
    
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
    
    passwordInput.dispatchEvent(new Event('input'));
}

let debounceTimer;
function handlePasswordInput() {
    const passwordInput = document.getElementById('password');
    const password = passwordInput.value;
    
    clearTimeout(debounceTimer);
    
    debounceTimer = setTimeout(() => {
        if (password.length === 0) {
            document.getElementById('strengthBar').style.width = '0%';
            document.getElementById('strengthText').textContent = 'Password strength will appear here';
            document.getElementById('strengthText').style.color = '#666';
            document.getElementById('strengthText').style.backgroundColor = '#f8f9fa';
            
            const requirements = ['length', 'uppercase', 'lowercase', 'number', 'special'];
            requirements.forEach(req => {
                document.getElementById(req).classList.remove('valid');
            });
            
            return;
        }
        
        const result = checkPasswordStrength(password);
        updateStrengthMeter(result.strength);
        
        // Log to Firebase
        if (typeof firebase !== 'undefined' && firebase.analytics) {
            logPasswordAttempt(result.strength, result.criteria);
            document.getElementById('firebaseStatus').style.display = 'block';
        }
        
        passwordStrengthHistory.push({
            timestamp: new Date().toISOString(),
            strength: result.strength,
            length: password.length,
            criteria: result.criteria
        });
        
        if (passwordStrengthHistory.length > 10) {
            passwordStrengthHistory.shift();
        }
        
        console.log('Password Analysis:', {
            strength: result.strength,
            feedback: result.feedback,
            criteria: result.criteria
        });
        
    }, 300);
}

function handleErrors() {
    const requiredElements = ['password', 'strengthBar', 'strengthText'];
    const missingElements = requiredElements.filter(id => !document.getElementById(id));
    
    if (missingElements.length > 0) {
        console.error('Missing required elements:', missingElements);
        alert('Some page elements are missing. Please refresh the page.');
        return false;
    }
    
    if (!('addEventListener' in window)) {
        alert('Your browser is not supported. Please use a modern browser like Chrome, Firefox, or Safari.');
        return false;
    }
    
    return true;
}

function initializeApp() {
    console.log('🔐 Password Strength Checker Initialized');
    
    if (!handleErrors()) {
        return;
    }
    
    const passwordInput = document.getElementById('password');
    passwordInput.addEventListener('input', handlePasswordInput);
    
    addPasswordSuggestion();
    
    passwordInput.setAttribute('autocomplete', 'new-password');
    passwordInput.setAttribute('aria-describedby', 'strengthText requirements');
    
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'g') {
            e.preventDefault();
            useGeneratedPassword();
        }
        
        if (e.ctrlKey && e.key === 'h') {
            e.preventDefault();
            togglePassword();
        }
    });
    
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

document.addEventListener('DOMContentLoaded', initializeApp);

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        checkPasswordStrength,
        updateStrengthMeter,
        togglePassword,
        generatePasswordSuggestion
    };
}
