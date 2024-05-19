import express from 'express';
import dataBase from './database/ormconfig'
import routes from './routes';
import cors from 'cors';
import cookieParser from 'cookie-parser'

const app = express();
const port = process.env.PORT || 3000;

app.use(cookieParser())
app.use(cors({
    origin: ['https://api-render-node-ts.onrender.com', 'http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json());
app.use(routes);

app.listen(port, ()=> {
    console.log(`Server rodando na porta ${port}`);
    console.log(dataBase.isInitialized ? 'Banco ok!' : "Banco carregando!");
})