import jwt from "jsonwebtoken";
import { promisify } from "util";
import authConfig from "../../config/authKey";

export default async (req, res, next) => {
  const authHeather = req.headers.authorization;
  // Validar a existência do header de autorização
  if (!authHeather) {
    return res.status(401).json({ erro: "Token is not provided" });
  }

  // recupear valor do token

  // Vem no formato
  // Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiaWF0IjoxNjE0MTkzNDkzLCJleHAiOjE2MTQ3OTgyOTN9.h-8MfAqD7jItTz0VU_jvrllFGJU2twVX11NBqs3V3Po

  const [, token] = authHeather.split(" ");

  console.log(token);

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    // acrescentando propriedade userId no objeto req
    req.userId = decoded.id;

    // console.log(decoded);

    next();
  } catch (error) {
    return res.status(401).json({ erro: "Token invalid." });
  }

  // if (authHeather && authHeather === "secret") {
  //   return next();
  // }

  // return res
  //   .status(401)
  //   .json({ erro: "User not allowed to access this resource." });
};
