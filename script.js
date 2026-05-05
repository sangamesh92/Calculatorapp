class ProfessionalCalculator {
    constructor() {
        this.display = document.getElementById('display');
        this.inputDisplay = document.getElementById('input');
        this.currentValue = '0';
        this.previousValue = null;
        this.operation = null;
        this.shouldResetDisplay = false;
        this.memory = 0;
        this.init();
    }

    init() {
        this.attachEventListeners();
        this.updateDisplay();
    }

    attachEventListeners() {
        // Number buttons
        document.querySelectorAll('.number-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const text = e.target.textContent;
                if (text === '+/−') {
                    this.toggleSign();
                } else if (text === '.') {
                    this.addDecimal();
                } else {
                    this.appendNumber(text);
                }
            });
        });

        // Function buttons
        document.querySelectorAll('.func-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const text = e.target.textContent;
                this.handleFunction(text);
            });
        });

        // Operator buttons
        document.querySelectorAll('.operator-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const op = e.target.textContent;
                this.setOperation(op);
            });
        });

        // Delete button
        document.querySelector('.delete-btn').addEventListener('click', () => this.delete());

        // Equals button
        document.querySelector('.equals-btn').addEventListener('click', () => this.calculate());

        // Memory buttons
        document.getElementById('mc').addEventListener('click', () => this.memoryClear());
        document.getElementById('mr').addEventListener('click', () => this.memoryRecall());
        document.getElementById('m-plus').addEventListener('click', () => this.memoryAdd());
        document.getElementById('m-minus').addEventListener('click', () => this.memorySubtract());
        document.getElementById('ms').addEventListener('click', () => this.memoryStore());
        document.getElementById('m-menu').addEventListener('click', () => this.memoryMenu());

        // Keyboard support
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    handleFunction(func) {
        const current = parseFloat(this.currentValue);

        switch (func) {
            case '%':
                if (this.previousValue !== null && this.operation) {
                    const prev = parseFloat(this.previousValue);
                    const result = (prev * current) / 100;
                    this.currentValue = result.toString();
                } else {
                    this.currentValue = (current / 100).toString();
                }
                this.shouldResetDisplay = true;
                break;

            case '1/x':
                if (current !== 0) {
                    this.currentValue = (1 / current).toString();
                    this.shouldResetDisplay = true;
                } else {
                    this.currentValue = 'Cannot divide by 0';
                }
                break;

            case 'x²':
                this.currentValue = (current * current).toString();
                this.shouldResetDisplay = true;
                break;

            case '√':
                if (current >= 0) {
                    this.currentValue = Math.sqrt(current).toString();
                    this.shouldResetDisplay = true;
                } else {
                    this.currentValue = 'Invalid input';
                }
                break;

            case 'CE':
                this.currentValue = '0';
                this.shouldResetDisplay = false;
                break;

            case 'C':
                this.clear();
                break;
        }

        this.updateDisplay();
    }

    handleKeyboard(e) {
        if (/^[0-9]$/.test(e.key)) {
            e.preventDefault();
            this.appendNumber(e.key);
        } else if (['+', '-', '*', '/'].includes(e.key)) {
            e.preventDefault();
            const ops = { '+': '+', '-': '−', '*': '×', '/': '÷' };
            this.setOperation(ops[e.key]);
        } else if (e.key === 'Enter' || e.key === '=') {
            e.preventDefault();
            this.calculate();
        } else if (e.key === 'Backspace') {
            e.preventDefault();
            this.delete();
        } else if (e.key === '.') {
            e.preventDefault();
            this.addDecimal();
        } else if (e.key.toLowerCase() === 'c') {
            e.preventDefault();
            this.clear();
        } else if (e.key === '%') {
            e.preventDefault();
            this.handleFunction('%');
        }
    }

    appendNumber(num) {
        if (this.shouldResetDisplay) {
            this.currentValue = num;
            this.shouldResetDisplay = false;
        } else {
            if (this.currentValue === '0') {
                this.currentValue = num;
            } else if (this.currentValue.length < 16) {
                this.currentValue += num;
            }
        }
        this.updateDisplay();
    }

    addDecimal() {
        if (this.shouldResetDisplay) {
            this.currentValue = '0.';
            this.shouldResetDisplay = false;
        } else if (!this.currentValue.includes('.')) {
            this.currentValue += '.';
        }
        this.updateDisplay();
    }

    toggleSign() {
        const current = parseFloat(this.currentValue);
        this.currentValue = (-current).toString();
        this.updateDisplay();
    }

    setOperation(op) {
        if (this.operation !== null && !this.shouldResetDisplay) {
            this.calculate();
        }

        this.previousValue = parseFloat(this.currentValue);
        this.operation = op;
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    calculate() {
        if (this.operation === null || this.shouldResetDisplay) {
            return;
        }

        const current = parseFloat(this.currentValue);
        const previous = this.previousValue;
        let result = 0;

        switch (this.operation) {
            case '+':
                result = previous + current;
                break;
            case '−':
                result = previous - current;
                break;
            case '×':
                result = previous * current;
                break;
            case '÷':
                if (current === 0) {
                    this.currentValue = 'Cannot divide by 0';
                    this.operation = null;
                    this.previousValue = null;
                    this.shouldResetDisplay = true;
                    this.updateDisplay();
                    return;
                }
                result = previous / current;
                break;
            default:
                return;
        }

        this.currentValue = parseFloat(result.toFixed(12)).toString();
        this.operation = null;
        this.previousValue = null;
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    delete() {
        if (this.currentValue.length > 1) {
            this.currentValue = this.currentValue.slice(0, -1);
        } else {
            this.currentValue = '0';
        }
        this.shouldResetDisplay = false;
        this.updateDisplay();
    }

    clear() {
        this.currentValue = '0';
        this.previousValue = null;
        this.operation = null;
        this.shouldResetDisplay = false;
        this.inputDisplay.value = '';
        this.updateDisplay();
    }

    memoryClear() {
        this.memory = 0;
    }

    memoryRecall() {
        this.currentValue = this.memory.toString();
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    memoryAdd() {
        this.memory += parseFloat(this.currentValue);
        this.shouldResetDisplay = true;
    }

    memorySubtract() {
        this.memory -= parseFloat(this.currentValue);
        this.shouldResetDisplay = true;
    }

    memoryStore() {
        this.memory = parseFloat(this.currentValue);
        this.shouldResetDisplay = true;
    }

    memoryMenu() {
        // Optional: Could show a menu with memory values
        alert(`Memory: ${this.memory}`);
    }

    updateDisplay() {
        // Update main display
        let displayValue = this.currentValue;
        if (!isNaN(displayValue) && displayValue !== 'Cannot divide by 0' && displayValue !== 'Invalid input') {
            const num = parseFloat(displayValue);
            if (num > 999999) {
                displayValue = num.toExponential(6);
            } else if (displayValue.includes('.') && displayValue.split('.')[1].length > 10) {
                displayValue = parseFloat(displayValue).toPrecision(12);
            }
        }
        this.display.value = displayValue;

        // Update input display to show operation
        if (this.operation) {
            this.inputDisplay.value = `${this.previousValue} ${this.operation}`;
        } else if (this.previousValue !== null) {
            this.inputDisplay.value = this.previousValue;
        } else {
            this.inputDisplay.value = '';
        }
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProfessionalCalculator();
});
