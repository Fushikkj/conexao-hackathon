const express = require('express');
const cors = require('cors');
const path = require('path');

const eventosRoutes = require('./src/routes/eventos');
const presencasRoutes = require('./src/routes/presencas');
const usuariosRoutes = require('./src/routes/usuarios');

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static('public'));

app.use('/eventos', eventosRoutes);
app.use('/presencas', presencasRoutes);
app.use('/usuarios', usuariosRoutes);

app.get('/', (req, res) => {
    res.sendFile(
        path.join(__dirname, 'public', 'marcar.html')
    );
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});