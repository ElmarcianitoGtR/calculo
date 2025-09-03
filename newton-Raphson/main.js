document.getElementById("calculate").addEventListener("click", calculateRoots);

function calculateRoots() {
  const polyInput = document.getElementById("polynomial").value.trim();
  const tolerance = 2;
  const maxIterations = 1000;
  const initialGuess = parseFloat(
    document.getElementById("initialGuess").value
  );
  const step = parseFloat(document.getElementById("step").value);

  if (!polyInput) {
    showError("Por favor ingresa los coeficientes.");
    return;
  }

  let coefficients;
  try {
    coefficients = polyInput.split(",").map((c) => parseFloat(c.trim()));
    if (coefficients.some(isNaN)) {
      throw new Error("Coeficientes inválidos");
    }
  } catch (e) {
    showError(
      "Formato de coeficientes inválido. Usa números separados por comas."
    );
    return;
  }

  if (coefficients.length < 4) {
    showError("El polinomio debe ser de grado 3 o superior.");
    return;
  }

  const derivative = calculateDerivative(coefficients);

  // Encontrar raíces
  const roots = findAllRoots(
    coefficients,
    derivative,
    initialGuess,
    step,
    tolerance,
    maxIterations
  );

  // Mostrar resultados
  displayResults(roots, coefficients);
}

function evaluatePolynomial(coefficients, x) {
  let result = 0;
  for (let i = 0; i < coefficients.length; i++) {
    result += coefficients[i] * Math.pow(x, coefficients.length - 1 - i);
  }
  return result;
}

function calculateDerivative(coefficients) {
  const derivative = [];
  const degree = coefficients.length - 1;

  for (let i = 0; i < degree; i++) {
    derivative.push(coefficients[i] * (degree - i));
  }

  return derivative;
}

function newtonRaphson(
  coefficients,
  derivative,
  initialGuess,
  tolerance,
  maxIterations
) {
  let x = initialGuess;
  let iterations = 0;
  let error = tolerance + 1;

  while (error > tolerance && iterations < maxIterations) {
    const fx = evaluatePolynomial(coefficients, x);
    const dfx = evaluatePolynomial(derivative, x);

    if (Math.abs(dfx) < 1e-10) {
      // Evitar división por cero
      return { root: null, iterations, error: "Derivada cercana a cero" };
    }

    const xNew = x - fx / dfx;
    error = Math.abs(xNew - x);
    x = xNew;
    iterations++;
  }

  if (iterations >= maxIterations) {
    return { root: null, iterations, error: "Máximo de iteraciones alcanzado" };
  }

  return { root: x, iterations, error: null };
}

function isRootUnique(roots, newRoot, tolerance) {
  if (!roots.length) return true;

  for (const root of roots) {
    if (Math.abs(root - newRoot) < tolerance * 10) {
      return false;
    }
  }
  return true;
}

function findAllRoots(
  coefficients,
  derivative,
  initialGuess,
  step,
  tolerance,
  maxIterations
) {
  const roots = [];
  const degree = coefficients.length - 1;

  // Buscar raíces en un rango alrededor del valor inicial
  const searchRange = 10 * degree; // Rango amplio para encontrar raíces
  let x = initialGuess - searchRange / 2;

  while (x <= initialGuess + searchRange / 2 && roots.length < degree) {
    const result = newtonRaphson(
      coefficients,
      derivative,
      x,
      tolerance,
      maxIterations
    );

    if (result.root !== null) {
      // Redondear a la tolerancia especificada
      const roundedRoot = Math.round(result.root / tolerance) * tolerance;

      if (isRootUnique(roots, roundedRoot, tolerance)) {
        roots.push(roundedRoot);
      }
    }

    x += step;
  }

  return roots.sort((a, b) => a - b);
}

function displayResults(roots, coefficients) {
  const rootsContainer = document.getElementById("roots-container");
  const errorMessage = document.getElementById("error-message");
  const resultsDiv = document.getElementById("results");

  rootsContainer.innerHTML = "";
  errorMessage.textContent = "";
  resultsDiv.style.display = "block";

  if (roots.length === 0) {
    errorMessage.textContent =
      "No se encontraron raíces con los parámetros dados.";
    return;
  }

  const degree = coefficients.length - 1;
  const expectedRoots = degree;

  if (roots.length < expectedRoots) {
    errorMessage.textContent = `Advertencia: Se esperaban ${expectedRoots} raíces pero solo se encontraron ${roots.length}. 
                                          Intenta ajustar el valor inicial o el paso.`;
  }

  // Mostrar polinomio ingresado
  let polyText = "Polinomio: ";
  for (let i = 0; i < coefficients.length; i++) {
    const power = degree - i;
    const coeff = coefficients[i];

    if (coeff === 0) continue;

    if (i > 0) {
      polyText += coeff > 0 ? " + " : " - ";
    } else if (coeff < 0) {
      polyText += "-";
    }

    const absCoeff = Math.abs(coeff);
    if (absCoeff !== 1 || power === 0) {
      polyText += absCoeff;
    }

    if (power > 0) {
      polyText += "x";
      if (power > 1) {
        polyText += `<sup>${power}</sup>`;
      }
    }
  }

  const polyInfo = document.createElement("div");
  polyInfo.innerHTML = polyText;
  rootsContainer.appendChild(polyInfo);

  // Mostrar raíces encontradas
  const rootsTitle = document.createElement("h3");
  rootsTitle.textContent = `Raíces encontradas (${roots.length} de ${expectedRoots}):`;
  rootsContainer.appendChild(rootsTitle);

  roots.forEach((root, index) => {
    const rootDiv = document.createElement("div");
    rootDiv.className = "root";

    const rootText = document.createElement("div");
    rootText.innerHTML = `<strong>Raíz ${
      index + 1
    }:</strong> x = ${root.toFixed(8)}`;

    // Verificar si realmente es raíz evaluando el polinomio
    const valueAtRoot = evaluatePolynomial(coefficients, root);
    const verification = document.createElement("div");
    verification.innerHTML = `<strong>Verificación:</strong> f(${root.toFixed(
      4
    )}) = ${valueAtRoot.toExponential(4)}`;

    if (Math.abs(valueAtRoot) < 0.001) {
      verification.className = "success";
      verification.innerHTML += " ✓ (Raíz válida)";
    } else {
      verification.className = "error";
      verification.innerHTML += " ✗ (Posible error)";
    }

    rootDiv.appendChild(rootText);
    rootDiv.appendChild(verification);
    rootsContainer.appendChild(rootDiv);
  });
}

function showError(message) {
  const errorMessage = document.getElementById("error-message");
  const resultsDiv = document.getElementById("results");

  errorMessage.textContent = message;
  resultsDiv.style.display = "block";
  document.getElementById("roots-container").innerHTML = "";
}
