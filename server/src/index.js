const colors = require('colors');
const app = require('./app');

const port = process.env.API_PORT || 5000;

app.listen(port, () => {
  console.log(colors.bgYellow(`Listening: http://localhost:${port}`));
});
