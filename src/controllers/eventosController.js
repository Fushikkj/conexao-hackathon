const pool = require('../config/db');

const listarEventos = async (req, res) => {
    try {
        const resultado = await pool.query(
            'SELECT * FROM eventos ORDER BY id'
        );

        res.json(resultado.rows);

    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            erro: 'Erro ao buscar eventos'
        });
    }
};

module.exports = {
    listarEventos
};