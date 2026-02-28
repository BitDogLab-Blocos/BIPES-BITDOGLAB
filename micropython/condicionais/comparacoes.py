# comparacoes.py
# Operações de comparação e lógica
# Blocos: Se, Senão, comparações, E, OU, NÃO

def igual(a, b):
    """Verifica se a é igual a b."""
    return a == b

def diferente(a, b):
    """Verifica se a é diferente de b."""
    return a != b

def menor_que(a, b):
    """Verifica se a é menor que b."""
    return a < b

def menor_ou_igual(a, b):
    """Verifica se a é menor ou igual a b."""
    return a <= b

def maior_que(a, b):
    """Verifica se a é maior que b."""
    return a > b

def maior_ou_igual(a, b):
    """Verifica se a é maior ou igual a b."""
    return a >= b

def e_logico(a, b):
    """Operação lógica E (AND)."""
    return bool(a) and bool(b)

def ou_logico(a, b):
    """Operação lógica OU (OR)."""
    return bool(a) or bool(b)

def nao_logico(valor):
    """Operação lógica NÃO (NOT)."""
    return not bool(valor)

def se_condicao(condicao, valor_verdadeiro, valor_falso):
    """
    Retorna um valor baseado na condição.
    
    Args:
        condicao: Expressão booleana
        valor_verdadeiro: Valor retornado se condição for True
        valor_falso: Valor retornado se condição for False
        
    Returns:
        O valor verdadeiro ou falso conforme a condição
    """
    return valor_verdadeiro if condicao else valor_falso

# Exemplo de uso
if __name__ == "__main__":
    print(f"5 == 5: {igual(5, 5)}")
    print(f"5 > 3: {maior_que(5, 3)}")
    print(f"True AND False: {e_logico(True, False)}")
    print(f"True OR False: {ou_logico(True, False)}")
    print(f"NOT True: {nao_logico(True)}")
    print(f"Se (5 > 3) entao 'maior' senao 'menor': {se_condicao(5 > 3, 'maior', 'menor')}")
