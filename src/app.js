import "dotenv/config";

import express from "express";
import "express-async-errors";
import Youch from "youch";
import cors from "cors";

// import authMiddleware from "./app/middlewares/auth";
import routes from "./routes";


import "./database";

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  //pondo as regras no método de checagem de requisição
  middlewares() {
    this.server.use(express.json());

    this.server.use(cors())
    //ver isso depois 
    // this.server.use(cors({
    //     origin: (origin, callback) => {
    //         if(origin === 'http://localhost:3000'){
    //             callback(null, true)
    //         }else{
    //             callback(new Error('Not allowed by cors'))
    //         }
    //     }
    // }));
    //usado para fazer o reconhecimento do tipo de objeto solicitado e recebido
    //durante requisições do tipo PUT e POST como string ou matrizes. 
    this.server.use(express.urlencoded({ extended: false }));
    // this.server.use(authMiddleware);
  }

  routes() {
    this.server.use(routes);
  }

  exceptionHandler(){
    this.server.use(async (err, req, res, next)=>{
      if(process.env.NODE_ENV === "development" ){
        const erros = await new Youch(err, req).toJSON();
        return res.status(500).json(erros);
      }

      return res.status(500).json({error: "Internal server error"});
    })
  }
}

export default new App().server;
