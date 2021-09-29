import File from "../models/File";

class FilesController {
  async create(req, res) {

    //na desconstrucao, pelo orinalname e filenmae da requisicao 
    //e salvo nas novas variaveis, name e path
    const { originalname: name, filename: path } = req.file;

    const file = await File.create({ name, path });

    res.json(file);
    // res.json(req.file);
    // Retorna um array com o objeto de requisição completo
  }
}

export default new FilesController();
