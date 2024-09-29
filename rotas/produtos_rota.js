// Importar o módulo express
const express = require('express');

// Extraíndo a função Router do módulo express
const router = express.Router();

// Importar módulo de serviços
const servico = require('../servicos/produtos_servico');

// *** ADICIONE SUAS ROTAS AQUI

// Rota Principal
router.get('/', (req, res) => {
    servico.formularioCadastro(req,res);
});

// Rota Principal contendo a situação
router.get('/:situacao', (req, res) => {
    servico.formularioCadastroComSituacao(req,res);
});


//Rota de listagem
router.get('/listar/:categoria', (req, res) => {
    servico.listagemProdutos(req,res);
});

// Rota de pesquisa
router.post('/pesquisa', (req, res) => {
    servico.pesquisa(req,res);
});

// Rota de cadastro
router.post('/cadastrar', function(req,res){
    servico.cadastrarProduto(req,res);
})

//Rota para remover produtos
router.get('/remover/:codigo&:imagem', function(req, res){
    servico.removerProduto(req,res);
})

// Rota para redirecionar para o formulário de alteração / edição
router.get('/formularioEditar/:codigo', function(req, res){
    servico.formularioEditar(req,res);
    
});

// ROTA PARA EDITAR PRODUTOS
router.post('/editar', function(req, res){
    servico.editarProduto(req,res);
});

// Exportar o router
module.exports = router;