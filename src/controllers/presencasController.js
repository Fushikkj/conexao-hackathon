const pool = require('../config/db');

const marcarPresenca = async (req, res) => {
    try {

        const { usuario_id, evento_id } = req.body;

        const resultado = await pool.query(
            `INSERT INTO presencas
            (usuario_id, evento_id)
            VALUES ($1, $2)
            RETURNING *`,
            [usuario_id, evento_id]
        );

        res.status(201).json(resultado.rows[0]);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao marcar presença'
        });
    }
};

module.exports = {
    marcarPresenca
};