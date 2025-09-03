function generarTriangulo() {
  // Obtener valores del formulario
  const a = document.getElementById("variable1").value.trim() || "a";
  const b = document.getElementById("variable2").value.trim() || "b";
  const n = parseInt(document.getElementById("exponente").value);

  // Validar el exponente
  if (n < 0 || n > 15) {
    alert("Por favor, ingrese un exponente entre 0 y 15");
    return;
  }

  // Generar el triángulo de Pascal hasta el nivel n
  const triangulo = generarTrianguloPascal(n);

  // Mostrar el triángulo
  mostrarTrianguloPascal(triangulo);

  // Mostrar el desarrollo del binomio
  mostrarDesarrolloBinomio(triangulo[n], a, b, n);
}

function generarTrianguloPascal(n) {
  const triangulo = [];

  for (let i = 0; i <= n; i++) {
    const fila = [];

    for (let j = 0; j <= i; j++) {
      if (j === 0 || j === i) {
        fila.push(1);
      } else {
        fila.push(triangulo[i - 1][j - 1] + triangulo[i - 1][j]);
      }
    }

    triangulo.push(fila);
  }

  return triangulo;
}

function mostrarTrianguloPascal(triangulo) {
  const container = document.getElementById("pascalContainer");
  container.innerHTML = "";

  triangulo.forEach((fila, i) => {
    const rowDiv = document.createElement("div");
    rowDiv.className = "pascal-row";

    // Añadir espacios para centrar
    for (let s = 0; s < triangulo.length - i - 1; s++) {
      const space = document.createElement("div");
      space.style.width = "40px";
      space.style.margin = "0 5px";
      rowDiv.appendChild(space);
    }

    fila.forEach((num) => {
      const cell = document.createElement("div");
      cell.className = "pascal-cell";
      cell.textContent = num;

      // Resaltar la fila correspondiente al exponente seleccionado
      if (i === triangulo.length - 1) {
        cell.style.backgroundColor = "#3498db";
        cell.style.color = "white";
      }

      rowDiv.appendChild(cell);
    });

    container.appendChild(rowDiv);
  });
}

function mostrarDesarrolloBinomio(coeficientes, a, b, n) {
  const developmentDiv = document.getElementById("binomialDevelopment");
  developmentDiv.innerHTML = "";

  const title = document.createElement("h2");
  title.textContent = `Desarrollo de (${a} + ${b})^${n}:`;
  developmentDiv.appendChild(title);

  const development = document.createElement("p");

  if (n === 0) {
    development.innerHTML = `Cualquier expresión elevada a la potencia 0 es igual a <span class="highlight">1</span>`;
    developmentDiv.appendChild(development);
    return;
  }

  let desarrolloTexto = "";

  for (let k = 0; k <= n; k++) {
    const coeficiente = coeficientes[k];
    const exponenteA = n - k;
    const exponenteB = k;

    // No mostrar coeficiente 1 (excepto al inicio)
    const mostrarCoeficiente = coeficiente !== 1 || k === 0;

    // Construir término
    let termino = "";

    if (mostrarCoeficiente) {
      termino += coeficiente;
    }

    if (exponenteA > 0) {
      termino += a;
      if (exponenteA > 1) {
        termino += `<sup>${exponenteA}</sup>`;
      }
    }

    if (exponenteB > 0) {
      termino += b;
      if (exponenteB > 1) {
        termino += `<sup>${exponenteB}</sup>`;
      }
    }

    // Resaltar el término actual
    termino = `<span class="highlight">${termino}</span>`;

    // Añadir signo + si no es el primer término
    if (k > 0) {
      termino = " + " + termino;
    }

    desarrolloTexto += termino;
  }

  development.innerHTML = desarrolloTexto;
  developmentDiv.appendChild(development);

  // Explicación
  const explanation = document.createElement("p");
  explanation.innerHTML = `Los coeficientes <span class="highlight">${coeficientes.join(
    ", "
  )}</span> corresponden a la fila ${n} del Triángulo de Pascal.`;
  developmentDiv.appendChild(explanation);
}

// Generar al cargar la página con valores por defecto
window.onload = generarTriangulo;
