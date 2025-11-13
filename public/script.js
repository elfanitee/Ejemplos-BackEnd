const API_URL = "http://localhost:3000/api/alumnos";
const form = document.getElementById("alumnoForm");
const tabla = document.querySelector("#tablaAlumnos tbody");

// 🔹 Cargar alumnos al iniciar la página
document.addEventListener("DOMContentLoaded", obtenerAlumnos);

// 🔹 Manejar envío del formulario
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const edad = document.getElementById("edad").value.trim();
  const curso = document.getElementById("curso").value.trim();

  if (!nombre || !edad) {
    alert("Por favor ingresa nombre y edad.");
    return;
  }

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, edad, curso })
    });

    const data = await res.json();
    if (res.ok) {
      alert("Alumno agregado correctamente");
      form.reset();
      obtenerAlumnos();
    } else {
      alert("Error: " + data.error);
    }
  } catch (err) {
    console.error(err);
    alert("Error de conexión con el servidor");
  }
});

// 🔹 Función para obtener lista de alumnos (GET)
async function obtenerAlumnos() {
  try {
    const res = await fetch(API_URL);
    const alumnos = await res.json();
    tabla.innerHTML = "";

    alumnos.forEach(a => {
      const fila = `
        <tr>
          <td>${a.id}</td>
          <td>${a.nombre}</td>
          <td>${a.edad}</td>
          <td>${a.curso ?? ""}</td>
          <td>
            <button class="btn btn-warning btn-sm" onclick="borrarAlumno(${a.id})">
              Eliminar
            </button>
            <button class="btn btn-info btn-sm text-white" onclick="editarAlumno(${a.id})">
              Actualizar
            </button>
          </td>
        </tr>`;
      tabla.insertAdjacentHTML("beforeend", fila);
    });
  } catch (err) {
    console.error(err);
    tabla.innerHTML = "<tr><td colspan='5'>Error al cargar los alumnos.</td></tr>";
  }
}

//  Eliminar alumno (versión modificada)
async function borrarAlumno(idAlumno) {
  const confirmar = confirm("¿Deseas eliminar este registro?");
  if (!confirmar) return;

  try {
// DELETE
const respuesta = await fetch(`${API_URL}/${idAlumno}`, { method: "DELETE" });
    const resultado = await respuesta.json();

    if (respuesta.ok) {
      alert(resultado.mensaje || "Alumno borrado exitosamente");
      obtenerAlumnos();
    } else {
      alert("No se pudo eliminar: " + (resultado.mensaje || "Error desconocido"));
    }
  } catch (error) {
    console.error("Fallo al borrar alumno:", error);
    alert("Hubo un problema al intentar eliminar al alumno");
  }
}

let idActual = null;

async function editarAlumno(id) {
  idActual = id;
  document.getElementById("modalEditar").style.display = "flex";
}

document.getElementById("guardarCambios").addEventListener("click", async () => {
  const nombre = document.getElementById("editNombre").value.trim();
  const edad = document.getElementById("editEdad").value.trim();
  const curso = document.getElementById("editCurso").value.trim();

  if (!nombre || !edad) {
    alert("Nombre y edad son obligatorios");
    return;
  }

  try {
    // PUT
const res = await fetch(`${API_URL}/${idActual}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ nombre, edad, curso })
});

    const data = await res.json();

    if (res.ok) {
      alert(data.mensaje || "Alumno actualizado correctamente");
      obtenerAlumnos();
    } else {
      alert("Error: " + data.mensaje);
    }
  } catch (err) {
    console.error(err);
    alert("Error al actualizar");
  }

  document.getElementById("modalEditar").style.display = "none";
});

document.getElementById("cancelarEdicion").addEventListener("click", () => {
  document.getElementById("modalEditar").style.display = "none";
});