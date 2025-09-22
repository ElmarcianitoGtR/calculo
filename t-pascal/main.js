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

  const triangulo = generarTrianguloPascal(n);


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

function mostrarDesarrolloBinomio(coeficientes, a, b, n) {
  const developmentDiv = document.getElementById("binomialDevelopment");
  developmentDiv.innerHTML = "";

  const title = document.createElement("h2");
  title.textContent = `Desarrollo`;
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

    termino = `<span class="highlight">${termino}</span>`;

    if (k > 0) {
      termino = " + " + termino;
    }

    desarrolloTexto += termino;
  }

  development.innerHTML = desarrolloTexto;
  developmentDiv.appendChild(development);

}

window.onload = generarTriangulo;
