
npm init -y
npm install express cors jsonwebtoken
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const app = express();
const PORT = 3000;
const SECRET = "claveSecreta123"; // firma del token

app.use(cors()); // permite llamadas desde tu HTML local
app.use(express.json());

// -------- LOGIN (JWT) --------
app.post("/login", (req, res) => {
  const { usuario, clave } = req.body;
  if (usuario === "admin" && clave === "1234") {
    const token = jwt.sign({ usuario }, SECRET, { expiresIn: "2h" });
    return res.json({ token });
  }
  res.status(401).json({ message: "Credenciales incorrectas" });
});



// middleware para rutas protegidas
function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// -------- “Base de datos” en archivo --------
const DB_FILE = "./db.json";
function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ juicios: [] }, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_FILE));
}
function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// -------- CRUD de juicios (protegido) --------
app.get("/juicios", authMiddleware, (req, res) => {
  const db = readDB();
  res.json(db.juicios);
});

app.post("/juicios", authMiddleware, (req, res) => {
  const db = readDB();
  const newJuicio = { id: Date.now(), ...req.body };
  db.juicios.push(newJuicio);
  saveDB(db);
  res.json(newJuicio);
});

app.put("/juicios/:id", authMiddleware, (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  const ix = db.juicios.findIndex(j => j.id === id);
  if (ix === -1) return res.sendStatus(404);
  db.juicios[ix] = { id, ...req.body };
  saveDB(db);
  res.json(db.juicios[ix]);
});

app.delete("/juicios/:id", authMiddleware, (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  db.juicios = db.juicios.filter(j => j.id !== id);
  saveDB(db);
  res.json({ message: "Juicio eliminado" });
});

// ruta de prueba
app.get("/", (_req, res) => {
  res.send("✅ Backend ABOGAPP funcionando");
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});

