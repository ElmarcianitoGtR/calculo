function calcularCramer() {
  const a1 = parseFloat(document.getElementById("a1").value);
  const b1 = parseFloat(document.getElementById("b1").value);
  const c1 = parseFloat(document.getElementById("c1").value);
  const d1 = parseFloat(document.getElementById("d1").value);

  const a2 = parseFloat(document.getElementById("a2").value);
  const b2 = parseFloat(document.getElementById("b2").value);
  const c2 = parseFloat(document.getElementById("c2").value);
  const d2 = parseFloat(document.getElementById("d2").value);

  const a3 = parseFloat(document.getElementById("a3").value);
  const b3 = parseFloat(document.getElementById("b3").value);
  const c3 = parseFloat(document.getElementById("c3").value);
  const d3 = parseFloat(document.getElementById("d3").value);

  // Calcular determinante de la matriz principal (A)
  const detA =
    a1 * (b2 * c3 - b3 * c2) -
    b1 * (a2 * c3 - a3 * c2) +
    c1 * (a2 * b3 - a3 * b2);

  const detAx =
    d1 * (b2 * c3 - b3 * c2) -
    b1 * (d2 * c3 - d3 * c2) +
    c1 * (d2 * b3 - d3 * b2);

  const detAy =
    a1 * (d2 * c3 - d3 * c2) -
    d1 * (a2 * c3 - a3 * c2) +
    c1 * (a2 * d3 - a3 * d2);

  const detAz =
    a1 * (b2 * d3 - b3 * d2) -
    b1 * (a2 * d3 - a3 * d2) +
    d1 * (a2 * b3 - a3 * b2);

  const x = detAx / detA;
  const y = detAy / detA;
  const z = detAz / detA;

  document.getElementById("solucion").innerHTML = `
                x = ${x.toFixed(4)}<br>
                y = ${y.toFixed(4)}<br>
                z = ${z.toFixed(4)}
            `;

  document.getElementById("resultado").style.display = "block";
}
