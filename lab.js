
const $ = (selector) => document.querySelector(selector);

document.addEventListener("DOMContentLoaded", () => {
  // Eventos JS
  $("#palindromo-btn")?.addEventListener("click", manejarPalindromo);
  $("#mayor-btn")?.addEventListener("click", manejarMayor);
  $("#vocales-btn")?.addEventListener("click", manejarVocales);
  $("#contar-btn")?.addEventListener("click", manejarContarVocales);

  // Inicializar AJAX
  inicializarAjax();
});


// EJERCICIO JS 1: Detectar si cadena es palíndromo

function esPalindromo(texto) {
  if (!texto) return false;

  // Normalizamos: minúsculas, sin acentos ni caracteres no alfanuméricos
  const normalizado = texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quitar acentos
    .replace(/[^a-z0-9]/g, ""); // quitar espacios y signos

  const invertido = normalizado.split("").reverse().join("");
  return normalizado !== "" && normalizado === invertido;
}

function manejarPalindromo() {
  const entrada = $("#palindromo-input");
  const salida = $("#palindromo-salida");
  const valor = entrada.value.trim();

  if (!valor) {
    salida.textContent = "Introduce un texto, por favor.";
    return;
  }

  if (esPalindromo(valor)) {
    salida.textContent = "✅ La cadena ES un palíndromo.";
  } else {
    salida.textContent = "❌ La cadena NO es un palíndromo.";
  }
}


// EJERCICIO JS 2: Pedir dos números y devolver el mayor

function manejarMayor() {
  const n1 = parseFloat($("#mayor-num1").value);
  const n2 = parseFloat($("#mayor-num2").value);
  const salida = $("#mayor-salida");

  if (isNaN(n1) || isNaN(n2)) {
    salida.textContent = "Introduce dos números válidos.";
    return;
  }

  if (n1 === n2) {
    salida.textContent = "Ambos números son iguales.";
  } else if (n1 > n2) {
    salida.textContent = `El mayor es: ${n1}`;
  } else {
    salida.textContent = `El mayor es: ${n2}`;
  }
}


// EJERCICIO JS 3: Mostrar las vocales que aparecen en una frase

function manejarVocales() {
  const frase = $("#vocales-frase").value.toLowerCase();
  const salida = $("#vocales-salida");

  if (!frase.trim()) {
    salida.textContent = "Introduce una frase, por favor.";
    return;
  }

  const vocales = ["a", "e", "i", "o", "u"];
  const presentes = vocales.filter((v) => frase.includes(v));

  if (presentes.length === 0) {
    salida.textContent = "No se ha encontrado ninguna vocal.";
  } else {
    salida.textContent = `Vocales que aparecen: ${presentes.join(", ")}.`;
  }
}


// EJERCICIO JS 4: Contar cuántas veces aparece cada vocal en una frase

function manejarContarVocales() {
  const frase = $("#contar-frase").value.toLowerCase();
  const salida = $("#contar-salida");

  if (!frase.trim()) {
    salida.textContent = "Introduce una frase, por favor.";
    return;
  }

  const conteo = { a: 0, e: 0, i: 0, o: 0, u: 0 };

  for (const ch of frase) {
    if (conteo.hasOwnProperty(ch)) {
      conteo[ch]++;
    }
  }

  salida.innerHTML = `
    <ul>
      <li>A: ${conteo.a}</li>
      <li>E: ${conteo.e}</li>
      <li>I: ${conteo.i}</li>
      <li>O: ${conteo.o}</li>
      <li>U: ${conteo.u}</li>
    </ul>
  `;
}


// BLOQUE AJAX

function inicializarAjax() {
  const inputUrl = $("#ajax-url");
  const boton = $("#ajax-btn");

  // Al cargar la página, mostrar la URL actual
  if (inputUrl) {
    inputUrl.value = window.location.href;
  }

  if (boton) {
    boton.addEventListener("click", hacerPeticionAjax);
  }
}

function actualizarEstado(texto) {
  const estado = $("#ajax-estado");
  if (estado) {
    estado.textContent = texto;
  }
}

function hacerPeticionAjax() {
  const inputUrl = $("#ajax-url");
  const contenido = $("#ajax-contenido");
  const cabeceras = $("#ajax-cabeceras");
  const codigo = $("#ajax-codigo");

  const url = inputUrl.value.trim();

  if (!url) {
    actualizarEstado("Introduce una URL válida.");
    return;
  }

  // Limpiamos las zonas
  if (contenido) contenido.textContent = "";
  if (cabeceras) cabeceras.textContent = "";
  if (codigo) codigo.textContent = "";

  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    // Mostrar el estado en cada cambio de readyState
    switch (xhr.readyState) {
      case 0:
        actualizarEstado("0 - Petición no iniciada");
        break;
      case 1:
        actualizarEstado("1 - Conexión establecida (cargando)");
        break;
      case 2:
        actualizarEstado("2 - Cabeceras recibidas");
        if (cabeceras) {
          cabeceras.textContent = xhr.getAllResponseHeaders();
        }
        break;
      case 3:
        actualizarEstado("3 - Descargando respuesta...");
        break;
      case 4:
        actualizarEstado("4 - Petición completada");
        if (codigo) {
          codigo.textContent = `Código: ${xhr.status} (${xhr.statusText})`;
        }

        if (contenido) {
          if (xhr.status >= 200 && xhr.status < 300) {
            // Mostramos el cuerpo de la respuesta
            contenido.textContent = xhr.responseText;
          } else {
            contenido.textContent =
              "Error al cargar el contenido. Revisa la URL o las restricciones de CORS.";
          }
        }
        break;
    }
  };

  xhr.onerror = function () {
    actualizarEstado("Error en la petición AJAX.");
  };

  try {
    xhr.open("GET", url, true);
    xhr.send();
  } catch (error) {
    actualizarEstado("No se pudo realizar la petición: " + error.message);
  }
}
