// index.js
const express = require('express');
const bodyParser = require('body-parser');
const productRouter = require('./routes/product');
const categoryRouter = require('./routes/category');

const app = express();

app.use(bodyParser.json());
app.use('/products', productRouter);
app.use('/categories', categoryRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
