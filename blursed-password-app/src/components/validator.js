const evilRules = [
    { check: (p) => p.length >= 8, msg: "Must be at least 8 characters" },
    { check: (p) => p.length <= 12, msg: "Must be at most 12 characters" },
    { check: (p) => /[A-Z]/.test(p), msg: "Must contain uppercase" },
    { check: (p) => /[a-z]/.test(p), msg: "Must contain lowercase" },
    { check: (p) => /\d/.test(p), msg: "Must contain a number" },
    { check: (p) => /[!@#$%^&*]/.test(p), msg: "Must contain special character" },
    { check: (p) => !/(.)\1{2,}/.test(p), msg: "No repeating characters (3+ times)" },
    { check: (p) => {
        const sum = p.split('').filter(c => /\d/.test(c)).reduce((a, b) => a + parseInt(b), 0);
        return sum > 0 && sum % 7 === 0;
    }, msg: "Sum of all digits must be divisible by 7" },
    { check: (p) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = days[new Date().getDay()];
        return p.toLowerCase().includes(today.toLowerCase());
    }, msg: `Must contain today's day: ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()]}` },
    { check: (p) => p.length > 0 && p.charCodeAt(0) % 2 === 0, msg: "First character must have an even ASCII value" },
];

// Initialize with first 5 rules
let activeRules = evilRules.slice(0, 5);
let lastPasswordLength = 0;

export default function validatePassword(password) {
    // Change rules every 5 characters typed (but only when length increases)
    if (password.length > lastPasswordLength && password.length % 5 === 0 && password.length > 0) {
        // Shuffle and pick 4-6 random rules
        const shuffled = [...evilRules].sort(() => Math.random() - 0.5);
        activeRules = shuffled.slice(0, Math.floor(Math.random() * 3) + 4);
    }
    lastPasswordLength = password.length;

    const failed = activeRules.filter(rule => !rule.check(password));
    const passed = activeRules.length - failed.length;
    
    // Contradictory strength calculation
    let strength = (passed / activeRules.length) * 100;
    
    // Randomly invert strength meter (less often)
    if (Math.random() > 0.85) {
        strength = 100 - strength;
    }

    let strengthClass = 'weak';
    let strengthText = 'Pathetic';
    
    if (strength > 70) {
        strengthClass = 'strong';
        strengthText = Math.random() > 0.5 ? 'Almost there!' : 'Terrible!';
    } else if (strength > 40) {
        strengthClass = 'medium';
        strengthText = 'Could be worse';
    }

    const isValid = failed.length === 0;

    return {
        isValid: isValid,
        strength: strength,
        strengthClass: strengthClass,
        strengthText: strengthText,
        rules: activeRules.map(r => ({
            msg: r.msg,
            passed: r.check(password)
        })),
        message: isValid
            ? "Perfect! Now click submit..." 
            : `${failed.length} rule(s) violated. Keep typing!`
    };
}