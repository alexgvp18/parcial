class Evento {
  constructor(id, nombre, fecha, ubicacion, categoria, organizador, telefono, correo, descripcion) {
    this.id = id;
    this.nombre = nombre;
    this.fecha = fecha;
    this.ubicacion = ubicacion;
    this.categoria = categoria;
    this.organizador = organizador;
    this.telefono = telefono;
    this.correo = correo;
    this.descripcion = descripcion;
    this.inscrito = false;
    this.favorito = false;
  }

  toggleInscripcion() {
    this.inscrito = !this.inscrito;
  }

  toggleFavorito() {
    this.favorito = !this.favorito;
  }
}

const eventos = [
  new Evento(
    1, "Salón de Lujo", "2025-08-15", "Miraflores", "Salones",
    "Eventos Elite S.A.C", "987654321", "elite@eventos.pe", "Especialistas en salones premium para bodas elegantes."
  ),
  new Evento(
    2, "Buffet Premium", "2025-08-20", "San Isidro", "Buffet",
    "Delicias Gourmet", "912345678", "buffet@delicias.pe", "Catering de alta gama con menús personalizados."
  ),
  new Evento(
    3, "Decoración Floral", "2025-08-25", "La Molina", "Decoración",
    "Flores y Encanto", "998877665", "flores@encanto.pe", "Decoración floral profesional y elegante."
  ),
  new Evento(
    4, "Música en Vivo", "2025- 09-01", "Surco", "Música",
    "Melodías en Vivo", "934567890", "musica@melodias.pe", "Grupos musicales para ceremonias y fiestas."
  ),
];

const filtros = document.querySelectorAll(".filtros button");
const buscador = document.querySelector(".buscador");
const seccionEventos = document.getElementById("seccion-eventos");
const contenedorEventos = seccionEventos.querySelector(".tarjetas-eventos");
const seccionFavoritos = document.getElementById("seccion-favoritos");
const notiBadge = document.getElementById("noti-badge");
const notiMensajes = document.getElementById("noti-mensajes");

const formulario = document.getElementById("formulario-usuario");
const modal = document.getElementById("modalFormulario");
const cerrarModal = document.getElementById("cerrarModal");

let notificaciones = [];
let datosValidados = false;

formulario.addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombres").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const dni = document.getElementById("dni").value.trim();
  const correo = document.getElementById("correo").value.trim();

  if (
    nombre.length > 3 &&
    /^\d{9}$/.test(telefono) &&
    /^\d{8}$/.test(dni) &&
    correo.includes("@")
  ) {
    datosValidados = true;
    alert("Formulario registrado correctamente.");
    modal.style.display = "none";
  } else {
    alert("Completa correctamente todos los campos.");
  }
});

cerrarModal.addEventListener("click", () => {
  modal.style.display = "none";
});

function verificacionAntesDeAccion(callback) {
  if (!datosValidados) {
    modal.style.display = "flex";
  } else {
    callback();
  }
}

function renderizarEventos(filtro = "Todos") {
  if (!seccionEventos.classList.contains("seccion-activa")) return;

  contenedorEventos.innerHTML = "";

  const terminoBusqueda = buscador.value.toLowerCase();

  const filtrados = eventos.filter(e =>
    (filtro === "Todos" || e.categoria === filtro) &&
    e.nombre.toLowerCase().includes(terminoBusqueda)
  );

  if (filtrados.length === 0) {
    contenedorEventos.innerHTML = "<p>No se encontraron eventos.</p>";
    return;
  }

  filtrados.forEach(evento => {
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta-evento");

    tarjeta.innerHTML = `
      <div class="imagen-evento"></div>
      <div class="contenido-evento">
        <h3>${evento.nombre}</h3>
        <p>Ubicación: ${evento.ubicacion}</p>
        <p>Fecha: ${evento.fecha}</p>
        <button class="btn-inscribir">${evento.inscrito ? "Cancelar" : "Inscribirme"}</button>
        <button class="btn-favorito">${evento.favorito ? "★ Quitar favorito" : "☆ Favorito"}</button>
      </div>
    `;

    tarjeta.querySelector(".btn-inscribir").addEventListener("click", () => {
      verificacionAntesDeAccion(() => {
        evento.toggleInscripcion();
        agregarNotificacion(evento.inscrito ? `Te inscribiste a ${evento.nombre}` : `Cancelaste inscripción a ${evento.nombre}`);
        renderizarEventos(filtro);
      });
    });

    tarjeta.querySelector(".btn-favorito").addEventListener("click", () => {
      verificacionAntesDeAccion(() => {
        evento.toggleFavorito();
        agregarNotificacion(evento.favorito ? `Agregado a favoritos: ${evento.nombre}` : `Quitado de favoritos: ${evento.nombre}`);
        renderizarEventos(filtro);
      });
    });

    contenedorEventos.appendChild(tarjeta);
  });
}

function renderizarFavoritos() {
  seccionFavoritos.innerHTML = "<h1>Mis Eventos Favoritos</h1>";

  const favoritos = eventos.filter(e => e.favorito);

  if (favoritos.length === 0) {
    seccionFavoritos.innerHTML += "<p>No tienes eventos favoritos.</p>";
    return;
  }

  favoritos.forEach(evento => {
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta-evento");

    tarjeta.innerHTML = `
      <div class="imagen-evento"></div>
      <div class="contenido-evento">
        <h3>${evento.nombre}</h3>
        <p>Ubicación: ${evento.ubicacion}</p>
        <p>Fecha: ${evento.fecha}</p>
        <button class="btn-inscribir">${evento.inscrito ? "Cancelar" : "Inscribirme"}</button>
        <button class="btn-favorito">${evento.favorito ? "★ Quitar favorito" : "☆ Favorito"}</button>
      </div>
    `;

    tarjeta.querySelector(".btn-inscribir").addEventListener("click", () => {
      verificacionAntesDeAccion(() => {
        evento.toggleInscripcion();
        agregarNotificacion(evento.inscrito ? `Te inscribiste a ${evento.nombre}` : `Cancelaste inscripción`);
        renderizarFavoritos();
      });
    });

    tarjeta.querySelector(".btn-favorito").addEventListener("click", () => {
      verificacionAntesDeAccion(() => {
        evento.toggleFavorito();
        agregarNotificacion(evento.favorito ? `Agregado a favoritos: ${evento.nombre}` : `Quitado de favoritos`);
        renderizarFavoritos();
      });
    });

    seccionFavoritos.appendChild(tarjeta);
  });
}

function agregarNotificacion(texto) {
  notificaciones.unshift(texto);
  notiBadge.textContent = notificaciones.length;
  actualizarNotificaciones();
}

function actualizarNotificaciones() {
  notiMensajes.innerHTML = "";
  notificaciones.slice(0, 5).forEach(mensaje => {
    const div = document.createElement("div");
    div.textContent = mensaje;
    notiMensajes.appendChild(div);
  });
}

function renderizarOrganizadores() {
  const seccion = document.getElementById("seccion-organizadores");
  seccion.innerHTML = "<h1>¿Quiénes organizan?</h1>";

  eventos.forEach(evento => {
    const div = document.createElement("div");
    div.classList.add("organizador-info");

    div.innerHTML = `
      <h3>${evento.nombre}</h3>
      <p><strong>Organizador:</strong> ${evento.organizador}</p>
      <p><strong>Descripción:</strong> ${evento.descripcion}</p>
      <p><strong>Teléfono:</strong> ${evento.telefono}</p>
    `;

    seccion.appendChild(div);
  });
}

function renderizarContacto() {
  const seccion = document.getElementById("seccion-contacto");
  seccion.innerHTML = "<h1>Contáctanos</h1>";

  eventos.forEach(evento => {
    const div = document.createElement("div");
    div.classList.add("contacto-info");

    div.innerHTML = `
      <h3>${evento.nombre}</h3>
      <p><strong>Correo:</strong> ${evento.correo}</p>
      <p><strong>Teléfono:</strong> ${evento.telefono}</p>
    `;

    seccion.appendChild(div);
  });
}

document.querySelectorAll(".menu a").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const targetID = link.dataset.seccion;

    document.querySelectorAll("main > section").forEach(sec => {
      sec.classList.remove("seccion-activa");
      sec.classList.add("seccion-oculta");
    });

    const activa = document.getElementById(targetID);
    activa.classList.remove("seccion-oculta");
    activa.classList.add("seccion-activa");

    if (targetID === "seccion-eventos") renderizarEventos();
    if (targetID === "seccion-favoritos") renderizarFavoritos();
    if (targetID === "seccion-organizadores") renderizarOrganizadores();
    if (targetID === "seccion-contacto") renderizarContacto();
  });
});

filtros.forEach(btn => {
  btn.addEventListener("click", () => {
    filtros.forEach(b => b.classList.remove("filtro-activo"));
    btn.classList.add("filtro-activo");
    renderizarEventos(btn.textContent);
  });
});

buscador.addEventListener("input", () => {
  const filtroActivo = document.querySelector(".filtro-activo").textContent;
  renderizarEventos(filtroActivo);
});

renderizarEventos();
