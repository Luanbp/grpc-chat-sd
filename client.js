let grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");
var readline = require("readline");
 
//Read terminal Lines
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
 
//Load the protobuf
var proto = grpc.loadPackageDefinition(
  protoLoader.loadSync(__dirname + '/chat.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  })
);
 
const REMOTE_SERVER = "0.0.0.0:5001";
 
let username;
 
//Criando cliente gRPC
let client = new proto.example.Chat(
  REMOTE_SERVER,
  grpc.credentials.createInsecure()
);
 
//Iniciando fluxo entre servidor e cliente
function startChat() {
  let channel = client.join({ user: username });
 
  channel.on("data", onData);
 
  rl.on("line", function(text) {
    client.send({ user: username, text: text }, res => {});
  });
}
 
//Quando o servidor envia a mensagem
function onData(message) {
  if (message.user == username) {
    return;
  }
  console.log(`${message.user}: ${message.text}`);
}
 
//Pergunta o nome para iniciar o chat
rl.question("Qual o seu nome? ", answer => {
  username = answer;
 
  startChat();
});