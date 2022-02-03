// import "dotenv/config";

module.exports = {
  dialect: 'mysql',
  host: process.env.NODE_ENV==='production' ? process.env.DB_HOST : '192.168.1.110',
  username: process.env.NODE_ENV==='production' ? process.env.DB_USER :  'root',
  password: process.env.NODE_ENV==='production' ? process.env.DB_PASS: 'senha',
  database: process.env.NODE_ENV==='production' ? process.env.DB_NAME: 'teste',
  define: {
    timestamp: true, // cria duas colunas: createdAt e updatedAt
    underscored: true,
    underscoredAll: true,
  },
};
