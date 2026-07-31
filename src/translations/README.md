# Traduções do projeto

**Português** · [Read in English](README.en.md)

Esta pasta centraliza os textos traduzidos usados pela aplicação web, pelo Blockly e pelo WebView do aplicativo Android. O catálogo mantém português do Brasil e inglês sem alterar os identificadores que precisam continuar estáveis no código gerado.

## Organização

```text
src/translations/
├── catalog.js                 # catálogo principal da aplicação
└── blockly/
    ├── messages.js            # mensagens e metadados de origem do Blockly
    └── data/
        ├── constants.json     # constantes compartilhadas pelo Blockly
        ├── en.json            # dados em inglês
        ├── pt-br.json         # dados em português do Brasil
        └── synonyms.json      # equivalências usadas pelo tooling do Blockly
```

## Catálogo da aplicação

`catalog.js` reúne as mensagens próprias da BitDogLab nos mapas `pt-br` e `en` e expõe o resultado para o namespace global `Code`. O carregamento é iniciado por `src/js/core/language.js`; a camada de interface usa `Code.t(...)` e os atributos `data-i18n` para buscar as mensagens.

Para adicionar um texto novo:

1. crie uma chave estável e inclua-a nos dois idiomas;
2. use `Code.t('app.nomeDaChave')` no JavaScript ou `data-i18n="app.nomeDaChave"` no HTML;
3. preserve placeholders como `%1` e `%2` exatamente nas duas versões;
4. mantenha em português os identificadores, nomes de variáveis, pinos e valores que precisam aparecer no MicroPython gerado.

O tradutor legado por texto continua no catálogo para preservar blocos e projetos antigos enquanto a migração para chaves estáveis avança.

## Dados do Blockly

`blockly/messages.js` acompanha o formato de mensagens do Blockly e registra as regras usadas para gerar os arquivos JSON. Ao alterar mensagens dessa origem, siga as instruções no próprio arquivo e regenere os dados correspondentes; não edite apenas um locale deixando os arquivos derivados divergentes.

Os arquivos de dados não são um segundo catálogo da interface BitDogLab. Eles sustentam os textos e metadados do Blockly, enquanto `catalog.js` concentra as mensagens próprias do projeto.

## Checklist de tradução

- Verifique a interface em português e inglês no navegador.
- Confirme que o texto traduzido não altera nomes de blocos, campos, variáveis ou identificadores gerados.
- Teste placeholders, quebras de linha e caracteres especiais.
- Valide também o WebView Android quando a mudança afetar mensagens carregadas durante a inicialização.
