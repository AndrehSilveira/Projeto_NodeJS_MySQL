// Importar módulo express
const express = require('express');

// Importar módulo fileupload
const fileupload = require('express-fileupload')

// IMPORTAR MÓDULO EXPRESS-HANDLEBARS
const { engine } = require('express-handlebars');

// iMPORTAR MÓDULO DE ROTAS
const rota_produto = require('./rotas/produtos_rota')

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

// Rotas
app.use('/',rota_produto);


// Servidor
app.listen(8080);