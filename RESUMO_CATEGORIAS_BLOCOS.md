# 📚 Resumo das Categorias e Blocos - BIPES BitdogLab

## Índice
1. [Matemática](#-1-matemática)
2. [Texto](#-2-texto)
3. [Tempo](#-3-tempo)
4. [Cores](#-4-cores)
5. [LEDs](#-5-leds)
6. [Matriz de LEDs](#-6-matriz-de-leds)
7. [Números Matriz](#-7-números-matriz)
8. [Emojis Matriz](#-8-emojis-matriz)
9. [Notas Musicais](#-9-notas-musicais)
10. [Som](#-10-som)
11. [Animações da Matriz](#-11-animações-da-matriz)
12. [Botões](#-12-botões)
13. [Sistema de Tipos e Conexões](#sistema-de-tipos-e-conexões)

---

## 🔢 1. Matemática

**Cor:** Azul-esverdeado (#BKY_MATH_HUE)

### Blocos Disponíveis

| Bloco | Descrição | Entradas | Saída | Conecta com |
|-------|-----------|----------|-------|-------------|
| `math_number` | Valor numérico | Campo: número (padrão: 123) | Number | Qualquer entrada numérica |
| `math_arithmetic` | Operações aritméticas (+, -, *, /, ^) | A (Number), B (Number) | Number | Qualquer entrada numérica |
| `math_single` | Funções matemáticas (√, abs, ln, log10, e^, 10^) | NUM (Number) | Number | Qualquer entrada numérica |
| `math_trig` | Funções trigonométricas (sin, cos, tan, asin, acos, atan) | NUM (Number) | Number | Qualquer entrada numérica |
| `math_constant` | Constantes (π, e, φ, √2, √½, ∞) | - | Number | Qualquer entrada numérica |
| `math_number_property` | Verifica propriedades (par, ímpar, positivo, negativo) | NUMBER_TO_CHECK (Number) | Boolean | Condições lógicas |
| `math_is_divisible_by` | Verifica divisibilidade | DIVIDEND (Number), DIVISOR (Number) | Boolean | Condições lógicas |
| `math_round` | Arredonda números | NUMBER_TO_ROUND (Number) | Number | Qualquer entrada numérica |
| `math_round_to_decimal` | Arredonda para casas decimais | NUMBER_TO_ROUND (Number), DECIMAL_PLACES (campo) | Number | Qualquer entrada numérica |
| `math_on_list` | Operações em listas (soma, min, max, média, item aleatório) | LIST (Array) | Number ou elemento | Qualquer entrada numérica |
| `math_modulo` | Operação módulo (resto) | DIVIDEND (Number), DIVISOR (Number) | Number | Qualquer entrada numérica |
| `math_constrain` | Limita valor dentro de faixa | VALUE (Number), LOW (Number), HIGH (Number) | Number | Qualquer entrada numérica |
| `math_random_int` | Inteiro aleatório | FROM (Number), TO (Number) | Number | Qualquer entrada numérica |
| `math_random_float` | Decimal aleatório | FROM (Number), TO (Number) | Number | Qualquer entrada numérica |

**Conexões típicas:**
- Saídas conectam a entradas de tempo, brilho de LED, posições da matriz, volumes de som
- Podem ser encadeados entre si para cálculos complexos

---

## 📝 2. Texto

**Cor:** Vermelho (#BKY_TEXTS_HUE)

### Blocos Disponíveis

| Bloco | Descrição | Entradas | Saída | Conecta com |
|-------|-----------|----------|-------|-------------|
| `text` | String de texto | Campo: texto editável | String | Qualquer entrada de texto |
| `text_print_multiple` | Imprime múltiplos textos | Múltiplas entradas de texto | - | Bloco de execução |
| `text_length` | Tamanho da string | VALUE (String) | Number | Entradas numéricas |
| `text_charAt` | Caractere na posição | VALUE (String), posição | String | Entradas de texto |
| `text_getSubstring` | Extrai substring | STRING (String), posições | String | Entradas de texto |
| `text_changeCase` | Muda capitalização (MAIÚSCULA, minúscula, Título) | TEXT (String) | String | Entradas de texto |
| `text_print` | Imprime texto no console | TEXT (String) | - | Bloco de execução |

**Conexões típicas:**
- Usado principalmente para depuração e exibição
- Pode conectar com blocos matemáticos para conversão

---

## ⏱️ 3. Tempo

**Cor:** Laranja-avermelhado (190)

### Blocos de Execução (com Previous/Next)

| Bloco | Descrição | Entradas | Conecta com |
|-------|-----------|----------|-------------|
| `esperar_segundos` | Pausa em segundos | TIME (Number ou Time) | Qualquer bloco de execução |
| `esperar_milisegundos` | Pausa em milissegundos | TIME (Number ou Time) | Qualquer bloco de execução |

### Blocos de Valor (saída: Time)

| Bloco | Descrição | Campo | Saída | Conecta com |
|-------|-----------|-------|-------|-------------|
| `tempo_segundos` | Tempo em segundos | NUM (padrão: 1) | Time | Blocos esperar_* |
| `tempo_milisegundos` | Tempo em milissegundos | NUM (padrão: 500) | Time | Blocos esperar_* |
| `tempo_minutos` | Tempo em minutos | NUM (padrão: 1) | Time | Blocos esperar_* |
| `tempo_horas` | Tempo em horas | NUM (padrão: 1) | Time | Blocos esperar_* |

**Conexões típicas:**
- Blocos de valor conectam às entradas TIME dos blocos esperar
- Blocos esperar encadeiam com LEDs, sons, animações para controle de timing
- Aceita também valores numéricos diretos (math_number)

---

## 🎨 4. Cores

**Cor:** Roxo (#A65C99)

### Blocos de Cores Básicas

| Bloco | Emoji | Saída | Conecta com |
|-------|-------|-------|-------------|
| `colour_red` | 🔴 | Colour | Todos blocos de LED e matriz |
| `colour_green` | 🟢 | Colour | Todos blocos de LED e matriz |
| `colour_blue` | 🔵 | Colour | Todos blocos de LED e matriz |
| `colour_yellow` | 🟡 | Colour | Todos blocos de LED e matriz |
| `colour_cyan` | 🩵 | Colour | Todos blocos de LED e matriz |
| `colour_magenta` | 🩷 | Colour | Todos blocos de LED e matriz |
| `colour_white` | ⚪ | Colour | Todos blocos de LED e matriz |
| `colour_orange` | 🟠 | Colour | Todos blocos de LED e matriz |
| `colour_pink` | 🩷 | Colour | Todos blocos de LED e matriz |
| `colour_lime` | 🟢 | Colour | Todos blocos de LED e matriz |
| `colour_skyblue` | 🔵 | Colour | Todos blocos de LED e matriz |
| `colour_turquoise` | 🩵 | Colour | Todos blocos de LED e matriz |

### Blocos de Manipulação

| Bloco | Descrição | Entradas | Saída | Conecta com |
|-------|-----------|----------|-------|-------------|
| `mix_colours` | Mistura múltiplas cores | COLOR (múltiplos, via mutator) | Colour | Todos blocos de LED e matriz |

**Conexões típicas:**
- Todas saídas Colour conectam a:
  - Blocos de LED individuais (ligar, piscar, animações)
  - Blocos de matriz (preencher, mostrar emoji, desenhos)
  - Entrada COLOUR de qualquer bloco de LED

---

## 💡 5. LEDs

**Cor:** Amarelo (45)

### Controle Básico de LED

| Bloco | Descrição | Entradas | Conecta com |
|-------|-----------|----------|-------------|
| `bloco_ligar_led` | Liga LED | COLOUR (Colour) | Previous/Next statement, aceita cores |
| `bloco_desligar_led` | Desliga LED | COLOUR (Colour) | Previous/Next statement, aceita cores |
| `bloco_desligar_todos_leds` | Desliga todos os LEDs | - | Previous/Next statement |
| `bloco_acender_led_brilho` | Liga LED com brilho | COLOUR (Colour), INTENSITY (0-100%) | Previous/Next statement, aceita cores |
| `bloco_piscar_led` | Pisca LED rápido | COLOUR (Colour) | Previous/Next statement, aceita cores |
| `piscar_led_lento` | Pisca LED lento | COLOUR (Colour) | Previous/Next statement, aceita cores |

### Animações de LED

| Bloco | Descrição | Entradas | Conecta com |
|-------|-----------|----------|-------------|
| `bloco_animar_led_coracao` | Animação de batimento cardíaco | COLOUR (Colour) | Previous/Next statement, aceita cores |
| `bloco_sinalizar_led_sos` | Sinal SOS em Morse | COLOUR (Colour) | Previous/Next statement, aceita cores |
| `bloco_animar_led_brilhar` | Pulso de brilho | COLOUR (Colour) | Previous/Next statement, aceita cores |
| `bloco_alternar_led` | Alterna LED on/off | COLOUR (Colour) | Previous/Next statement, aceita cores |
| `bloco_transicao_led` | Transição de cor | COLOUR (Colour) | Previous/Next statement, aceita cores |
| `bloco_batalhar_led` | Modo batalha | COLOUR (Colour) | Previous/Next statement, aceita cores |

### Animação Customizada

| Bloco | Descrição | Entradas | Conecta com |
|-------|-----------|----------|-------------|
| `bloco_criar_animacao_led` | Cria animação personalizada | Usa mutator para adicionar passos (ação/espera) | Previous/Next statement, aceita cores e tempos |

**Conexões típicas:**
- Entrada COLOUR: conecta com qualquer bloco da categoria Cores
- Previous/Next: encadeia com outros blocos de execução (tempo, som, matriz)
- Campo INTENSITY: aceita valores 0-100% ou blocos Number

---

## 🔲 6. Matriz de LEDs

**Cor:** Azul (#4a69bd)

### Controle da Matriz

| Bloco | Descrição | Entradas/Campos | Saída | Conecta com |
|-------|-----------|-----------------|-------|-------------|
| `preencher_matriz` | Preenche matriz 5x5 | COLOUR (Colour), INTENSITY (0-100%) | - | Cores, Previous/Next |
| `desligar_matriz` | Desliga toda matriz | - | - | Previous/Next |
| `acender_led_posicao` | Liga LED específico | LINHA (0-4), COLUNA (0-4), COLOUR, INTENSITY | - | Cores, Numbers, Previous/Next |
| `acender_linha` | Liga linha inteira | LINHA (0-4), COLOUR, INTENSITY | - | Cores, Numbers, Previous/Next |
| `acender_coluna` | Liga coluna inteira | COLUNA (0-4), COLOUR, INTENSITY | - | Cores, Numbers, Previous/Next |

### Exibição de Conteúdo

| Bloco | Descrição | Entradas | Conecta com |
|-------|-----------|----------|-------------|
| `mostrar_numero_matriz` | Exibe dígito (0-9) | NUMERO (MatrixNumber), COR (Colour), BRILHO (0-100%) | Números Matriz, Cores, Previous/Next |
| `mostrar_emoji` | Exibe emoji | EMOJI (MatrixEmoji), COR (Colour), BRILHO (0-100%) | Emojis Matriz, Cores, Previous/Next |

### Desenho Customizado

| Bloco | Descrição | Entradas | Conecta com |
|-------|-----------|----------|-------------|
| `criar_desenho_na_matriz` | Cria desenho personalizado | Usa mutator para adicionar elementos de desenho | Cores, blocos de matriz, Previous/Next |

**Conexões típicas:**
- Entradas COLOUR/COR: blocos da categoria Cores
- Entrada NUMERO: blocos da categoria Números Matriz (0-9)
- Entrada EMOJI: blocos da categoria Emojis Matriz
- Campos LINHA/COLUNA: valores 0-4 ou blocos Number
- INTENSITY/BRILHO: 0-100% ou blocos Number

---

## 🔢 7. Números Matriz

**Cor:** Verde (#55a855)

### Blocos de Dígitos

| Bloco | Emoji | Saída | Conecta com |
|-------|-------|-------|-------------|
| `numero_matriz_0` | 0️⃣ | MatrixNumber | mostrar_numero_matriz |
| `numero_matriz_1` | 1️⃣ | MatrixNumber | mostrar_numero_matriz |
| `numero_matriz_2` | 2️⃣ | MatrixNumber | mostrar_numero_matriz |
| `numero_matriz_3` | 3️⃣ | MatrixNumber | mostrar_numero_matriz |
| `numero_matriz_4` | 4️⃣ | MatrixNumber | mostrar_numero_matriz |
| `numero_matriz_5` | 5️⃣ | MatrixNumber | mostrar_numero_matriz |
| `numero_matriz_6` | 6️⃣ | MatrixNumber | mostrar_numero_matriz |
| `numero_matriz_7` | 7️⃣ | MatrixNumber | mostrar_numero_matriz |
| `numero_matriz_8` | 8️⃣ | MatrixNumber | mostrar_numero_matriz |
| `numero_matriz_9` | 9️⃣ | MatrixNumber | mostrar_numero_matriz |

**Conexões típicas:**
- Saída MatrixNumber conecta exclusivamente à entrada NUMERO do bloco `mostrar_numero_matriz`

---

## 😊 8. Emojis Matriz

**Cor:** Laranja (#FF8C00)

### Blocos de Emojis

| Bloco | Emoji | Saída | Conecta com |
|-------|-------|-------|-------------|
| `emoji_rosto_feliz` | 😊 | MatrixEmoji | mostrar_emoji |
| `emoji_rosto_triste` | ☹️ | MatrixEmoji | mostrar_emoji |
| `emoji_rosto_surpreso` | 😮 | MatrixEmoji | mostrar_emoji |
| `emoji_coracao` | ❤️ | MatrixEmoji | mostrar_emoji |
| `emoji_seta_cima` | ⬆️ | MatrixEmoji | mostrar_emoji |
| `emoji_seta_baixo` | ⬇️ | MatrixEmoji | mostrar_emoji |
| `emoji_sol` | ☀️ | MatrixEmoji | mostrar_emoji |
| `emoji_chuva` | 🌧️ | MatrixEmoji | mostrar_emoji |
| `emoji_flor` | 🌸 | MatrixEmoji | mostrar_emoji |
| `emoji_fantasma` | 👻 | MatrixEmoji | mostrar_emoji |

**Conexões típicas:**
- Saída MatrixEmoji conecta exclusivamente à entrada EMOJI do bloco `mostrar_emoji`

---

## 🎵 9. Notas Musicais

**Cor:** Roxo escuro (#833471)

### Blocos de Notas

| Bloco | Nota | Saída | Conecta com |
|-------|------|-------|-------------|
| `nota_do` | Dó (C) | Note | tocar_nota |
| `nota_re` | Ré (D) | Note | tocar_nota |
| `nota_mi` | Mi (E) | Note | tocar_nota |
| `nota_fa` | Fá (F) | Note | tocar_nota |
| `nota_sol` | Sol (G) | Note | tocar_nota |
| `nota_la` | Lá (A) | Note | tocar_nota |
| `nota_si` | Si (B) | Note | tocar_nota |

**Conexões típicas:**
- Saída Note conecta à entrada NOTA do bloco `tocar_nota`
- Usado em blocos `criar_melodia` para sequências musicais

---

## 🔊 10. Som

**Cor:** Roxo (#9a5ba5)

### Controle Básico de Som

| Bloco | Descrição | Entradas | Conecta com |
|-------|-----------|----------|-------------|
| `tocar_nota` | Toca nota musical | NOTA (Note), OCTAVE (4/5/6), VOLUME (0-100%) | Notas Musicais, Previous/Next |
| `tocar_som_agudo` | Tom agudo de teste | VOLUME (0-100%) | Previous/Next |
| `parar_som` | Para buzzer | - | Previous/Next |

### Efeitos Sonoros

| Bloco | Descrição | Entradas | Conecta com |
|-------|-----------|----------|-------------|
| `bipe_curto` | Bipe curto | VOLUME (0-100%) | Previous/Next |
| `bipe_duplo` | Dois bipes rápidos | VOLUME (0-100%) | Previous/Next |
| `alerta_intermitente` | Alerta intermitente | VOLUME (0-100%) | Previous/Next |
| `chamada` | Som de chamada/toque | VOLUME (0-100%) | Previous/Next |
| `som_de_moeda` | Efeito de moeda | VOLUME (0-100%) | Previous/Next |
| `som_de_sucesso` | Som de sucesso | VOLUME (0-100%) | Previous/Next |
| `som_de_falha` | Som de erro/falha | VOLUME (0-100%) | Previous/Next |
| `som_de_laser` | Efeito laser | VOLUME (0-100%) | Previous/Next |
| `sirene_policial` | Sirene de polícia | VOLUME (0-100%) | Previous/Next |

### Sequências Musicais

| Bloco | Descrição | Entradas | Conecta com |
|-------|-----------|----------|-------------|
| `escala_musical_sobe` | Escala ascendente | VOLUME (0-100%) | Previous/Next |
| `escala_musical_desce` | Escala descendente | VOLUME (0-100%) | Previous/Next |
| `brilha_brilha_estrelinha` | Melodia "Brilha Brilha Estrelinha" | VOLUME (0-100%) | Previous/Next |

### Criação Customizada

| Bloco | Descrição | Entradas | Conecta com |
|-------|-----------|----------|-------------|
| `tocar_repetidamente` | Loop infinito de sons | DO (statement com blocos de som) | Previous/Next, aceita blocos de som |
| `criar_melodia` | Melodia personalizada | Usa mutator (nota + tempo por passo) | Notas, Tempo, Previous/Next |
| `criar_trilha_sonora` | Trilha sonora customizada | Usa mutator (ação + timing) | Sons, Tempo, Previous/Next |

**Conexões típicas:**
- Campo VOLUME: 0-100% ou blocos Number
- Entrada NOTA: blocos da categoria Notas Musicais
- Statement DO: aceita outros blocos de som para criar sequências
- Todos têm limite de segurança de 70% do volume máximo

---

## ✨ 11. Animações da Matriz

**Cor:** Roxo (#8e44ad)

### Blocos de Animação (Wrappers)

Todos esses blocos aceitam blocos de matriz dentro deles através da entrada DO:

| Bloco | Emoji | Descrição | Aceita | Conecta com |
|-------|-------|-----------|--------|-------------|
| `matriz_piscar_rapido` | ⚡ | Pisca rápido | Statement DO (blocos matriz) | Previous/Next, blocos de matriz |
| `matriz_piscar_lento` | 🐌 | Pisca lento | Statement DO (blocos matriz) | Previous/Next, blocos de matriz |
| `matriz_aparecer_sumir` | ✨ | Fade in/out | Statement DO (blocos matriz) | Previous/Next, blocos de matriz |
| `matriz_pulsar_brilho` | 💫 | Pulso de brilho | Statement DO (blocos matriz) | Previous/Next, blocos de matriz |
| `matriz_deslizar_cima` | ⬆️ | Desliza para cima | Statement DO (blocos matriz) | Previous/Next, blocos de matriz |
| `matriz_deslizar_esquerda` | ⬅️ | Desliza para esquerda | Statement DO (blocos matriz) | Previous/Next, blocos de matriz |
| `matriz_deslizar_baixo` | ⬇️ | Desliza para baixo | Statement DO (blocos matriz) | Previous/Next, blocos de matriz |
| `matriz_deslizar_direita` | ➡️ | Desliza para direita | Statement DO (blocos matriz) | Previous/Next, blocos de matriz |
| `matriz_balancar` | 🌊 | Movimento de onda | Statement DO (blocos matriz) | Previous/Next, blocos de matriz |
| `matriz_contracao` | 🔄 | Animação de contração | Statement DO (blocos matriz) | Previous/Next, blocos de matriz |
| `matriz_dar_flash` | 💥 | Efeito flash | Statement DO (blocos matriz) | Previous/Next, blocos de matriz |

**Conexões típicas:**
- Entrada DO: aceita qualquer bloco da categoria Matriz de LEDs
  - `mostrar_numero_matriz`
  - `mostrar_emoji`
  - `preencher_matriz`
  - `acender_led_posicao`
  - `criar_desenho_na_matriz`
- Previous/Next: encadeia com outros blocos de execução
- **Uso:** Envolve blocos de exibição de matriz para adicionar efeito de animação

---

## 🎮 12. Botões

**Cor:** Vermelho-laranja (#ee5a24)

### Blocos de Interação

| Bloco | Descrição | Campos | Entradas Statement | Conecta com |
|-------|-----------|--------|-------------------|-------------|
| `botao_enquanto_apertado` | Executa enquanto pressionado | BOTAO (Esquerdo 👆 / Direito 👉 / Centro 🎯) | DO (enquanto pressionado)<br>ELSE (quando solto) | Previous/Next, qualquer bloco de execução |
| `botao_se_apertado` | Executa uma vez quando pressionado | BOTAO (Esquerdo 👆 / Direito 👉 / Centro 🎯) | DO (ação) | Previous/Next, qualquer bloco de execução |

**Opções de Botões:**
- **Left** 👆 - Botão esquerdo
- **Right** 👉 - Botão direito
- **Center** 🎯 - Botão central

**Conexões típicas:**
- Statement DO/ELSE: aceita qualquer bloco de execução
  - LEDs (ligar, animações)
  - Matriz (mostrar, desenhar)
  - Som (tocar notas, efeitos)
  - Tempo (esperar)
- Previous/Next: encadeia com outros blocos
- **Uso comum:** Criar interatividade respondendo a pressionar botões

---

## Sistema de Tipos e Conexões

### Tipos de Dados

| Tipo | Descrição | Produzido por | Consumido por |
|------|-----------|---------------|---------------|
| **Number** | Valores numéricos | Matemática, text_length | Tempo, posições, brilho, volume, cálculos |
| **String** | Texto | Texto | Impressão, manipulação de texto |
| **Boolean** | Verdadeiro/Falso | Comparações matemáticas | Condições lógicas (se descomentadas) |
| **Colour** | Valores de cor | Blocos Cores, mix_colours | LEDs, Matriz |
| **Time** | Duração temporal | tempo_segundos/milisegundos/minutos/horas | esperar_segundos/milisegundos |
| **Note** | Nota musical | nota_do/re/mi/fa/sol/la/si | tocar_nota, criar_melodia |
| **MatrixNumber** | Dígito 0-9 para matriz | numero_matriz_0 a numero_matriz_9 | mostrar_numero_matriz |
| **MatrixEmoji** | Padrão emoji para matriz | emoji_* (10 tipos) | mostrar_emoji |
| **Array** | Lista de valores | (descomentado em Listas) | math_on_list |

### Tipos de Conexões

| Tipo | Descrição | Exemplos |
|------|-----------|----------|
| **Previous/Next Statement** | Blocos de execução encadeados | LEDs, Matriz, Som, Tempo, Botões |
| **Value Input** | Aceita saída de blocos de valor | COLOUR, NOTA, NUMERO, TIME, campos numéricos |
| **Statement Input** | Aceita blocos de execução aninhados | DO, ELSE (em Botões e Animações) |

### Regras de Compatibilidade

✅ **Conexões Válidas:**
- Number → campos numéricos (brilho, volume, posições, tempo)
- Colour → entradas COLOUR/COR (LEDs, Matriz)
- Note → entrada NOTA (tocar_nota)
- MatrixNumber → entrada NUMERO (mostrar_numero_matriz)
- MatrixEmoji → entrada EMOJI (mostrar_emoji)
- Time → entradas TIME (esperar_*)
- Blocos de execução → Previous/Next, Statement inputs (DO/ELSE)

❌ **Conexões Inválidas:**
- Misturar tipos incompatíveis (ex: Colour → Number)
- Blocos de valor em posições de statement
- Blocos de execução em entradas de valor

---

## Recursos Especiais

### Mutators (Ícone de engrenagem ⚙️)

Blocos que permitem adicionar/remover entradas dinamicamente:

| Bloco | Permite adicionar |
|-------|-------------------|
| `mix_colours` | Múltiplas cores para mistura |
| `bloco_criar_animacao_led` | Passos de ação e espera |
| `criar_melodia` | Notas com tempos |
| `criar_trilha_sonora` | Ações sonoras com timing |
| `criar_desenho_na_matriz` | Elementos de desenho |

### Campos Especiais

| Tipo de Campo | Descrição | Exemplo |
|---------------|-----------|---------|
| FieldDropdown | Seleção de lista | Oitava (4/5/6), Botão (Left/Right/Center) |
| FieldNumber | Entrada numérica com min/max | Brilho (0-100%), Volume (0-100%) |
| FieldImage | Exibe imagens | Emojis nos blocos |

### Limites de Segurança

- **Volume de som:** Máximo 70% (limite de segurança para proteger buzzer)
- **Brilho LED:** 0-100% (padrão: 30% na matriz, 100% em LEDs individuais)
- **Posições matriz:** 0-4 (matriz 5x5)

---

## Categorias Desabilitadas (Disponíveis para Ativar)

Estas categorias estão comentadas em `default.xml` mas podem ser habilitadas:

- **LÓGICA** - Condicionais, comparações, operadores booleanos
- **REPETIÇÕES** - Loops (repeat, while, for, forEach)
- **LISTAS** - Manipulação de arrays
- **VARIÁVEIS** - Criação de variáveis customizadas
- **FUNÇÕES** - Definição e chamada de funções
- **MÁQUINA E PINOS** - Controle GPIO, PWM, ADC de baixo nível

---

## Arquivos Principais

- **`ui/toolbox/default.xml`** - Define organização das categorias e blocos disponíveis
- **`ui/core/block_definitions.js`** - Contém todas as definições Blockly (126 blocos)
- **`ui/core/generator_stubs.js`** - Geradores de código Python para cada bloco
- **`ui/index.html`** - Interface principal

---

## Fluxo de Trabalho Típico

### Exemplo 1: Sequência LED + Som
```
[botao_se_apertado: Left]
  └─ DO:
     ├─ [bloco_ligar_led] ← [colour_red]
     ├─ [tocar_nota] ← [nota_do]
     ├─ [esperar_segundos] ← [tempo_segundos: 1]
     └─ [bloco_desligar_led] ← [colour_red]
```

### Exemplo 2: Exibição Animada na Matriz
```
[matriz_piscar_rapido]
  └─ DO:
     └─ [mostrar_emoji]
        ├─ EMOJI ← [emoji_coracao]
        └─ COR ← [colour_red]
```

### Exemplo 3: Melodia Customizada
```
[criar_melodia]
  └─ Mutator steps:
     ├─ Passo 1: [nota_do] + [tempo_segundos: 0.5]
     ├─ Passo 2: [nota_mi] + [tempo_segundos: 0.5]
     └─ Passo 3: [nota_sol] + [tempo_segundos: 1]
```

---

**Última atualização:** 2025-10-17
**Versão do BIPES:** BitdogLab (Raspberry Pi Pico)
**Total de blocos ativos:** 126 blocos em 12 categorias
