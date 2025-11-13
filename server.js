import express from "express";
import cors from "cors";
import connection from "./db.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const PORT = 3000;


app.post("/api/alumnos", (req, res) => {
    const { nombre, edad, curso } = req.body;
    const query = "INSERT INTO alumnos (nombre, edad, curso) VALUES (?, ?, ?)";
    connection.query(query, [nombre, edad, curso], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Alumno insertado correctamente', id: results.insertId });
    });  
});

app.get("/api/alumnos", (req, res) => {
    connection.query("SELECT * FROM alumnos", (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

// 🔸 Eliminar alumno (versión modificada)
app.delete("/api/alumnos/:id", (req, res) => {
  const alumnoID = req.params.id;
  const sqlDelete = "DELETE FROM alumnos WHERE id = ?";

  connection.query(sqlDelete, [alumnoID], (error, resultado) => {
    if (error) {
      return res.status(500).json({ mensaje: "Error al eliminar", detalle: error });
    }

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: "No se encontró el alumno solicitado" });
    }

    res.status(200).json({ mensaje: "Registro eliminado con éxito" });
  });
});


// 🔸 Actualizar alumno (versión modificada)
app.put("/api/alumnos/:id", (req, res) => {
  const alumnoID = req.params.id;
  const datos = req.body;

  if (!datos.nombre || !datos.edad) {
    return res.status(400).json({ mensaje: "Nombre y edad son campos obligatorios" });
  }

  const sqlUpdate = `
    UPDATE alumnos 
    SET nombre = ?, edad = ?, curso = ? 
    WHERE id = ?`;

  const valores = [datos.nombre, datos.edad, datos.curso, alumnoID];

  connection.query(sqlUpdate, valores, (error, resultado) => {
    if (error) {
      return res.status(500).json({ mensaje: "Error al actualizar", detalle: error });
    }

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Alumno no encontrado para actualizar" });
    }

    res.json({ mensaje: "Datos del alumno modificados correctamente" });
  });
});




app.listen(PORT, () => {
console.log(`Servidor corriendo en http://localhost:${PORT}`);
});