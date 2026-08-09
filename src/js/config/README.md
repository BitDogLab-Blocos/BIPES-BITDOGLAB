# Perfis e toolbox do BIPES–BitDogLab

**Português** · [Read in English](README.en.md)

`src/js/config/` responde a duas perguntas: quais recursos físicos existem em cada revisão da BitDogLab e quais blocos aparecem no editor. Os geradores nunca devem carregar números GPIO próprios.

![Arquitetura da configuração da BitDogLab](images/architecture.png)

## Organização

| Arquivo | Responsabilidade |
| --- | --- |
| `profiles/base.js` | Cópia, merge, validação e regras de geração compartilhadas; não contém pinos. |
| `profiles/v7.js` | Ficha completa de GPIOs e periféricos da V7; cria `BitdogLabConfig`. |
| `profiles/v6.js` | Ficha completa de GPIOs e periféricos da V6; cria `BitdogLabConfig_V6`. |
| `toolbox.xml` | Categorias, blocos, valores iniciais e filtros por projeto. |

## Por que os perfis repetem valores

Cada arquivo de versão é autocontido. Mesmo um pino igual entre V6 e V7 aparece nos dois arquivos. A repetição é intencional: o desenvolvedor pode conferir uma placa inteira sem seguir herança implícita nem comparar vários arquivos.

`base.js` compartilha apenas comportamento que não representa a montagem física:

- nomes usados pelo Python gerado;
- inicialização de LEDs;
- atraso de cortesia do loop;
- marcadores de setup e loop;
- reconhecimento de linhas de configuração;
- cópia profunda, merge e validação estrutural.

## Contrato do perfil

Todo perfil final deve expor:

| Seção | Conteúdo |
| --- | --- |
| `PINS` | GPIOs de LEDs, botões, joystick, matriz, I²C e microfone. |
| `NEOPIXEL` | Quantidade, brilho e mapeamento físico da matriz. |
| `JOYSTICK` | Centro, zona morta e inversão dos eixos. |
| `DISPLAY` | Barramento, frequência e resolução. |
| `ROBOT` | MPU6050, ponte H, PWM e parâmetros de movimento. |
| `ROBOT_POWER` | Barramento e calibração do INA226. |
| `SENSOR` | Barramentos e endereços I²C conhecidos. |
| `LED`, `LED_INIT`, `LOOP`, `MARKERS`, `SETUP_PATTERNS` | Regras compartilhadas de geração. |

`createProfile` valida esse contrato durante o carregamento. Um perfil incompleto deve falhar cedo, antes de o usuário montar blocos.

## Seleção da revisão

A página carrega V7 como padrão e preserva sua referência:

```js
var BitdogLabConfig_V7 = BitdogLabConfig;

BitdogLabConfig = (version === 'v6')
  ? BitdogLabConfig_V6
  : BitdogLabConfig_V7;
```

Geradores, scanner I²C e execução consultam apenas `BitdogLabConfig`, sem condicionais de versão.

## Adicionar uma revisão

1. Copie o perfil mais próximo e renomeie a variável global.
2. Revise todos os GPIOs e todas as seções de periféricos, inclusive valores iguais.
3. Preserve o contrato estrutural validado por `base.js`.
4. Carregue o novo script em `src/pages/index.html`.
5. Adicione a opção ao seletor e ao mecanismo de troca em `core/app.js`.
6. Gere exemplos para a nova revisão e compare o Python produzido.

## Toolbox é uma responsabilidade separada

`toolbox.xml` decide disponibilidade e valores iniciais, não pinagem. Categorias podem usar `data-project` para serem filtradas por `core/workspace/toolbox.js`. Um tipo só pode entrar na toolbox depois de possuir definição e gerador registrados.

## Validação

```powershell
node tests/block_contracts_smoke.js
node tests/examples_generation_smoke.js
node src/mobile/scripts/check-web-boundary.mjs
```

Ao alterar hardware, teste explicitamente V6 e V7 no seletor e confira o Python de LEDs, botões, display, sensores e robô.
