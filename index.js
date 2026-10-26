require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Estudiante } = require("./models");
const app = express();
app.use(cors());
app.use(express.json());
app.get("/ping", (req, res) => res.send("pong"));
app.post("/auth/register", async (req, res) => {
  const { nombre, correo, password, programa, semestre } = req.body;
  if (!correo || !password || !nombre)
    return res
      .status(400)
      .json({ success: false, error: "Campos obligatorios" });
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const nuevo = await Estudiante.create({
      nombre,
      correo,
      passwordHash,
      programa: programa || "Ingenieria",
      semestre: semestre || 1,
      promedio: 0.0,
    });
    return res
      .status(201)
      .json({ success: true, data: { id: nuevo.id, correo: nuevo.correo } });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});
app.post("/auth/login", async (req, res) => {
  const { correo, password } = req.body;
  if (!correo || !password)
    return res
      .status(400)
      .json({ success: false, error: "Campos obligatorios" });
  try {
    const estudiante = await Estudiante.findOne({ where: { correo } });
    if (!estudiante)
      return res
        .status(401)
        .json({ success: false, error: "Credenciales invalidas" });
    const ok = await bcrypt.compare(password, estudiante.passwordHash);
    if (!ok)
      return res
        .status(401)
        .json({ success: false, error: "Credenciales invalidas" });
    const user = {
      id: estudiante.id,
      nombre: estudiante.nombre,
      correo: estudiante.correo,
      promedio: estudiante.promedio,
    };
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "8h" });
    return res.json({ success: true, data: { token, usuario: user } });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log("Servidor TdeIA corriendo en puerto " + PORT),
);
