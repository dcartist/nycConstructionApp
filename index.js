const app = require('./app');

const port = process.env.PORT || 8080;

app.set('port', port);

app.listen(port, () => {
    console.log(`${port} works`);
    console.log(`http://localhost:${port}/`);
});