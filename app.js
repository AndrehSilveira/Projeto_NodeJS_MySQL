// Importar módulo express
const express = require('express');

// Importar módulo de conexão com o banco mysql
const conexao = require('./BD/conexao_mysql')

// Importar módulo fileupload
const fileupload = require('express-fileupload')

// IMPORTAR MÓDULO EXPRESS-HANDLEBARS
const { engine } = require('express-handlebars');


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
app.engine('handlebars', engine({
    helpers: {
      // Função auxiliar para verificar igualdade
      condicionalIgualdade: function (parametro1, parametro2, options) {
        return parametro1 === parametro2 ? options.fn(this) : options.inverse(this);
      }
    }
  }));
app.set('view engine', 'handlebars');
app.set('views', './views');

// Manipulação de dados via rotas
app.use(express.json());
app.use(express.urlencoded({extended:false}));



// Rota Principal
app.get('/', (req, res) => {
    res.render('formulario');
});

// Rota Principal contendo a situação
app.get('/:situacao', (req, res) => {
    res.render('formulario', {situacao:req.params.situacao});
});


//Rota de listagem
app.get('/listar/:categoria', (req, res) => {
    // Obter categoria
    let categoria = req.params.categoria;

    // SQL
    let sql = '';

    if(categoria == 'todos'){
        sql = 'SELECT * FROM produtos';
    }else{
        sql = `SELECT * FROM produtos WHERE categoria = '${categoria}'`;
    }

    // Executar comando SQL
    conexao.query(sql, (erro, retorno) => {
        res.render('lista', {produtos:retorno});
    });
});

// Rota de pesquisa
app.post('/pesquisa', (req, res) => {
    // obter o termo pesquisado
    let termo = req.body.termo;

    // SQL
    let sql = `SELECT * FROM produtos WHERE nome LIKE '%${termo}%'`;

    // executar comando sql
    conexao.query(sql, (erro, retorno) => {

        let semRegistros = retorno.length == 0 ? true : false;


        res.render('lista', {produtos:retorno, semRegistros:semRegistros});
    });
});

// Rota de cadastro
app.post('/cadastrar', function(req,res){
    try{
        // Obter os dados que serão utilizados para o cadastro
        let nome = req.body.nome;
        let valor = req.body.valor;
        let categoria = req.body.categoria;
        let imagem = req.files.imagem.name;

        //Validar o nome do produto e o valor
        if(nome == '' || valor == '' || isNaN(valor) || categoria == ''){
            res.redirect('/falhaCadastro');
        }
        else{
            // SQL
            let sql = `INSERT INTO produtos (nome, valor, imagem, categoria) VALUES ('${nome}', ${valor}, '${imagem}', '${categoria}')`;
            // Executar o comando SQL
            conexao.query(sql, function(erro, retorno){
                // caso ocorra algum erro
                if(erro) throw erro;
    
                // Caso o cadastro seja feito com sucesso
                req.files.imagem.mv(__dirname + '/imagens/' + req.files.imagem.name);
                console.log(retorno);
                res.end();
            });
        }
        //Retornar para a rota principal
        res.redirect('/okCadastro');
    }
    catch(erro){
        res.redirect('/falhaCadastro')
    }
})

//Rota para remover produtos
app.get('/remover/:codigo&:imagem', function(req, res){
    // TRATAMENTO DE EXCEÇÃO
    try{
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
    res.redirect('/okRemover');
    }catch(erro){
        re.redirect('/falhaRemover');
    }
})

// Rota para redirecionar para o formulário de alteração / edição
app.get('/formularioEditar/:codigo', function(req, res){
    
    // SQL
    let sql = `SELECT * FROM produtos WHERE codigo = ${req.params.codigo}`;

    // EXECUTAR O COMANDO SQL
    conexao.query(sql, function(erro, retorno){
        //CASO HAJA FALHA NO COMANDO SQL
        if(erro) throw erro;

        // CASO CONSIGA EXECUTAR O COMANDO SQL
        res.render('formularioEditar', {produto:retorno[0]});
    });
});

// ROTA PARA EDITAR PRODUTOS
app.post('/editar', function(req, res){

    //OBTER OS DADOS DO FORMULÁRIO
    let nome = req.body.nome;
    let valor = req.body.valor;
    let codigo = req.body.codigo;
    let nomeImagem = req.body.nomeImagem;

    // VALIDAR NOME DO PRODUTO E VALOR
    if(nome == '' || valor == '' || isNaN(valor)){
        res.redirect('/falhaEdicao');
    }else{
        // DEFINIR O TIPO DE EDIÇÃO
    try{
        // OBJETO DE IMAGEM
        let imagem = req.files.imagem;

        // SQL
        let sql = `UPDATE produtos SET nome = '${nome}', valor=${valor}, imagem='${imagem.name}' WHERE codigo=${codigo}`;

        // EXECUTAR COMANDO SQL
        conexao.query(sql, function(erro, retorno){
            // CASO FALHE O COMANDO SQL
            if(erro) throw erro;

            //REMOVER IMAGEM ANTIGA
            fs.unlink(__dirname+'/imagens/'+nomeImagem, (erro_imagem) => {
                console.log('Falha ao remover a imagem');
            });

            //CADASTRAR NOVA IMAGEM
            imagem.mv(__dirname+'/imagens/'+imagem.name);

        });
    }catch{
        let sql = `UPDATE produtos SET nome = '${nome}', valor=${valor} WHERE codigo=${codigo}`;

        //EXECUTAR COMANDO SQL
        conexao.query(sql,function(erro, retorno){
            //CASO FALHE O COMANDO SQL
            if(erro) throw erro;
        });
    }
    
    // REDIRECIONAMENTO PARA A RAIZ
    res.redirect('/okEdicao');
    }
});

// Servidor
app.listen(8080);