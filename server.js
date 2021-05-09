let grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");
 
const server = new grpc.Server();
const SERVER_ADDRESS = "0.0.0.0:5001";
 
// Carregando o protobuf
let proto = grpc.loadPackageDefinition(
  protoLoader.loadSync(__dirname + '/chat.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  })
);
 
let users = [];
 
// Recebendo mensagem da entrada de novo usuário
function join(call, callback) {
  users.push(call);
  notifyChat({ user: "Server", text: "Um novo usuário entrou ..." });
}
 
// Recebendo a mensagem do cliente
function send(call, callback) {
  notifyChat(call.request);
}
 
// Enviando a mensagem para todos os clientes conectados
function notifyChat(message) {
  users.forEach(user => {
    user.write(message);
  });
}
 
// Definindo serviço e metodos para iniciar
server.addService(proto.example.Chat.service, { join: join, send: send });
 
server.bind(SERVER_ADDRESS, grpc.ServerCredentials.createInsecure());
 
server.start();