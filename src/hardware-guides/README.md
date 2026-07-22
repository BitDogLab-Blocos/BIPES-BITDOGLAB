# Tutoriais de hardware

Cada projeto possui uma pasta independente com dois arquivos:

- `tutorial.html`: conteúdo do tutorial em português. Use `data-copy` e `data-copy-alt` nos elementos que precisam de tradução.
- `tutorial.js`: metadados do menu, traduções para inglês e qualquer comportamento exclusivo do tutorial.

O arquivo `manifest.js` é o único índice compartilhado. O `registry.js` valida e armazena os módulos, enquanto `src/js/ui/device-reference.js` cuida apenas de carregar, navegar e traduzir o tutorial selecionado.

O visual comum está em `src/styles/device-reference.css`. Não crie outro CSS quando as classes compartilhadas forem suficientes. Se um projeto realmente precisar de estilos próprios, adicione `stylesheet` ao objeto registrado em seu `tutorial.js`; o carregador incluirá e removerá esse arquivo automaticamente.

## Adicionar um projeto

1. Copie uma das pastas existentes e renomeie-a com um identificador curto, sem espaços.
2. Edite o `tutorial.html` com o novo conteúdo.
3. Edite o `tutorial.js`, usando o mesmo identificador em `id` e preenchendo `menu`, `template`, `translations` e, se necessário, `init` ou `stylesheet`.
4. Acrescente o caminho do novo `tutorial.js` ao array de `manifest.js`.
5. Abra `device-reference.html#identificador` e confira o tutorial em português e inglês.

Não é necessário editar a página principal nem criar manualmente um botão no menu: o menu é gerado a partir dos módulos registrados.
