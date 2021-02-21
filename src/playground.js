// /* eslint-disable no-unused-vars */
// import { Op } from "sequelize";

// import "./database";

// import Customer from "./app/models/Customer";
// import Contact from "./app/models/Contact";

// class Playground {
//   static async play() {
//     const customer = await Customer.create({
//       name: "Gabriel Santos",
//       email: "goobiel@hotmai.com",
//     });

//     console.log(JSON.stringify(customer, null, 2));

//     // const customer = await Customer.findByPk(24);

//     // //excluíndo registro
//     // customer.destroy();

//     // //recuperando objeto procurado
//     // const customer = await Customer.findByPk(1);
//     // console.log("Antes do update", JSON.stringify( customer, null, 2));

//     // //atualizando informações através dos campos como argumentos
//     // const newCustomer = await customer.update({status: "ARCHIVED"});
//     // console.log("Depois do update", JSON.stringify( newCustomer, null, 2));

//     // const customer = await Customer.create({
//     // //     name: "Daniela Santos",
//     // //     email: "dani_caaa@google.com"
//     // // });

//     // const customers3 = await Customer.scope([
//     //     ["active"], //não é ffunção, portanto deve ser passado somente como array
//     //     {method: ["created", new Date(2021, 0, 1)]},
//     // ]).findAll();

//     // const customers3 = await Customer.scope(["active", "name"]).findAll()

//     // const customers3 = await Customer.scope({method: ["created", (new Date(2021, 0, 1))]}).findAll()

//     //     const customers1 = await Customer.sum("id",{
//     //         where: {status: "ACTIVE"},
//     //     })

//     // const customers2 = await Customer.findAll({
//     //    // attributes: { exclude: ["status"]},
//     //    include: [
//     //        {
//     //         model: Contact,
//     //         where: {
//     //             status: "ACTIVE",
//     //         },
//     //         required: false,
//     //     }
//     // ],
//     //     where: {
//     //         [Op.or]: {

//     //             status: {
//     //                 [Op.in] :  ["ACTIVE", "ARCHIVED"],
//     //             },
//     //             name: {
//     //                 [Op.like]: "Fer%",
//     //             },
//     //         },

//     //        createdAt: {
//     //            [Op.between]: [new Date(2021, 0, 1) ,  new Date()]
//     //        },
//     //     },
//     //     order:[["name", "DESC"], ["createdAt"]] ,
//     //     limit:2,
//     //     offset: 2 * 3 - 2,

//     // })

//     // //const customers = await Customer.findByPk(1);

//     // //const customers = await Customer.findOne({
//     //         // attributes: { exclude: ["status", "id"]}
//     // // const customers = await Customer.findAll({
//     //     //     attributes: { exclude: ["status"]},

//     //    console.log(JSON.stringify(customers1, null, 2))
//     //    console.log(JSON.stringify(customer, null, 2));
//   }
// }

// Playground.play();
