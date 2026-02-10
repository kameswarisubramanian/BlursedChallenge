import PasswordInput from './components/passwordInput.js';
import validatePassword from './components/validator.js';

document.addEventListener('DOMContentLoaded', () => {
    const inputElement = document.getElementById('password-input');
    const passwordInput = new PasswordInput(inputElement);
    const feedback = document.getElementById('feedback');
    const strengthMeter = document.getElementById('strength-meter');
    const rulesContainer = document.getElementById('rules');
    const submitButton = document.getElementById('submit-button');

    let submitAttempts = 0;

    passwordInput.onInputChange((password) => {
        const validationResult = validatePassword(password);
        
        // Update feedback
        feedback.textContent = validationResult.message;
        feedback.className = validationResult.isValid ? 'feedback-good' : 'feedback-bad';
        
        // Update strength meter (contradictory)
        strengthMeter.style.width = validationResult.strength + '%';
        strengthMeter.className = 'strength-bar ' + validationResult.strengthClass;
        strengthMeter.textContent = validationResult.strengthText;
        
        // Show rules (reveal one by one with delay)
        rulesContainer.innerHTML = '';
        validationResult.rules.forEach((rule, index) => {
            setTimeout(() => {
                const ruleDiv = document.createElement('div');
                ruleDiv.className = rule.passed ? 'rule-pass' : 'rule-fail';
                ruleDiv.textContent = (rule.passed ? '✓' : '✗') + ' ' + rule.msg;
                rulesContainer.appendChild(ruleDiv);
            }, index * 300);
        });
    });

    // Evil submit button
    submitButton.addEventListener('click', () => {
        const validationResult = validatePassword(inputElement.value);
        submitAttempts++;

        if (validationResult.isValid) {
            if (submitAttempts < 3) {
                feedback.textContent = "Just kidding! Try again.";
                feedback.className = 'feedback-bad';
                inputElement.value = '';
            } else {
                // Actually accept the password
                const password = inputElement.value;
                feedback.innerHTML = `
                    <h2>🎉 Congratulations! 🎉</h2>
                    <p>You have successfully created your password!</p>
                    <p><strong>Your password is:</strong></p>
                    <p style="font-family: monospace; font-size: 1.2em; background: #f0f0f0; padding: 10px; border-radius: 5px;">${password}</p>
                    <p style="font-size: 0.9em; color: #666;">Please write it down immediately and then forget where you put it.</p>
                `;
                feedback.className = 'feedback-success';
                submitButton.disabled = true;
                inputElement.disabled = true;
                rulesContainer.innerHTML = '';
                strengthMeter.style.width = '0%';
            }
        } else {
            feedback.textContent = `Nice try. Attempt ${submitAttempts}. Keep going!`;
            feedback.className = 'feedback-bad';
        }
    });

    // Button runs away on hover (sometimes)
    submitButton.addEventListener('mouseenter', () => {
        if (Math.random() > 0.7) {
            const x = Math.random() * (window.innerWidth - 200);
            const y = Math.random() * (window.innerHeight - 100);
            submitButton.style.position = 'fixed';
            submitButton.style.left = x + 'px';
            submitButton.style.top = y + 'px';
            
            setTimeout(() => {
                submitButton.style.position = 'static';
            }, 2000);
        }
    });
});