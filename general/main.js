btnCalc = document.getElementById("btnCalc");
a = document.getElementById("a");
b = document.getElementById("b");
c = document.getElementById("c");

btnCalc.addEventListener("click", (event) => {
  event.preventDefault();

  const aValue = parseFloat(a.value);
  const bValue = parseFloat(b.value);
  const cValue = parseFloat(c.value);

  const intRaiz = bValue * bValue - 4 * aValue * cValue; // Corregido: usar bValue en lugar de a.value

  if (intRaiz > 0) {
    const x1 = (-bValue + Math.sqrt(intRaiz)) / (2 * aValue);
    const x2 = (-bValue - Math.sqrt(intRaiz)) / (2 * aValue);
    alert(`x1=${x1}, x2=${x2}`);
  } else if (intRaiz === 0) {
    const x = -bValue / (2 * aValue);
    alert(`x=${x}`);
  } else {
    const realPart = -bValue / (2 * aValue);
    const imagPart = Math.sqrt(Math.abs(intRaiz)) / (2 * aValue);
    const x1 = `${realPart} + ${imagPart}i`;
    const x2 = `${realPart} - ${imagPart}i`;
    alert(`x1=${x1}, x2=${x2}`);
  }
});
