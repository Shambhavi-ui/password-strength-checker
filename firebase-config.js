// Firebase configuration
const firebaseConfig = {
   
   apiKey: "AIzaSyBdwVlwNFda9ATUdAVLENTH0YbSD_XXVTY",
  authDomain: "password-checker-web.firebaseapp.com",
  projectId: "password-checker-web",
  storageBucket: "password-checker-web.firebasestorage.app",
  messagingSenderId: "820112692268",
  appId: "1:820112692268:web:1497c9ecb9ea7b04cdad89"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics();

// Function to log password strength attempt
function logPasswordAttempt(strength, criteria) {
    analytics.logEvent('password_check', {
        strength_level: strength,
        has_length: criteria.length,
        has_uppercase: criteria.uppercase,
        has_lowercase: criteria.lowercase,
        has_numbers: criteria.numbers,
        has_special: criteria.special,
        timestamp: new Date().toISOString()
    });
    console.log('Password attempt logged to Firebase');
}