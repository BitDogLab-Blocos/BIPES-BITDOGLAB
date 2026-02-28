# operacoes.py
# Operações matemáticas básicas
# Blocos: operações matemáticas, arredondamento, etc

import math
import random

def somar(a, b):
    """Soma dois números."""
    return a + b

def subtrair(a, b):
    """Subtrai dois números."""
    return a - b

def multiplicar(a, b):
    """Multiplica dois números."""
    return a * b

def dividir(a, b):
    """Divide dois números."""
    if b == 0:
        return 0
    return a / b

def potencia(base, expoente):
    """Calcula a potência."""
    return base ** expoente

def resto(dividendo, divisor):
    """Retorna o resto da divisão."""
    if divisor == 0:
        return 0
    return dividendo % divisor

def arredondar(numero):
    """Arredonda para o inteiro mais próximo."""
    return round(numero)

def arredondar_para_cima(numero):
    """Arredonda para cima."""
    return math.ceil(numero)

def arredondar_para_baixo(numero):
    """Arredonda para baixo."""
    return math.floor(numero)

def limitar(valor, minimo, maximo):
    """Limita um valor entre mínimo e máximo."""
    return max(minimo, min(valor, maximo))

def numero_aleatorio(minimo, maximo):
    """Retorna um número inteiro aleatório."""
    return random.randint(minimo, maximo)

def decimal_aleatorio(minimo, maximo):
    """Retorna um número decimal aleatório."""
    return random.uniform(minimo, maximo)

def raiz_quadrada(numero):
    """Calcula a raiz quadrada."""
    return math.sqrt(numero)

def valor_absoluto(numero):
    """Retorna o valor absoluto."""
    return abs(numero)

def seno(angulo_graus):
    """Calcula o seno de um ângulo em graus."""
    return math.sin(math.radians(angulo_graus))

def cosseno(angulo_graus):
    """Calcula o cosseno de um ângulo em graus."""
    return math.cos(math.radians(angulo_graus))

# Constantes matemáticas
PI = math.pi
EULER = math.e

# Exemplo de uso
if __name__ == "__main__":
    print(f"Soma: {somar(5, 3)}")
    print(f"Multiplicacao: {multiplicar(4, 7)}")
    print(f"Raiz quadrada de 16: {raiz_quadrada(16)}")
    print(f"Numero aleatorio (1-10): {numero_aleatorio(1, 10)}")
    print(f"PI: {PI}")
