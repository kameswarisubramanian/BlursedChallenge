export default class PasswordInput {
    constructor(inputElement) {
        this.input = inputElement;
        this.listeners = [];
        this.chaosMode = false;
        this.password = '';
        this.rules = [
            'Must be at least 12 characters long',
            'Must contain at least one uppercase letter',
            'Must contain at least one lowercase letter',
            'Must contain at least one number',
            'Must contain at least one special character',
            'Cannot contain the word "password"',
            'Must not be similar to your username',
            'Must change every 30 seconds'
        ];
        this.currentRuleIndex = 0;
        this.strengthMeter = document.createElement('div');
        this.strengthMeter.className = 'strength-meter';
        this.input.parentElement.appendChild(this.strengthMeter);

        this.input.addEventListener('input', () => {
            this.password = this.input.value;
            this.updateStrength();
            this.displayRules();
            this.triggerListeners();
            this.maybeActivateChaos();
        });

        // Random character deletion every 8 seconds
        setInterval(() => {
            if (this.input.value.length > 3 && Math.random() > 0.6) {
                const pos = Math.floor(Math.random() * this.input.value.length);
                this.input.value = this.input.value.slice(0, pos) + this.input.value.slice(pos + 1);
                this.triggerListeners();
            }
        }, 8000);

        // Random CAPS LOCK toggle
        this.input.addEventListener('keypress', (e) => {
            if (Math.random() > 0.9) {
                const char = e.key;
                if (char.match(/[a-z]/i)) {
                    e.preventDefault();
                    const flipped = char === char.toUpperCase() 
                        ? char.toLowerCase() 
                        : char.toUpperCase();
                    this.input.value += flipped;
                    this.triggerListeners();
                }
            }
        });
    }

    maybeActivateChaos() {
        if (this.input.value.length > 10 && !this.chaosMode && Math.random() > 0.8) {
            this.chaosMode = true;
            this.input.placeholder = "CHAOS MODE ACTIVATED";
            
            // Scramble password after 2 seconds
            setTimeout(() => {
                const chars = this.input.value.split('');
                for (let i = chars.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [chars[i], chars[j]] = [chars[j], chars[i]];
                }
                this.input.value = chars.join('');
                this.triggerListeners();
                this.chaosMode = false;
            }, 2000);
        }
    }

    onInputChange(callback) {
        this.listeners.push(callback);
    }

    triggerListeners() {
        this.listeners.forEach(cb => cb(this.input.value));
    }

    updateStrength() {
        let strength = this.calculateStrength();
        this.strengthMeter.textContent = `Strength: ${strength}`;
        this.strengthMeter.style.color = this.getStrengthColor(strength);
    }

    calculateStrength() {
        let strength = 0;
        if (this.password.length >= 12) strength++;
        if (/[A-Z]/.test(this.password)) strength++;
        if (/[a-z]/.test(this.password)) strength++;
        if (/\d/.test(this.password)) strength++;
        if (/[\W_]/.test(this.password)) strength++;
        if (!this.password.includes('password')) strength++;
        return strength;
    }

    getStrengthColor(strength) {
        switch (strength) {
            case 0:
            case 1:
                return 'red';
            case 2:
                return 'orange';
            case 3:
                return 'yellow';
            case 4:
                return 'lightgreen';
            case 5:
                return 'green';
            default:
                return 'black';
        }
    }

    displayRules() {
        if (this.currentRuleIndex < this.rules.length) {
            alert(this.rules[this.currentRuleIndex]);
            this.currentRuleIndex++;
        } else {
            this.currentRuleIndex = 0; // Reset rules after displaying all
        }
    }
}