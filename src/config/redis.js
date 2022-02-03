import "dotenv/config"

export default {
    host: process.env.NODE_ENV==='production' ? process.env.REDIS_HOST: 'localhost',
    port: process.env.REDIS_PORT,
}