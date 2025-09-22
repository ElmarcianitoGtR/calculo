
let degree = 2; // Grado inicial del polinomio
        
// Elementos DOM
const coefficientsContainer = document.getElementById('coefficients');
const addTermBtn = document.getElementById('add-term');
const removeTermBtn = document.getElementById('remove-term');
const evaluateBtn = document.getElementById('evaluate-btn');
const clearBtn = document.getElementById('clear-btn');
const resultsContainer = document.getElementById('results');
const resultsContent = document.getElementById('results-content');

// Inicializar la interfaz
initializeCoefficientInputs();

// Configurar event listeners
//addTermBtn.addEventListener('click', addTerm);
//removeTermBtn.addEventListener('click', removeTerm);
evaluateBtn.addEventListener('click', evaluatePolynomial);
clearBtn.addEventListener('click', clearInputs);

// Función para inicializar los inputs de coeficientes
function initializeCoefficientInputs() {
    coefficientsContainer.innerHTML = '';
    for (let i = degree; i >= 0; i--) {
        addCoefficientInput(i);
    }
}

// Función para añadir un input de coeficiente
function addCoefficientInput(exponent) {
    const coeffDiv = document.createElement('div');
    coeffDiv.className = 'coefficient';
    
    const label = document.createElement('label');
    label.textContent = `x${exponent > 0 ? `<sup>${exponent}</sup>` : ''}:`;
    label.innerHTML = `x${exponent > 0 ? `<sup>${exponent}</sup>` : ''}:`;
    
    const input = document.createElement('input');
    input.type = 'number';
    input.id = `coeff-${exponent}`;
    input.placeholder = '0';
    input.value = exponent === degree ? '1' : '0';
    
    coeffDiv.appendChild(label);
    coeffDiv.appendChild(input);
    coefficientsContainer.appendChild(coeffDiv);
}

// Función para añadir un término (aumentar grado)
function addTerm() {
    degree++;
    addCoefficientInput(degree);
}

// Función para eliminar un término (reducir grado)
function removeTerm() {
    if (degree > 0) {
        const lastCoeff = document.getElementById(`coeff-${degree}`);
        lastCoeff.parentElement.remove();
        degree--;
    }
}

// Función para evaluar el polinomio
function evaluatePolynomial() {
    // Obtener coeficientes
    const coefficients = [];
    for (let i = degree; i >= 0; i--) {
        const coeffInput = document.getElementById(`coeff-${i}`);
        const value = parseFloat(coeffInput.value) || 0;
        coefficients.push(value);
    }
    
    // Validar que no todos los coeficientes sean cero
    if (coefficients.every(c => c === 0)) {
        alert('Por favor, ingresa al menos un coeficiente diferente de cero.');
        return;
    }
    
    // Eliminar coeficientes líderes cero
    while (coefficients.length > 1 && coefficients[0] === 0) {
        coefficients.shift();
        degree--;
    }
    
    // Realizar análisis
    const positiveRoots = analyzePositiveRoots(coefficients);
    const negativeRoots = analyzeNegativeRoots(coefficients);
    
    // Mostrar resultados
    displayResults(coefficients, positiveRoots, negativeRoots);
}

// Función para analizar raíces positivas
function analyzePositiveRoots(coefficients) {
    // Contar cambios de signo
    let changes = 0;
    let prevSign = Math.sign(coefficients[0]);
    const signSequence = [prevSign];
    
    for (let i = 1; i < coefficients.length; i++) {
        const currentSign = Math.sign(coefficients[i]);
        signSequence.push(currentSign);
        
        if (currentSign !== 0 && prevSign !== 0 && currentSign !== prevSign) {
            changes++;
        }
        
        if (currentSign !== 0) {
            prevSign = currentSign;
        }
    }
    
    // Generar posibles números de raíces (restar números pares)
    const possibleRoots = [];
    for (let i = changes; i >= 0; i -= 2) {
        possibleRoots.push(i);
    }
    
    return {
        changes: changes,
        signSequence: signSequence,
        possibleRoots: possibleRoots
    };
}

// Función para analizar raíces negativas
function analyzeNegativeRoots(coefficients) {
    // Crear coeficientes para P(-x)
    const altCoefficients = [];
    for (let i = 0; i < coefficients.length; i++) {
        if (i % 2 === 0) {
            altCoefficients.push(coefficients[i]);
        } else {
            altCoefficients.push(-coefficients[i]);
        }
    }
    
    // Contar cambios de signo en P(-x)
    let changes = 0;
    let prevSign = Math.sign(altCoefficients[0]);
    const signSequence = [prevSign];
    
    for (let i = 1; i < altCoefficients.length; i++) {
        const currentSign = Math.sign(altCoefficients[i]);
        signSequence.push(currentSign);
        
        if (currentSign !== 0 && prevSign !== 0 && currentSign !== prevSign) {
            changes++;
        }
        
        if (currentSign !== 0) {
            prevSign = currentSign;
        }
    }
    
    // Generar posibles números de raíces (restar números pares)
    const possibleRoots = [];
    for (let i = changes; i >= 0; i -= 2) {
        possibleRoots.push(i);
    }
    
    return {
        changes: changes,
        signSequence: signSequence,
        possibleRoots: possibleRoots
    };
}

// Función para mostrar resultados
function displayResults(coefficients, positiveRoots, negativeRoots) {
    resultsContent.innerHTML = '';
    
    // Mostrar el polinomio
    const polynomialDiv = document.createElement('div');
    polynomialDiv.className = 'result-item';
    polynomialDiv.innerHTML = `
        <div class="result-title">Polinomio analizado:</div>
        <div>P(x) = ${formatPolynomial(coefficients)}</div>
    `;
    resultsContent.appendChild(polynomialDiv);
    
    // Mostrar secuencia de signos para raíces positivas
    const positiveDiv = document.createElement('div');
    positiveDiv.className = 'result-item';
    positiveDiv.innerHTML = `
        <div class="result-title">Análisis de raíces positivas:</div>
        <div>Secuencia de signos:</div>
    `;
    
    const positiveSigns = document.createElement('div');
    positiveSigns.className = 'sign-sequence';
    positiveRoots.signSequence.forEach(sign => {
        const signDiv = document.createElement('div');
        signDiv.className = `sign ${sign > 0 ? 'positive' : sign < 0 ? 'negative' : 'zero'}`;
        signDiv.textContent = sign > 0 ? '+' : sign < 0 ? '-' : '0';
        positiveSigns.appendChild(signDiv);
    });
    
    positiveDiv.appendChild(positiveSigns);
    
    positiveDiv.innerHTML += `
        <div class="changes">Cambios de signo: ${positiveRoots.changes}</div>
        <div>Posible número de raíces positivas: ${formatPossibleRoots(positiveRoots.possibleRoots)}</div>
    `;
    
    resultsContent.appendChild(positiveDiv);
    
    // Mostrar secuencia de signos para raíces negativas
    const negativeDiv = document.createElement('div');
    negativeDiv.className = 'result-item';
    negativeDiv.innerHTML = `
        <div class="result-title">Análisis de raíces negativas (P(-x)):</div>
        <div>Secuencia de signos:</div>
    `;
    
    const negativeSigns = document.createElement('div');
    negativeSigns.className = 'sign-sequence';
    negativeRoots.signSequence.forEach(sign => {
        const signDiv = document.createElement('div');
        signDiv.className = `sign ${sign > 0 ? 'positive' : sign < 0 ? 'negative' : 'zero'}`;
        signDiv.textContent = sign > 0 ? '+' : sign < 0 ? '-' : '0';
        negativeSigns.appendChild(signDiv);
    });
    
    negativeDiv.appendChild(negativeSigns);
    
    negativeDiv.innerHTML += `
        <div class="changes">Cambios de signo: ${negativeRoots.changes}</div>
        <div>Posible número de raíces negativas: ${formatPossibleRoots(negativeRoots.possibleRoots)}</div>
    `;
    
    resultsContent.appendChild(negativeDiv);
    
    // Mostrar el contenedor de resultados
    resultsContainer.style.display = 'block';
}

// Función para formatear el polinomio
function formatPolynomial(coefficients) {
    let terms = [];
    let exponent = coefficients.length - 1;
    
    for (let i = 0; i < coefficients.length; i++, exponent--) {
        const coeff = coefficients[i];
        if (coeff === 0) continue;
        
        let term = '';
        if (i > 0) {
            term += coeff > 0 ? ' + ' : ' - ';
            term += Math.abs(coeff) !== 1 || exponent === 0 ? Math.abs(coeff) : '';
        } else {
            term += coeff;
            if (Math.abs(coeff) === 1 && exponent > 0) term = term.replace('1', '');
        }
        
        if (exponent > 1) {
            term += `x<sup>${exponent}</sup>`;
        } else if (exponent === 1) {
            term += 'x';
        }
        
        terms.push(term);
    }
    
    return terms.join('') || '0';
}

// Función para formatear los posibles números de raíces
function formatPossibleRoots(roots) {
    if (roots.length === 0) return '0';
    if (roots.length === 1) return roots[0].toString();
    
    return roots.join(', ') + ' (o menor en una cantidad par)';
}

// Función para limpiar los inputs
function clearInputs() {
    for (let i = degree; i >= 0; i--) {
        const coeffInput = document.getElementById(`coeff-${i}`);
        coeffInput.value = i === degree ? '1' : '0';
    }
    resultsContainer.style.display = 'none';
}