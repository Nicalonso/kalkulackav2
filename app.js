const display = document.getElementById('display');
const previousExpressionDisplay = document.getElementById('previousExpression');
const themeToggle = document.getElementById('themeToggle');
const termsModal = document.getElementById('termsModal');
const termsButton = document.getElementById('termsButton');
const openTerms = document.getElementById('openPrivacy');
const closeTerms = document.getElementById('closeTerms');
const modalClose = document.getElementById('modalReject');
const modalAccept = document.getElementById('modalAccept');
const cookieBanner = document.getElementById('cookieBanner');
const cookieModal = document.getElementById('cookieModal');
const acceptCookies = document.getElementById('acceptNecessary');
const acceptAllCookies = document.getElementById('acceptAllCookies');
const rejectCookies = document.getElementById('settingsCookies');
const factText = document.getElementById('factText');
const factButton = document.getElementById('factButton');
const historyList = document.getElementById('historyList');
const historyCount = document.getElementById('historyCount');
const calculationMetric = document.getElementById('calculationMetric');
const memoryAdd = document.getElementById('memoryAdd');
const memorySub = document.getElementById('memorySub');
const memoryRecall = document.getElementById('memoryRecall');
const memoryClear = document.getElementById('memoryClear');
const closeCookieSettings = document.getElementById('closeCookieSettings');
const cookieCancel = document.getElementById('cookieCancel');
const saveCookies = document.getElementById('saveCookies');
const necessaryCookies = document.getElementById('necessaryCookies');
const preferenceCookies = document.getElementById('preferenceCookies');
const analyticsCookies = document.getElementById('analyticsCookies');
const marketingCookies = document.getElementById('marketingCookies');

let currentInput = '0';
let previousInput = '';
let operator = null;
let shouldResetDisplay = false;
let memory = 0;
let history = [];
let calculationCount = 0;

const facts = [
    'Číslo π je iracionální a používá se v geometrii.',
    'Nula je jediné číslo, které není kladné ani záporné.',
    'Matematika v základních aplikacích používá logiku a rovnice.',
    'Výpočet je založen na přesných číselných operacích.',
    'Kalkulačka pracuje s lokálním jednoduchým souborem dat.'
];

function updateDisplay() {
    display.innerText = currentInput.replace('.', ',');
    if (operator !== null) {
        let symbol = operator;
        if (operator === '*') symbol = '×';
        if (operator === '/') symbol = '÷';
        if (operator === '-') symbol = '−';
        previousExpressionDisplay.innerText = `${previousInput.replace('.', ',')} ${symbol}`;
    } else {
        previousExpressionDisplay.innerText = '';
    }
}

function appendNumber(number) {
    if (currentInput === '0' || shouldResetDisplay) {
        currentInput = number;
        shouldResetDisplay = false;
    } else {
        if (currentInput.length < 12) {
            currentInput += number;
        }
    }
    updateDisplay();
}

function appendDecimal() {
    if (shouldResetDisplay) {
        currentInput = '0.';
        shouldResetDisplay = false;
    } else if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    updateDisplay();
}

function appendOperator(op) {
    if (operator !== null && !shouldResetDisplay) {
        calculate(false);
    }
    previousInput = currentInput;
    operator = op;
    shouldResetDisplay = true;
    updateDisplay();
}

function calculate(shouldSave = true) {
    if (operator === null || shouldResetDisplay) return;

    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) return;

    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                currentInput = 'Chyba';
                operator = null;
                previousInput = '';
                shouldResetDisplay = true;
                updateDisplay();
                return;
            }
            result = prev / current;
            break;
        case '%':
            result = (prev * current) / 100;
            break;
        default:
            return;
    }

    result = Math.round(result * 100000000) / 100000000;
    currentInput = result.toString();

    if (shouldSave) {
        history.unshift(`${previousInput} ${getSymbol(operator)} ${currentInput}`);
        history = history.slice(0, 5);
        calculationCount += 1;
        renderHistory();
    }

    operator = null;
    previousInput = '';
    shouldResetDisplay = true;
    updateDisplay();
}

function getSymbol(op) {
    if (op === '*') return '×';
    if (op === '/') return '÷';
    if (op === '-') return '−';
    return op;
}

function clearAll() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    shouldResetDisplay = false;
    updateDisplay();
}

function deleteLast() {
    if (shouldResetDisplay) return;
    if (currentInput.length === 1 || (currentInput.length === 2 && currentInput.startsWith('-'))) {
        currentInput = '0';
    } else {
        currentInput = currentInput.slice(0, -1);
    }
    updateDisplay();
}

function renderHistory() {
    historyCount.innerText = history.length;
    calculationMetric.innerText = calculationCount;
    if (history.length === 0) {
        historyList.innerHTML = '<span class="empty-history">Zatím bez výpočtů</span>';
        return;
    }

    historyList.innerHTML = '';
    for (const item of history) {
        const entry = document.createElement('span');
        entry.className = 'history-item';
        entry.innerText = item;
        historyList.appendChild(entry);
    }
}

function switchTheme() {
    document.body.classList.toggle('dark');
}

function openTermsModal() {
    termsModal.classList.add('visible');
}

function closeTermsModal() {
    termsModal.classList.remove('visible');
}

function openCookieSettings() {
    cookieModal.classList.add('visible');
}

function closeCookieSettingsModal() {
    cookieModal.classList.remove('visible');
}

function checkCookies() {
    const consent = localStorage.getItem('smartcalc-consent');
    if (!consent) {
        cookieBanner.classList.add('visible');
    } else {
        applyConsent(consent);
    }
}

function applyConsent(consent) {
    const parsed = JSON.parse(consent);
    if (parsed.preferences) preferenceCookies.checked = true;
    if (parsed.analytics) analyticsCookies.checked = true;
    if (parsed.marketing) marketingCookies.checked = true;
}

function acceptNecessary() {
    const consent = {
        necessary: true,
        preferences: false,
        analytics: false,
        marketing: false
    };
    localStorage.setItem('smartcalc-consent', JSON.stringify(consent));
    cookieBanner.classList.remove('visible');
}

function acceptAllCookies() {
    const consent = {
        necessary: true,
        preferences: true,
        analytics: true,
        marketing: true
    };
    localStorage.setItem('smartcalc-consent', JSON.stringify(consent));
    applyConsent(JSON.stringify(consent));
    cookieBanner.classList.remove('visible');
}

function saveCookieSettings() {
    const consent = {
        necessary: true,
        preferences: preferenceCookies.checked,
        analytics: analyticsCookies.checked,
        marketing: marketingCookies.checked
    };
    localStorage.setItem('smartcalc-consent', JSON.stringify(consent));
    cookieBanner.classList.remove('visible');
    cookieModal.classList.remove('visible');
}

window.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
        appendNumber(e.key);
    } else if (e.key === '.' || e.key === ',') {
        appendDecimal();
    } else if (e.key === '+') {
        appendOperator('+');
    } else if (e.key === '-') {
        appendOperator('-');
    } else if (e.key === '*') {
        appendOperator('*');
    } else if (e.key === '/') {
        e.preventDefault();
        appendOperator('/');
    } else if (e.key === '%') {
        appendOperator('%');
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculate();
    } else if (e.key === 'Backspace') {
        deleteLast();
    } else if (e.key === 'Escape') {
        clearAll();
    }
});

themeToggle.addEventListener('click', switchTheme);
termsButton.addEventListener('click', openTermsModal);
openTerms.addEventListener('click', openCookieSettings);
closeTerms.addEventListener('click', closeTermsModal);
modalClose.addEventListener('click', closeTermsModal);
modalAccept.addEventListener('click', closeTermsModal);
acceptCookies.addEventListener('click', acceptNecessary);
acceptAllCookies.addEventListener('click', acceptAllCookies);
rejectCookies.addEventListener('click', openCookieSettings);

factButton.addEventListener('click', () => {
    const randomIndex = Math.floor(Math.random() * facts.length);
    factText.innerText = facts[randomIndex];
});

memoryAdd.addEventListener('click', () => {
    memory += parseFloat(currentInput) || 0;
    currentInput = memory.toString();
    updateDisplay();
});

memorySub.addEventListener('click', () => {
    memory -= parseFloat(currentInput) || 0;
    currentInput = memory.toString();
    updateDisplay();
});

memoryRecall.addEventListener('click', () => {
    currentInput = memory.toString();
    shouldResetDisplay = true;
    updateDisplay();
});

memoryClear.addEventListener('click', () => {
    memory = 0;
    currentInput = '0';
    shouldResetDisplay = false;
    updateDisplay();
});

closeCookieSettings.addEventListener('click', closeCookieSettingsModal);
cookieCancel.addEventListener('click', closeCookieSettingsModal);
saveCookies.addEventListener('click', saveCookieSettings);

const clockDate = document.getElementById('clockDate');
function updateClock() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    clockDate.innerText = `${day}.${month}.${year}`;
}

checkCookies();
updateClock();
renderHistory();
