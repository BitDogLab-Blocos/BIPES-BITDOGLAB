# Indicações de Blocos - Categoria Repetição

Sugestões de blocos simples para controle de repetição no contexto BitdogLab (programação educacional com hardware).

## 📝 Blocos Sugeridos para Repetição

### 1. **Repetir [N] vezes**
**Status:** ✅ Já implementado (`controls_repeat_simple`)

**Uso:**
- Piscar LED 5 vezes
- Tocar som 3 vezes
- Mostrar sequência de emojis na matriz
- Fazer animação com número fixo de frames

**Exemplo:**
```
Repetir 10 vezes:
  Acender LED
  Aguardar 0.5s
  Apagar LED
  Aguardar 0.5s
```

---

### 2. **Repetir para sempre**
**Status:** ⚠️ A implementar (`controls_repeat_forever`)

**Descrição:**
Loop infinito - não para até o programa ser interrompido manualmente.

**Uso:**
- Monitorar sensor continuamente
- Manter display sempre atualizado
- Piscar LED de status constantemente
- Ler temperatura e mostrar no display em tempo real

**Exemplo:**
```
Repetir para sempre:
  Ler temperatura
  Mostrar no display
  Aguardar 1s
```

**Código Python:**
```python
while True:
  # seu código aqui
```

---

### 3. **Repetir enquanto [condição]**
**Status:** ✅ Já implementado (`controls_while_simple`)

**Uso:**
- Repetir enquanto botão pressionado
- Repetir enquanto temperatura < 30°C
- Repetir enquanto sensor detecta movimento
- Continuar enquanto luz está acesa

**Exemplo:**
```
Repetir enquanto (botão A pressionado):
  Aumentar contador
  Mostrar contador no display
```

---

### 4. **Repetir até [condição]**
**Status:** ⚠️ A implementar (`controls_repeat_until`)

**Descrição:**
Continua repetindo ATÉ que a condição seja verdadeira (oposto do "enquanto").

**Uso:**
- Repetir até botão ser pressionado
- Repetir até sensor detectar objeto
- Repetir até temperatura atingir valor
- Aguardar até receber sinal

**Exemplo:**
```
Repetir até (distância < 10cm):
  Mostrar "Aproxime-se"
  Aguardar 0.5s
```

**Código Python:**
```python
while not (distancia < 10):
  # seu código aqui
```

---

### 5. **Contar de [início] até [fim]**
**Status:** ✅ Já implementado (`controls_for_simple`)

**Uso:**
- Contar de 0 a 9 no display
- Percorrer lista de valores
- Criar animação sequencial
- Ligar LEDs um por um

**Exemplo:**
```
Para i de 0 até 9:
  Mostrar i no display
  Aguardar 0.5s
```

---

### 6. **Contar de [início] até [fim] pulando de [passo]**
**Status:** ⚠️ A implementar (`controls_for_step`)

**Descrição:**
Loop com passo/incremento customizado (ex: contar de 2 em 2, ou de trás pra frente).

**Uso:**
- Contar de 2 em 2 (0, 2, 4, 6...)
- Contar de trás pra frente (10, 9, 8...)
- Percorrer lista pulando elementos
- Criar padrões alternados em LEDs

**Exemplo:**
```
Para i de 0 até 10 pulando de 2:
  Ligar LED número i
  Aguardar 0.3s
```

**Código Python:**
```python
for i in range(0, 10, 2):
  # seu código aqui
```

---

### 7. **Para cada [item] em [lista]**
**Status:** ⚠️ A implementar (`controls_for_each`)

**Descrição:**
Percorre cada elemento de uma lista/array.

**Uso:**
- Mostrar cada emoji de uma lista
- Processar cada valor de sensor
- Executar ação para cada cor
- Tocar cada nota de uma melodia

**Exemplo:**
```
Para cada cor em [vermelho, verde, azul]:
  Acender LED com cor
  Aguardar 1s
```

**Código Python:**
```python
for cor in [vermelho, verde, azul]:
  # seu código aqui
```

---

### 8. **Repetir [N] vezes com contador [variável]**
**Status:** ⚠️ A implementar (`controls_repeat_with_counter`)

**Descrição:**
Similar ao "Repetir N vezes", mas com acesso ao contador atual (útil para iniciantes).

**Uso:**
- Mostrar qual repetição está acontecendo
- Criar efeito crescente/decrescente
- Ajustar comportamento baseado no contador
- Debug visual de loops

**Exemplo:**
```
Repetir 5 vezes com contador i:
  Mostrar "Repetição número" i
  Aguardar 1s
```

**Código Python:**
```python
for i in range(1, 5 + 1):
  # seu código aqui (i vai de 1 a 5)
```

---

## 🎯 Blocos de Controle de Repetição (Extras)

### 9. **Parar repetição**
**Status:** ⚠️ A implementar (`controls_break`)

**Descrição:**
Sai imediatamente do loop (break).

**Uso:**
- Parar quando sensor detecta algo
- Interromper loop infinito por condição
- Sair quando encontrar valor específico

**Exemplo:**
```
Repetir para sempre:
  Se (botão B pressionado):
    Parar repetição
  Piscar LED
```

**Código Python:**
```python
break
```

---

### 10. **Pular para próxima repetição**
**Status:** ⚠️ A implementar (`controls_continue`)

**Descrição:**
Pula para a próxima iteração do loop (continue).

**Uso:**
- Ignorar valores inválidos
- Pular quando sensor não detecta
- Processar apenas valores específicos

**Exemplo:**
```
Para i de 0 até 10:
  Se (i é par):
    Pular para próxima repetição
  Mostrar i (apenas ímpares)
```

**Código Python:**
```python
continue
```

---

## 📊 Prioridade de Implementação

### Alta Prioridade (Essenciais)
1. ✅ Repetir N vezes
2. ⚠️ **Repetir para sempre** - muito usado em robótica
3. ✅ Repetir enquanto
4. ⚠️ **Repetir até** - mais intuitivo para crianças que "enquanto"

### Média Prioridade (Úteis)
5. ✅ Contar de X até Y
6. ⚠️ **Contar com passo** - útil para padrões
7. ⚠️ **Para cada em lista** - conceito importante

### Baixa Prioridade (Avançados)
8. ⚠️ Repetir com contador visível
9. ⚠️ Parar repetição (break)
10. ⚠️ Pular repetição (continue)

---

## 🎨 Exemplos de Uso no BitdogLab

### Exemplo 1: Piscar LED RGB
```
Repetir para sempre:
  Ligar LED RGB (vermelho)
  Aguardar 0.5s
  Ligar LED RGB (azul)
  Aguardar 0.5s
  Ligar LED RGB (verde)
  Aguardar 0.5s
```

### Exemplo 2: Mostrar Números na Matriz de LEDs
```
Contar de 0 até 9:
  Mostrar número na matriz
  Aguardar 1s
```

### Exemplo 3: Animação de Emojis
```
Repetir 3 vezes:
  Mostrar emoji feliz na matriz
  Aguardar 0.5s
  Mostrar emoji triste na matriz
  Aguardar 0.5s
```

### Exemplo 4: Alarme com Buzzer
```
Repetir até (botão verde pressionado):
  Tocar buzzer (nota Dó)
  Aguardar 0.2s
  Parar som
  Aguardar 0.2s
```

### Exemplo 5: Contador com Botão
```
Definir contador = 0
Repetir para sempre:
  Se (botão azul pressionado):
    Aumentar contador
    Mostrar contador na matriz
    Aguardar 0.3s
```

### Exemplo 6: Efeito de Luzes Coloridas
```
Repetir para sempre:
  Contar de 0 até 10 pulando de 2:
    Ligar LED RGB com brilho i
    Aguardar 0.1s
```

### Exemplo 7: Tocar Melodia
```
Repetir 2 vezes:
  Tocar nota Dó
  Aguardar 0.5s
  Tocar nota Mi
  Aguardar 0.5s
  Tocar nota Sol
  Aguardar 0.5s
```

### Exemplo 8: Display Animado
```
Repetir para sempre:
  Preencher matriz (cor vermelha)
  Aguardar 0.3s
  Desligar matriz
  Aguardar 0.3s
```

### Exemplo 9: Jogo Simples com Joystick
```
Definir posição = 5
Repetir para sempre:
  Se (joystick para esquerda):
    Diminuir posição
  Se (joystick para direita):
    Aumentar posição
  Acender LED na posição
  Aguardar 0.1s
```

### Exemplo 10: Sirene com LEDs e Som
```
Repetir 5 vezes:
  Ligar LED RGB (vermelho)
  Tocar buzzer (nota alta)
  Aguardar 0.2s
  Ligar LED RGB (azul)
  Tocar buzzer (nota baixa)
  Aguardar 0.2s
```

---

## 💡 Notas de Design

### Para Crianças:
- Use linguagem simples e direta
- Evite termos técnicos (ex: "para sempre" em vez de "loop infinito")
- Use emojis e cores para diferenciar blocos
- Forneça exemplos visuais claros

### Para Educadores:
- Comece com "Repetir N vezes" (mais simples)
- Introduza "Repetir para sempre" para projetos contínuos
- "Repetir enquanto/até" para sensores
- "Contar" para sequências e animações

### Cores Sugeridas:
- Repetição simples: Verde claro (#4CAF50)
- Repetição infinita: Laranja (#FF9800)
- Repetição condicional: Azul (#2196F3)
- Controle de loop: Vermelho claro (#F44336)
