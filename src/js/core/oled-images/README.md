# Imagens no OLED

O bloco **Mostrar imagem no OLED**, na categoria **Display OLED**, aceita PNG, JPG e WebP locais. Selecione o display pequeno SSD1306 (128 × 64) ou grande SH1107 (128 × 128), clique em **Escolher imagem**, ajuste a prévia e confirme **Usar imagem**. Execute o programa pela conexão USB normal.

## Conversão

A imagem é ajustada proporcionalmente e centralizada, sem recorte. A margem opcional de um pixel reproduz o enquadramento 126 × 126 do tutorial para uma imagem quadrada no display grande. No pequeno, a mesma imagem ocupa 62 × 62, mantendo a proporção.

O navegador oferece limiar fixo, limiar adaptativo local de 9 × 9 pixels e pontilhamento Floyd–Steinberg. O ajuste de brilho altera o limiar; a inversão troca pixels acesos e apagados, incluindo o fundo. Transparência é composta sobre branco antes da conversão. A prévia mostra exatamente os pixels enviados: branco aceso, preto apagado. A conversão dispensa servidor, banco de dados e IA. Arquivos têm limite de 10 MB e 16 milhões de pixels; a fonte mantida em memória tem no máximo 512 pixels no maior lado.

## Organização do código

| Arquivo | Responsabilidade |
| --- | --- |
| `../oled-images.js` | Conversão de pixels, empacotamento horizontal, enquadramento, prévias e registro de imagens da sessão. |
| `../../ui/oled-image-editor.js` | Upload local, controles, cancelamento e confirmação da imagem. |
| `../../blocks/definitions/display-image.js` | Campos do bloco, prévia, referência da sessão e histórico de desfazer/refazer. |
| `../../blocks/generators/display-image.js` | Bitmap no setup e função de desenho MicroPython. |
| `../../blocks/contracts/validator.js` | Bloqueio da execução de blocos sem imagem e conflito entre tipos de tela. |
| `../../../translations/catalog.js` | Textos em português e inglês. |
| `../../../styles/oled-image-editor.css` | Janela responsiva, prévia sem suavização e estados de foco. |

Os drivers e a pinagem vêm dos módulos existentes de display e dos perfis V6/V7. O código gerado incorpora o driver escolhido; o aluno não precisa instalar `sh1107_bitdoglab.py` separadamente.

## Vida útil das imagens

Cada confirmação cria uma nova referência para uma imagem. Dois blocos podem ter imagens diferentes. Duplicar um bloco inicialmente reutiliza a mesma imagem; escolher outra na cópia não altera o original. As referências antigas continuam disponíveis até o encerramento da página para permitir desfazer/refazer.

O XML e o salvamento automático guardam somente um identificador opaco da sessão. Não guardam pixels, arquivos, nomes de arquivos nem prévias. Importar o XML durante a mesma sessão pode recuperar a imagem; após recarregar, fechar ou abrir em outra aba, selecione a imagem novamente. O bloco informa a ausência e impede a execução. Limpar o cache sem recarregar não apaga a memória da página em uso.

Exportar o programa Python ou gravá-lo na placa **inclui os bytes da imagem**. Esse programa permanece independente da sessão do navegador.

## Referência do orientador e validação

A referência é `Tutorial_imagens_OLED_BitDogLab.docx`: pixels por linha, da esquerda para a direita; oito pixels por byte; bit 7 à esquerda; 1 representa pixel aceso. O grupo `10110010` resulta em `0xB2`. Uma tela completa ocupa 1.024 bytes (128 × 64) ou 2.048 bytes (128 × 128).

`tests/fixtures/oled-tutorial-bitmap.json` contém os 2.048 bytes extraídos do vetor `BITMAP` do apêndice e o SHA-256 do documento usado. O bitmap tem 3.254 pixels acesos. Essa referência verifica a preservação dos bytes e a renderização; não pressupõe reproduzir uma conversão de fotografia cujo algoritmo e ajustes não estão especificados no documento.

O gerador usa a mesma leitura `valor & (0x80 >> bit)` e os métodos `oled.fill(0)`, `oled.pixel()` e `oled.show()` do tutorial. A inicialização e a orientação continuam sob responsabilidade dos drivers existentes. Os bytes são emitidos em hexadecimal e decodificados com `binascii.unhexlify`, fora do loop principal, evitando milhares de literais inteiros no parser MicroPython.

```powershell
node --test tests/oled-images.test.js
node tests/oled-images-browser.js
node tests/block_contracts_smoke.js
node tests/examples_generation_smoke.js
node --test tests/i18n/*.test.js
```

O teste de navegador usa Playwright, Chrome/Edge e Python disponíveis no ambiente. Faz upload real, verifica o layout pequeno, importa o XML de exemplo de `tests/fixtures/oled-image.xml`, gera programas nos dois idiomas e perfis, valida a sintaxe Python e executa a função gerada em um display de teste para conferir cada pixel. Também verifica imagens independentes, conflitos de tela, cancelamento, arquivo corrompido, duplicação, desfazer/refazer e perda das imagens após recarregar a página.

Os artefatos locais `tests/oled-image-preview.png`, `tests/oled-image-preview-mobile.png` e `tests/oled-generated-large.py` permitem inspecionar a interface e testar o mascote na placa. A validação no navegador não confirma a orientação visual do display físico: confira essa orientação em cada modelo conectado.

O teste físico opcional abaixo usa o programa grande gerado pelo teste de navegador. Ele interrompe o programa em execução, desenha uma única vez e deixa a placa no REPL, sem reset e sem gravar arquivos. Requer pyserial. Use a porta da sua placa; `COM7` é apenas a porta utilizada na validação local.

```powershell
python tests/oled-images-physical.py --port COM7
```

Em 06/10/2026, a placa conectada respondeu como RP2040 com MicroPython 1.28.0. O barramento I2C1 em GP2/GP3 respondeu em `0x3C` e `0x40`. A execução do programa gerado para SH1107 128 × 128 completou as escritas I²C e confirmou o framebuffer de 2.048 bytes com 3.254 pixels acesos. A orientação visual e um segundo display físico SSD1306 não foram verificados; o pequeno passou na geração, conversão e renderização simulada.

Os 992 exemplos existentes passaram no smoke test de geração. O verificador auxiliar `src/mobile/scripts/check-web-boundary.mjs` usa hashes antigos: sete arquivos já divergiam desse registro antes desta implementação. Esse diagnóstico permanece separado dos testes funcionais do bloco; o registro do aplicativo móvel não foi refeito.
