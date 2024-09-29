// IMPORTAR MÓDULO MYSQL
const mysql = require('mysql2');

// Configuração de conexão
const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin123',
    database: 'projetoEstudoNode'
});

// TESTE DE CONEXÃO
conexao.connect(function(erro){
    if(erro) throw erro;
    console.log('Conexão efetuada com sucesso.');
})

// exportar módulo
module.exports = conexao;