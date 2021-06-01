import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import client from './db/index.js';
import { getbooks, createbooks, updatebook, getbook, deletebook } from './routes/index.js';

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

client.connect();

app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'BOOKSTORE API',
    });
});


//create
app.post('/books', createbooks)

//read all books
app.get('/books', getbooks);

//read a specific book
app.get('/books/:id', getbook);

//update
app.patch('/books/:id', updatebook);
//delete
app.delete('/books/:id', deletebook);

app.listen(port, () => {
    console.log(`Server connected at  http://localhost:${port}`);
});