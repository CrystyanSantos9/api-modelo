/* eslint-disable spaced-comment */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
/* eslint-disable no-const-assign */
/* eslint-disable no-unused-vars */
import { parseISO } from "date-fns";
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
  show(req, res) {
    const id = parseInt(req.params.id, 10);
    const customer = customers.find(item => item.id === id);
    const status = customer ? 200 : 404;

    // console.log("GET :: /customers/:id ", customer);

    return res.status(status).json(customer);
  }

  // Cria um novo Customer
  create(req, res) {
    const { name, site } = req.body;
    const id = customers[customers.length - 1].id + 1;

    const newCustomer = { id, name, site };
    customers.push(newCustomer);

    return res.status(201).json(newCustomer);
  }

  // Atualiza um Customer
  update(req, res) {
    const id = parseInt(req.params.id, 10);
    const { name, site } = req.body;

    const index = customers.findIndex(item => item.id === id);
    const status = index >= 0 ? 200 : 404;

    if (index >= 0) {
      customers[index] = { id: parseInt(id, 10), name, site };
    }

    return res.status(status).json(customers[index]);
  }

  // Exclui um Customer
  destroy(req, res) {
    const id = parseInt(req.params.id, 10);
    const index = customers.findIndex(item => item.id === id);
    const status = index >= 0 ? 200 : 404;

    if (index >= 0) {
      customers.splice(index, 1);
    }

    return res.status(status).json();
  }
}

export default new CustomersController();
