import client from '../db/index.js';

const createQuery = (obj) => {
    var keys = Object.keys(obj).filter((k) => {
        return obj[k] !== undefined && obj[k];
    });
    var titles = keys.map((k, index) => {
        return k + ' = $' + (index + 1);
    }).join(', ');
    var values = keys.map((k) => {
        return obj[k];
    });
    return {
        query: titles,
        values: values
    };
}

export const getbooks = async(req, res) => {
    try {
        const response = await client.query('SELECT * FROM books ORDER BY book_id ASC');

        if (response) {
            return res.status(200).json({ status: 'success', data: response.rows });
        }
    } catch (err) {
        console.log(err);
    }
};

export const createbooks = async(req, res) => {
    try {
        const { title, description } = req.body;
        const request = await client.query('INSERT INTO books (title, description)  VALUES ($1, $2) RETURNING *', [title, description]);
        res.json(`New book ${title} has been created with the description ${description}`);
    } catch (error) {
        console.log(error);
    }
};

export const updatebook = async(req, res) => {
    try {
        const { title, description } = req.body;
        const obj = {
            title,
            description
        }
        const { query, values } = createQuery(obj);
        const { id } = req.params
        console.log(query, values)

        await client.query(
            `UPDATE books SET ${query} WHERE book_id = $${values.length + 1}`, [...values, id]);

        const book = await client.query('SELECT * FROM books WHERE book_id = $1', [id]);

        console.log(book.rows);

        let response = ''
        if (title && description) {
            response = "title: ${title} & description: \n" + description
        } else if (title) {
            response = `title: ${title}`
        } else if (description) {
            response = `description: ${description}`
        }

        res.send(`Updated player ${id} with the ${response}`)
            // res.send(`Updated player ${id} with the title: ${title} and description ${description}`);
    } catch (error) {
        console.log(error)
    }
}

export const getbook = async(req, res) => {
    try {
        const { id } = req.params;
        const readbook = await client.query('SELECT * FROM books WHERE book_id = $1', [id]);
        res.send({ data: readbook.rows });
    } catch (error) {
        console.log(error)
    }
}

export const deletebook = async(req, res) => {
    try {
        const { id } = req.params
        const deletebook = await client.query(
            `DELETE FROM books WHERE book_id = $1`, [id]);
        res.send({ data: deletebook.rows })
    } catch (error) {
        console.log(error);
    }
}