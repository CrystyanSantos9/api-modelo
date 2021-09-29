import express from "express";
// import authMiddleware from "./app/middlewares/auth";
import routes from "./routes";

import "./database";

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  //pondo as regras no método de checagem de requisição
  middlewares() {
    this.server.use(express.json());
    //usado para fazer o reconhecimento do tipo de objeto solicitado e recebido
    //durante requisições do tipo PUT e POST como string ou matrizes. 
    this.server.use(express.urlencoded({ extended: false }));
    // this.server.use(authMiddleware);
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
