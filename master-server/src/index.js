const express = require("express");
const arduino = require("./arduino-comunication");

const fs = require("fs");
const https = require("https");
const cors = require("cors");

const app = express();

console.log();

const options = {
  key: fs.readFileSync("../simulador.codefensory.com/privkey1.pem"),
  cert: fs.readFileSync("../simulador.codefensory.com/cert1.pem"),
};

const server = https.createServer(options, app);

const port = process.env.PORT || 6200;

// allow cross origin requests
app.use(cors({ origin: "*" }));

// serve static files from the public directory
app.use(express.static("public"));

server.listen(6243, () => {
  console.log(`Server https is running on port ${6243}`);
});

// ----------------------------- SOCKET IO -----------------------------------

let states = {
  ESPERA_LOOP: {
    name: "ESPERA_LOOP",
    arduinoCommand: "1",
    next: "EXPLICACION",
  },
  EXPLICACION: {
    name: "EXPLICACION",
    next: "ESPERA_BOTON_INICIO",
  },
  ESPERA_BOTON_INICIO: {
    name: "ESPERA_BOTON_INICIO",
    next: "ELEGIR_FONDO",
  },
  ELEGIR_FONDO: {
    name: "ELEGIR_FONDO",
    next: "TUTORIAL",
  },
  TUTORIAL: {
    name: "TUTORIAL",
    next: "MOVIMIENTO_EXCAVADORA",
  },
  MOVIMIENTO_EXCAVADORA: {
    name: "MOVIMIENTO_EXCAVADORA",
    arduinoCommand: "2",
    next: "CIBER_ATAQUE",
  },
  CIBER_ATAQUE: {
    name: "CIBER_ATAQUE",
    arduinoCommand: "3",
    next: "ESPERA_ACTIVAR_LIMPIEZA",
  },
  ESPERA_ACTIVAR_LIMPIEZA: {
    name: "ESPERA_ACTIVAR_LIMPIEZA",
    next: "LIMPIEZA",
  },
  LIMPIEZA: {
    name: "LIMPIEZA",
    next: "ESPERA_RETOMAR",
  },
  ESPERA_RETOMAR: {
    name: "ESPERA_RETOMAR",
    next: "MOVIMIENTO_EXCAVADORA_FINAL",
  },
  MOVIMIENTO_EXCAVADORA_FINAL: {
    name: "MOVIMIENTO_EXCAVADORA_FINAL",
    arduinoCommand: "4",
    next: "TERMINANDO",
  },
  TERMINANDO: {
    name: "TERMINANDO",
    next: "AGRADECIMIENTO",
  },
  AGRADECIMIENTO: {
    name: "AGRADECIMIENTO",
    next: "ESPERA_LOOP",
  },
};

let currState = states.ESPERA_LOOP;

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

function changeState(state) {
  currState = state;

  io.emit("state", state.name);

  console.log(state);

  if (state.arduinoCommand) {
    arduino.sendCommand(state.arduinoCommand);
  }
}

arduino.on("p", () => {
  console.log("starting simulation");

  changeState(states.EXPLICACION);
});

arduino.on("Sensor 1 triggered", () => {
  console.log("Rele 1");

  changeState(states.CIBER_ATAQUE);
});

arduino.on("Sensor 2 triggered", () => {
  console.log("Rele 2");

  changeState(states.AGRADECIMIENTO);
});

// handle socket connections
io.on("connection", (socket) => {
  console.log("a user connected");

  socket.broadcast.emit("other-user");

  socket.on("webrtc-message", (message) => {
    console.log(
      `webrtc message received (${message.type}), broadcasting to all clients`,
    );

    socket.broadcast.emit("webrtc-message", message);
  });

  socket.on("reset", () => {
    changeState(states.ESPERA_LOOP);
  });

  socket.on("confirm", () => {
    const nextState = states[currState.next];

    changeState(nextState);
  });

  socket.on("move", (key) => {
    arduino.sendCommand(key);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// -----------------------------------------------------------------------------
