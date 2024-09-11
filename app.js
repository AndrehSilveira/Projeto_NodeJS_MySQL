// Importar módulo express
const express = require('express');

// Importar módulo fileupload
const fileupload = require('express-fileupload')

// IMPORTAR MÓDULO EXPRESS-HANDLEBARS
const { engine } = require('express-handlebars');

// IMPORTAR MÓDULO MYSQL
const mysql = require('mysql2');

// File Systems
const fs = require('fs');

// App
const app = express();

// Habilitando o upload de arquivos
app.use(fileupload());

// Adicionar Bootstrap
app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'));

// Adicionar CSS referência
app.use('/css', express.static('./css'));

// Referenciar a pasta de imagens
app.use('/imagens', express.static('./imagens'));

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
    // SQL
    let sql = "select * from produtos";

    // executar o SQL
    conexao.query(sql, function(erro, retorno){
        res.render('formulario', {produtos:retorno});
    })
});

// Rota de cadastro
app.post('/cadastrar', function(req,res){
    // Obter os dados que serão utilizados para o cadastro
    let nome = req.body.nome;
    let valor = req.body.valor;
    let imagem = req.files.imagem.name;

    // SQL
    let sql = `INSERT INTO produtos (nome, valor, imagem) VALUES ('${nome}', ${valor}, '${imagem}')`;

    // Executar o comando SQL
    conexao.query(sql, function(erro, retorno){
        // caso ocorra algum erro
        if(erro) throw erro;

        // Caso o cadastro seja feito com sucesso
        req.files.imagem.mv(__dirname + '/imagens/' + req.files.imagem.name);
        console.log(retorno);
        res.end();
    });

    //Retornar para a rota principal
    res.redirect('/');
    
})

//Rota para remover produtos
app.get('/remover/:codigo&:imagem', function(req, res){
    // SQL
    let sql = `delete from produtos where codigo = ${req.params.codigo}`;

    // Executar o comando SQL
    conexao.query(sql, function(erro, retorno){
        // Caso falhe o comando SQL
        if(erro) throw erro;

        // Caso o comando SQL funcione
        fs.unlink(__dirname+'/imagens/'+req.params.imagem, (erro_imagem) => {
            if(erro_imagem){
                console.log('Falha ao remover a imagem');  
                return;
            }
            console.log('Arquivo excluído com sucesso!');
        });
    });

    // Redirecionamento
    res.redirect('/');
})

// Rota para redirecionar para o formulário de alteração / edição
app.get('/formularioEditar/:codigo', function(req, res){
    res.render('formularioEditar');
});

// Servidor
app.listen(8080);