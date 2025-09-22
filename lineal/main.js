
        // Variables globales
        let matrixSize = 3;
        let matrix = [];
        
        // Elementos DOM
        const equationsContainer = document.getElementById('equations-container');
        const solveBtn = document.getElementById('solve-btn');
        const clearBtn = document.getElementById('clear-btn');
        const solutionSection = document.getElementById('solution-section');
        const stepsContainer = document.getElementById('steps-container');
        const finalSolution = document.getElementById('final-solution');
        const errorMessage = document.getElementById('error-message');
        
        // Configurar botones de acción
        solveBtn.addEventListener('click', solveSystem);
        clearBtn.addEventListener('click', clearAll);
        
        // Inicializar con sistema 2x2
        setMatrixSize(3);
        
        // Función para establecer el tamaño de la matriz
        function setMatrixSize(size) {
            matrixSize = size;
            generateEquationInputs();
            hideError();
        }
        
        // Función para generar los inputs de ecuaciones
        function generateEquationInputs() {
            equationsContainer.innerHTML = '';
            const variables = ['x', 'y', 'z', 'w'];
            
            for (let i = 0; i < matrixSize; i++) {
                const equationDiv = document.createElement('div');
                equationDiv.className = 'equation';
                
                for (let j = 0; j < matrixSize; j++) {
                    const input = document.createElement('input');
                    input.type = 'number';
                    input.id = `a${i}${j}`;
                    input.placeholder = '0';
                    input.value = '';
                    equationDiv.appendChild(input);
                    
                    const variableSpan = document.createElement('span');
                    variableSpan.className = 'variable';
                    variableSpan.textContent = variables[j];
                    equationDiv.appendChild(variableSpan);
                    
                    if (j < matrixSize - 1) {
                        const plusSpan = document.createElement('span');
                        plusSpan.textContent = '+';
                        equationDiv.appendChild(plusSpan);
                    }
                }
                
                const equalsSpan = document.createElement('span');
                equalsSpan.textContent = '=';
                equationDiv.appendChild(equalsSpan);
                
                const resultInput = document.createElement('input');
                resultInput.type = 'number';
                resultInput.id = `b${i}`;
                resultInput.placeholder = '0';
                resultInput.value = '';
                equationDiv.appendChild(resultInput);
                
                equationsContainer.appendChild(equationDiv);
            }
        }
        
        // Función para resolver el sistema
        function solveSystem() {
            // Obtener valores de la matriz
            matrix = [];
            for (let i = 0; i < matrixSize; i++) {
                const row = [];
                for (let j = 0; j < matrixSize; j++) {
                    const value = parseFloat(document.getElementById(`a${i}${j}`).value) || 0;
                    row.push(value);
                }
                // Añadir el término independiente
                const bValue = parseFloat(document.getElementById(`b${i}`).value) || 0;
                row.push(bValue);
                matrix.push(row);
            }
            
            // Validar que la matriz no sea singular
            if (isMatrixSingular(matrix)) {
                showError("La matriz es singular. El sistema puede no tener solución única.");
                return;
            }
            
            // Limpiar sección de solución
            stepsContainer.innerHTML = '';
            finalSolution.innerHTML = '';
            solutionSection.style.display = 'block';
            
            // Mostrar matriz aumentada inicial
            addStep("Matriz aumentada inicial:", matrix, "");
            
            // Aplicar eliminación de Gauss-Jordan
            const steps = gaussJordanElimination(matrix);
            
            // Mostrar todos los pasos
            steps.forEach(step => {
                addStep(step.description, step.matrix, step.operation);
            });
            
            // Mostrar solución final
            showFinalSolution(matrix);
        }
        
        // Función para verificar si la matriz es singular
        function isMatrixSingular(matrix) {
            // Para matrices 2x2: det = a*d - b*c
            if (matrixSize === 2) {
                const det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
                return Math.abs(det) < 1e-10;
            }
            
            // Para matrices más grandes, una aproximación simple
            // En una implementación real, se calcularía el determinante
            return false;
        }
        
        // Función para realizar la eliminación de Gauss-Jordan
        function gaussJordanElimination(matrix) {
            const steps = [];
            const n = matrix.length;
            
            // Crear una copia de la matriz para no modificar la original
            const augmentedMatrix = matrix.map(row => [...row]);
            
            // Eliminación hacia adelante (hacer ceros debajo de la diagonal)
            for (let i = 0; i < n; i++) {
                // Hacer el elemento diagonal 1
                if (Math.abs(augmentedMatrix[i][i]) < 1e-10) {
                    // Buscar una fila para intercambiar
                    for (let j = i + 1; j < n; j++) {
                        if (Math.abs(augmentedMatrix[j][i]) > 1e-10) {
                            // Intercambiar filas
                            [augmentedMatrix[i], augmentedMatrix[j]] = [augmentedMatrix[j], augmentedMatrix[i]];
                            steps.push({
                                description: `Intercambio de filas ${i+1} y ${j+1} para evitar división por cero`,
                                matrix: augmentedMatrix.map(row => [...row]),
                                operation: `R${i+1} ↔ R${j+1}`
                            });
                            break;
                        }
                    }
                }
                
                // Hacer el pivote igual a 1
                const pivot = augmentedMatrix[i][i];
                if (Math.abs(pivot) > 1e-10) {
                    for (let j = i; j < n + 1; j++) {
                        augmentedMatrix[i][j] /= pivot;
                    }
                    
                    steps.push({
                        description: `Hacer el pivote en la fila ${i+1} igual a 1`,
                        matrix: augmentedMatrix.map(row => [...row]),
                        operation: `R${i+1} = R${i+1} / ${pivot.toFixed(2)}`
                    });
                }
                
                // Hacer ceros en la columna i
                for (let j = 0; j < n; j++) {
                    if (i !== j) {
                        const factor = augmentedMatrix[j][i];
                        for (let k = i; k < n + 1; k++) {
                            augmentedMatrix[j][k] -= factor * augmentedMatrix[i][k];
                        }
                        
                        steps.push({
                            description: `Hacer cero el elemento en la fila ${j+1}, columna ${i+1}`,
                            matrix: augmentedMatrix.map(row => [...row]),
                            operation: `R${j+1} = R${j+1} - ${factor.toFixed(2)} * R${i+1}`
                        });
                    }
                }
            }
            
            return steps;
        }
        
        // Función para añadir un paso a la visualización
        function addStep(description, matrix, operation) {
            const stepDiv = document.createElement('div');
            stepDiv.className = 'step';
            
            const title = document.createElement('div');
            title.className = 'step-title';
            title.textContent = description;
            stepDiv.appendChild(title);
            
            if (operation) {
                const opDiv = document.createElement('div');
                opDiv.className = 'operations';
                opDiv.textContent = `Operación: ${operation}`;
                stepDiv.appendChild(opDiv);
            }
            
            const matrixDiv = document.createElement('div');
            matrixDiv.className = 'matrix';
            
            for (let i = 0; i < matrix.length; i++) {
                const rowDiv = document.createElement('div');
                rowDiv.className = 'matrix-row';
                
                for (let j = 0; j < matrix[i].length; j++) {
                    const cellDiv = document.createElement('div');
                    cellDiv.className = 'matrix-cell';
                    
                    // Resaltar la parte de la matriz de coeficientes vs aumentada
                    if (j === matrix[i].length - 1) {
                        cellDiv.innerHTML = `<strong>| ${matrix[i][j].toFixed(2)}</strong>`;
                    } else {
                        cellDiv.textContent = matrix[i][j].toFixed(2);
                    }
                    
                    rowDiv.appendChild(cellDiv);
                }
                
                matrixDiv.appendChild(rowDiv);
            }
            
            stepDiv.appendChild(matrixDiv);
            stepsContainer.appendChild(stepDiv);
        }
        
        // Función para mostrar la solución final
        function showFinalSolution(matrix) {
            const variables = ['x', 'y', 'z', 'w'];
            finalSolution.innerHTML = '<h3>Solución:</h3>';
            
            for (let i = 0; i < matrixSize; i++) {
                const solutionValue = document.createElement('div');
                solutionValue.className = 'solution-value';
                solutionValue.textContent = `${variables[i]} = ${matrix[i][matrixSize].toFixed(4)}`;
                finalSolution.appendChild(solutionValue);
            }
        }
        
        // Función para mostrar errores
        function showError(message) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
        }
        
        // Función para ocultar errores
        function hideError() {
            errorMessage.style.display = 'none';
        }
        
        // Función para limpiar todo
        function clearAll() {
            generateEquationInputs();
            stepsContainer.innerHTML = '';
            finalSolution.innerHTML = '';
            solutionSection.style.display = 'none';
            hideError();
        }