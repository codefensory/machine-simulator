const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

const comPort = new SerialPort({ baudRate: 9600, path: process.argv[2] });

const parser = comPort.pipe(new ReadlineParser({ delimiter: "\n" }));

comPort.on("open", () => {
  console.log("simulator arduino serial port open");
});

parser.on("data", (data) => {
  console.log("> ", data);

  comPort.write("[R]" + data + "\n");
});
