/* eslint-disable spaced-comment */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
/* eslint-disable no-const-assign */
/* eslint-disable no-unused-vars */
import { parseISO } from "date-fns";
import * as Yup from "yup";
import { Op } from "sequelize";
import Mail from "../../lib/Mail";

import User from "../models/User";

class ContactsController {
  // Listagem dos Customers

  //routes.get("/customers", customers.index);
  async index(req, res) {
    const {
      name,
      email,
      file_id,
      createdBefore,
      createdAfter,
      updatedBefore,
      updatedAfter,
      sort,
    } = req.query;

    const page = req.query.page || 1; // se não passar valor na query, o valor será 1 página
    const limit = req.query.limit || 25; // se não pssar valor na query, o valor será 25 registros

    let where = {};
    let order = [];

    if (name) {
      where = {
        ...where, // campo que será concatenado (spread operator)
        name: {
          // valor capturado do where via spread operator
          [Op.iLike]: name, // capturando valor
        },
      };
    }

    if (email) {
      where = {
        ...where, // campo que será concatenado (spread operator)
        email: {
          // valor capturado do where via spread operator
          [Op.iLike]: email, // capturando valor
        },
      };
    }

    if (createdBefore) {
      where = {
        ...where, // campo que será concatenado (spread operator)
        createdAt: {
          // valor capturado do where via spread operator
          [Op.gte]: parseISO(createdBefore), // ler data e transforma em objetos Date()
        },
      };
    }

    if (createdAfter) {
      where = {
        ...where, // campo que será concatenado (spread operator)
        createdAt: {
          // valor capturado do where via spread operator
          [Op.lte]: parseISO(createdAfter), // ler data e transforma em objetos Date()
        },
      };
    }

    if (updatedBefore) {
      where = {
        ...where, // campo que será concatenado (spread operator)
        updatedAt: {
          // valor capturado do where via spread operator
          [Op.gte]: parseISO(updatedBefore), // ler data e transforma em objetos Date()
        },
      };
    }

    if (updatedAfter) {
      where = {
        ...where, // campo que será concatenado (spread operator)
        updatedAt: {
          // valor capturado do where via spread operator
          [Op.lte]: parseISO(updatedAfter), // ler data e transforma em objetos Date()
        },
      };
    }

    // usando sort - ordenação
    // localhost:3000/customers?sort=name,email || sort=id:desc(contrário), name
    // lembrando ordenação do sequelize que funciona assim => order(objeto): ["name"(campo), "asc"(valor)]
    // por isso usamos o split dentro do map para pegar o valor => ["id", "desc"]  e também criar multiplos arrays
    // order: [["name", "asc"], ["email", "desc"]]
    if (sort) {
      order = sort.split(",").map(item => item.split(":"));
    }

    const data = await User.findAll({
      //tirando atributos de exibição
      attributes: { exclude: ["password", "password_hash", "fileId"] },
      where,
      order,
      limit,
      offset: limit * page - limit, //25 * 10 - 25
    });

    console.log({ userId: req.userId });
    console.log(await User.findByPk(req.userId));

    // console.log(where);

    return res.json(data);
  }

  // Recuperando um usuário
  async show(req, res) {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password", "password_hash"] },
    });

    if (!user) {
      return res.status(404).json();
    }

    const { id, name, email, createdAt, updatedAt } = user;

    return res.json({ id, name, email, createdAt, updatedAt });
  }

  // Cria um novo Contact
  async create(req, res) {
    //schema
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(8),
      passwordConfirmation: Yup.string().when("password", (password, field) =>
        //verifica se password foi preenchido, se não retorna o mesmo campo
        password ? field.required().oneOf([Yup.ref("password")]) : field
      ),
    });

    //Validando o schema
    //como trabalha com promisses, é necessário encapsular o seu retorno (schema check)
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Error on validate schema." });
    }

    //se schema válido, passa if e vamos para o create
    const {
      id,
      name,
      email,
      file_id,
      createdAt,
      updatedAt,
    } = await User.create(req.body);

    Mail.send({
      to: email,
      subject: "Bem vindo(a) ",
      text: `Olá ${name}, seja bem-vindo(a) ao nosso sistema.`,
    });

    return res.status(201).json({ id, name, email, createdAt, updatedAt });
  }

  // Atualiza um Customer
  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(8),
      password: Yup.string()
        .min(8)
        .when("oldPassword", (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      passwordConfirmation: Yup.string().when("password", (password, field) =>
        //verifica se password foi preenchido, se não retorna o mesmo campo
        password ? field.required().oneOf([Yup.ref("password")]) : field
      ),
    });

    //Validando o schema
    //como trabalha com promisses, é necessário encapsular o seu retorno (schema check)
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Error on validate schema." });
    }

    //recuperar user de acordo com id passado
    const user = await User.findByPk(req.params.id);

    //se user não existir
    if (!user) {
      return res.status(404).json();
    }

    //checando se o password é válido
    const { oldPassword } = req.body;

    //se old password existir e o check não conferir --> retorna erro
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: "User password not match." });
    }

    //realizando atualização
    const {
      id,
      name,
      email,
      file_id,
      createdAt,
      updatedAt,
    } = await user.update(req.body);

    return res
      .status(201)
      .json({ id, name, email, file_id, createdAt, updatedAt });
  }

  // Exclui um Contact
  async destroy(req, res) {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json();
    }

    await user.destroy();

    return res.json();
  }
}

export default new ContactsController();
