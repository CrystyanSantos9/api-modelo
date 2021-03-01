// import { Op } from "sequelize";
import jwt from "jsonwebtoken";
import User from "../models/User";

import authConfig from "../../config/authKey";

class SessionsController {
  async create(req, res) {
    // pegando campos do corpo da requisição
    const { email, password } = req.body;

    // verificando se email passado existe dentro do banco de dados
    const user = await User.findOne({
      where: { email }, // usando o nome da variável como o próprio parâmetro
    });

    // se usuário não encontrado
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // se meu password não dar match
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: "Password not match" });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });

    // return res.status(200).json({ message: "ok" });

    // return res.status(401).json({error: "error test"});
  }
}

export default new SessionsController();

//   //buscando todos os emails
//   const user = await User.findAll({
//     where: {
//                       email: {
//                           [Op.like]: `%${email}%`,
//                       },
//   }
// })
