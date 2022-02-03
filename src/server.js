import app from "./app";
const port = process.env.NODE_ENV==='production' ? process.env.PORT : '4000'
app.listen(port);
