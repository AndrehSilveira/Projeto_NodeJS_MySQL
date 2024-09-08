// Importar módulo express
const express = require('express');

// IMPORTAR MÓDULO EXPRESS-HANDLEBARS
const { engine } = require('express-handlebars');

// IMPORTAR MÓDULO MYSQL
const mysql = require('mysql2');

// App
const app = express();

// Adicionar Bootstrap
app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'));

// Adicionar CSS referência
app.use('/css', express.static('./css'));

// CONFIGURAÇÃO DO EXPRESS-HANDLEBAR
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Manipulação de dados via rotas
app.use(express.json());
app.use(express.urlencoded({extended:false}));

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

// Rota Principal
app.get('/', (req, res) => {
    res.render('formulario');
});

// Rota de cadastro
app.post('/cadastrar', function(req,res){
    console.log(req.body);
    res.end();
})

// Servidor
app.listen(8080);