//ESTRUTURA DO MÓDULO DE SERVIÇOS

// Importar o módulo de conexão com banco MySQL
const conexao = require('../bd/conexao_mysql');

// Importar o módulo file system
const fs = require('fs');

// Função para exibir o formulário para cadastro de produtos
function formularioCadastro(req, res){}

// Função para exibir o formulário para cadastro de produtos e a situação
function formularioCadastroComSituacao(req, res){}

// Função para exibir o formulário para edição de produtos
function formularioEditar(req, res){}

// Função para exibir a listagem de produtos
function listagemProdutos(req, res){}

// Função para realizar a pesquisa de produtos
function pesquisa(req, res){}

// Função para realizar o cadastro de produtos
function cadastrarProduto(req, res){}

// Função para realizar a remoção de produtos
function removerProduto(req, res){}

// Função responsável pela edição de produtos
function editarProduto(req, res){}

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