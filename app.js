const express = require('express');
const v1Router = require('./router/v1');
const { globalErrorHandler } = require('./helper/errorHandler');
const app = express();
const port = process.env['PORT'] || 9330;
const dotenv = require('dotenv');
dotenv.config();

app.get('/', (req, res) => {
    try {
        res.status(200).send("working fine !...");
    }
    catch (err) {
        res.status(500).send("something went wrong !...");
    }
});

app.use('/api/v1', v1Router);

app.use(globalErrorHandler);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});