const pool = require('../config/db');

const listarUsuarios = async (req, res) => {
    const resultado = await pool.query(
        'SELECT * FROM usuarios ORDER BY id'
    );

    res.json(resultado.rows);
};

const criarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    const resultado = await pool.query(
        `INSERT INTO usuarios
        (nome, email, senha)
        VALUES ($1, $2, $3)
        RETURNING *`,
        [nome, email, senha]
    );

    res.status(201).json(resultado.rows[0]);
};

const atualizarUsuario = async (req, res) => {

    const { id } = req.params;
    const { nome, email, senha } = req.body;

    const resultado = await pool.query(
        `UPDATE usuarios
         SET nome = $1,
             email = $2,
             senha = $3
         WHERE id = $4
         RETURNING *`,
        [nome, email, senha, id]
    );

    res.json(resultado.rows[0]);
};

const excluirUsuario = async (req, res) => {

    const { id } = req.params;

    await pool.query(
        'DELETE FROM usuarios WHERE id = $1',
        [id]
    );

    res.json({
        mensagem: 'Usuário removido'
    });
};

module.exports = {
    listarUsuarios,
    criarUsuario,
    atualizarUsuario,
    excluirUsuario
};