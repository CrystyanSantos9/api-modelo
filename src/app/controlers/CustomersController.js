/* eslint-disable spaced-comment */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
/* eslint-disable no-const-assign */
/* eslint-disable no-unused-vars */
import { parseISO } from "date-fns";
import * as Yup from "yup";
import { Op } from "sequelize";
import Contact from "../models/Contact";
import Customer from "../models/Customer";

class CustomersController {
  // Listagem dos Customers

  //routes.get("/customers", customers.index);
  async index(req, res) {
    const {
      name,
      email,
      status,
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

    // In aceita --> [Op.in]: ["ACTIVE", "ARCHIVED"], array que possuem o valor de busca
    // vamos explodir o valor passado pela query
    // localhost:3000/customers?status=active, archived (vai ser passado como uma única stringa separado por virgula)
    // para pegarmos os valores como únicos, usamos o .split( , ) => ["active" , "archived"]
    // e passamos para maísculo através do map para respeitar o case Sensitve dos enumerados do postgres
    if (status) {
      where = {
        ...where, // campo que será concatenado (spread operator)
        status: {
          // valor capturado do where via spread operator
          [Op.in]: status.split(",").map(item => item.toUpperCase()), // capturando valor, dividndo em valores únicos, tornando-os em maísculos
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

    const data = await Customer.findAll({
      where,
      include: [
        {
          model: Contact,
          attributes: ["id", "status"],
        },
      ],
      order,
      limit,
      offset: limit * page - limit, //25 * 10 - 25
    });

    console.log(where);

    return res.json(data);
  }

  // Recupera um Customer
  async show(req, res) {
    //localhost:3000/customers/:id --> responde a essa rota
    const customer = await Customer.findByPk(req.params.id);

    if (!customer) {
      return res.status(404).json();
    }

    return res.json(customer);
  }

  // Cria um novo Customer
  async create(req, res) {
    //schema
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      status: Yup.string().uppercase(),
    });

    //Validando o schema
    //como trabalha com promisses, é necessário encapsular o seu retorno (schema check)
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Error on validate schema." });
    }

    //se schema válido, passa if e vamos para o create

    //recebemos todos os registros do req.body
    const customer = await Customer.create(req.body);

    return res.status(201).json(customer);
  }

  // Atualiza um Customer
  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      status: Yup.string().uppercase(),
    });

    //Validando o schema
    //como trabalha com promisses, é necessário encapsular o seu retorno (schema check)
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Error on validate schema." });
    }

    //recuperar customer de acordo com id passado
    const customer = await Customer.findByPk(req.params.id);

    //se costumer não existir
    if (!customer) {
      return res.status(404).json();
    }

    //realizando atualização
    await customer.update(req.body);

    return res.json(customer);
  }

  // Exclui um Customer
  async destroy(req, res) {
    //recuperando customer através do id passado
    const customer = await Customer.findByPk(req.params.id);

    //verifico se existe no banco
    if (!customer) {
      return res.status(404).json();
    }

    await customer.destroy();

    return res.json();
  }
}

export default new CustomersController();
