const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { body, validationResult } = require('express-validator');

const { createEntry, getEntry, removeEntry } = require('./lib/doLib');
const h = require('./lib/helper');
const config = require('../config.json');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

if(h.isDebug()) {
    app.get('/', (req, res) => {
        res.json('API');
    });
}

app.use('/', express.static(path.join(__dirname, '..', 'client', 'build')));


app.post('/v1/new',
    body('password').exists().isString(),
    body('token').exists().isString().custom((input) => {
        return h.base32RegExp.test(input);
    }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ error: errors.array() });
        }
        const { password, token } = req.body;
        const result = await createEntry(password, token);
        res.json(result);
    }
);

app.post('/v1/get',
    body('password').exists().isString(),
    body('id').exists().isString(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ error: errors.array() });
        }
        const { id, password } = req.body;
        const result = await getEntry(id, password);
        res.json(result); 
    }
);

app.post('/v1/remove',
    body('password').exists().isString(),
    body('id').exists().isString(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ error: errors.array() });
        }
        const { id, password } = req.body;
        const result = await removeEntry(id, password);
        res.json(result); 
    }
);


app.listen(config.port, () =>
  console.log(`App listening on port ${config.port}!`),
);