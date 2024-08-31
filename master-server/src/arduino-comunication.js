const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

const events = [];

const comPort = new SerialPort({ baudRate: 115200, path: process.argv[2] });

const parser = comPort.pipe(new ReadlineParser({ delimiter: "\n" })); // Read the port data

let pendingCommand = "";

let attempts = 0;

function on(event, callback) {
  events.push({ event, callback });
}

function emit(event, data) {
  events.forEach((event) => {
    if (event.event === event) {
      event.callback(data);
    }
  });
}

comPort.on("open", () => {
  console.log("serial port open");
});

parser.on("data", (data) => {
  console.log("arduino without filters > ", data);

  // if (data.startsWith("[E]")) {
  //   const command = data.slice(3);

  //   console.log("arduino >", data, "resend event");

  //   sendCommand(command);

  //   return;
  // }

  // if (data.startsWith("[R]") && pendingCommand !== "") {
  //   const command = data.slice(3);

  //   if (command === pendingCommand) {
  //     pendingCommand = "";

  //     attempts = 0;

  //     console.log("arduino >", data, "response");

  //     return;
  //   }

  //   if (attempts >= 3) {
  //     attempts = 0;

  //     pendingCommand = "";

  //     return;
  //   }

  //   sendCommand(pendingCommand);

  //   attempts++;

  //   console.log("arduino >", data, "retring");

    // return;
  }

  const sendEvent = events.find((event) => event.event === data);

  if (sendEvent) {
    sendEvent.callback(data);
  }
});

function sendCommand(command) {
  if (command.length === 0) {
    return;
  }

  comPort.write(command + "\n");

  pendingCommand = command;

  attempts = 0;
}

module.exports = {
  sendCommand,
  on,
};
