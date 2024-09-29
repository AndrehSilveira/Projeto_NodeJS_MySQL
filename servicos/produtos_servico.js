//ESTRUTURA DO MÓDULO DE SERVIÇOS

// Importar o módulo de conexão com banco MySQL
const conexao = require('../bd/conexao_mysql');

// Importar o módulo file system
const fs = require('fs');

// Função para exibir o formulário para cadastro de produtos
function formularioCadastro(req, res){
    res.render('formulario');
}

// Função para exibir o formulário para cadastro de produtos e a situação
function formularioCadastroComSituacao(req, res){
    res.render('formulario', {situacao:req.params.situacao});
}

// Função para exibir o formulário para edição de produtos
function formularioEditar(req, res){
    // SQL
    let sql = `SELECT * FROM produtos WHERE codigo = ${req.params.codigo}`;

    // EXECUTAR O COMANDO SQL
    conexao.query(sql, function(erro, retorno){
        //CASO HAJA FALHA NO COMANDO SQL
        if(erro) throw erro;

        // CASO CONSIGA EXECUTAR O COMANDO SQL
        res.render('formularioEditar', {produto:retorno[0]});
    });
    
    
}

// Função para exibir a listagem de produtos
function listagemProdutos(req, res){
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
}

// Função para realizar a pesquisa de produtos
function pesquisa(req, res){
    // obter o termo pesquisado
    let termo = req.body.termo;

    // SQL
    let sql = `SELECT * FROM produtos WHERE nome LIKE '%${termo}%'`;

    // executar comando sql
    conexao.query(sql, (erro, retorno) => {

        let semRegistros = retorno.length == 0 ? true : false;


        res.render('lista', {produtos:retorno, semRegistros:semRegistros});
    });
}

// Função para realizar o cadastro de produtos
function cadastrarProduto(req, res){
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
}

// Função para realizar a remoção de produtos
function removerProduto(req, res){
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
}

// Função responsável pela edição de produtos
function editarProduto(req, res){
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
}

// Exportar funções
module.exports = {
    formularioCadastro,
    formularioCadastroComSituacao,
    formularioEditar,
    listagemProdutos,
    pesquisa,
    cadastrarProduto,
    removerProduto,
    editarProduto
};