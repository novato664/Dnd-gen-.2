
// script.js actualizado completo para el generador de personajes

// Variables globales
let razas = [];
let clases = [];
let trasfondos = [];
let equipos = [];
let hechizos = [];
let idioma = 'es';

// Cargar datos desde los JSON
async function cargarDatos() {
  razas = await (await fetch('datos/razas.json')).json();
  clases = await (await fetch('datos/clases.json')).json();
  trasfondos = await (await fetch('datos/trasfondos.json')).json();
  equipos = await (await fetch('datos/equipos.json')).json();
  hechizos = await (await fetch('datos/hechizos.json')).json();

  cargarOpciones();
  cargarNivel();
}

// Cargar opciones en los selectores
function cargarOpciones() {
  const razaSel = document.getElementById('seleccion-raza');
  const claseSel = document.getElementById('seleccion-clase');
  const trasfondoSel = document.getElementById('seleccion-trasfondo');

  razas.forEach(r => razaSel.appendChild(new Option(r.nombre, r.nombre)));
  clases.forEach(c => claseSel.appendChild(new Option(c.nombre, c.nombre)));
  trasfondos.forEach(t => trasfondoSel.appendChild(new Option(t.nombre, t.nombre)));
}

// Cargar opciones de nivel 1 a 20
function cargarNivel() {
  const nivelSel = document.getElementById('nivel-selector');
  for (let i = 1; i <= 20; i++) {
    nivelSel.appendChild(new Option(i, i));
  }
}

// Funciones de atributos
function tirarAtributo() {
  let dados = [0,0,0,0].map(() => Math.floor(Math.random() * 6) + 1);
  dados.sort((a,b) => a-b);
  return dados[1] + dados[2] + dados[3];
}

function generarAtributos() {
  return {
    Fuerza: tirarAtributo(),
    Destreza: tirarAtributo(),
    Constitucion: tirarAtributo(),
    Inteligencia: tirarAtributo(),
    Sabiduria: tirarAtributo(),
    Carisma: tirarAtributo()
  };
}

// Crear personaje manual
function generarPersonajeManual() {
  const raza = razas.find(r => r.nombre === document.getElementById('seleccion-raza').value);
  const clase = clases.find(c => c.nombre === document.getElementById('seleccion-clase').value);
  const trasfondo = trasfondos.find(t => t.nombre === document.getElementById('seleccion-trasfondo').value);

  mostrarPersonaje(raza, clase, trasfondo);
}

// Crear personaje aleatorio
function generarPersonajeAleatorio() {
  const raza = razas[Math.floor(Math.random()*razas.length)];
  const clase = clases[Math.floor(Math.random()*clases.length)];
  const trasfondo = trasfondos[Math.floor(Math.random()*trasfondos.length)];

  mostrarPersonaje(raza, clase, trasfondo);
}

// Mostrar personaje
function mostrarPersonaje(raza, clase, trasfondo) {
  const atributos = generarAtributos();
  const nivel = parseInt(document.getElementById('nivel-selector').value) || 1;

  const equipoClase = equipos.find(e => e.clase === clase.nombre);
  const hechizosClase = hechizos.find(h => h.clase === clase.nombre);

  const pvBase = parseInt(clase.dadoGolpe.substring(2));
  const modificadorConstitucion = Math.floor((atributos.Constitucion - 10) / 2);
  const puntosVida = (pvBase + modificadorConstitucion) * nivel;

  let hechizosHtml = '';
  if (hechizosClase) {
    hechizosClase.hechizos.forEach(h => hechizosHtml += `<li>${h}</li>`);
  }

  let atributosHtml = '';
  for (let k in atributos) {
    atributosHtml += `<div class='atributo'><strong>${k}</strong><br>${atributos[k]}</div>`;
  }

  document.getElementById('resultado').innerHTML += `
    <div class="ficha">
      <h2>${raza.nombre} ${clase.nombre} (Nivel ${nivel})</h2>
      <p><strong>Trasfondo:</strong> ${trasfondo.nombre}</p>
      <p><strong>Puntos de Vida:</strong> ${puntosVida}</p>
      <div class="atributos-grid">${atributosHtml}</div>
      <p><strong>Equipo:</strong> ${equipoClase ? equipoClase.equipo.join(', ') : 'Sin equipo asignado'}</p>
      <p><strong>Hechizos:</strong></p>
      <ul>${hechizosHtml}</ul>
      <hr>
    </div>
  `;
}

// Crear Party de 5 personajes
function generarParty() {
  document.getElementById('resultado').innerHTML = '';
  for (let i = 0; i < 5; i++) {
    generarPersonajeAleatorio();
  }
}

// Descargar PDF
function descargarPDF() {
  const elemento = document.getElementById('resultado');
  if (elemento) {
    html2pdf().from(elemento).save('personajes_dnd5e.pdf');
  }
}

// Modo oscuro
function toggleModoOscuro() {
  document.body.classList.toggle('modo-oscuro');
}

// Cambiar idioma (a futuro)
function cambiarIdioma() {
  idioma = document.getElementById('idioma-selector').value;
}

document.getElementById('idioma-selector').addEventListener('change', cambiarIdioma);

// Iniciar
cargarDatos();
