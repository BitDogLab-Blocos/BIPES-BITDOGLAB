# manipulacao_texto.py
# Manipulação de strings/texto
# Blocos: texto, substring, maiúsculas/minúsculas

def obter_substring(texto, inicio, fim):
    """
    Obtém uma parte do texto.
    
    Args:
        texto: String original
        inicio: Posição inicial (0 = primeiro caractere)
        fim: Posição final
        
    Returns:
        str: Substring resultante
    """
    return texto[inicio:fim]

def para_maiusculas(texto):
    """Converte texto para maiúsculas."""
    return texto.upper()

def para_minusculas(texto):
    """Converte texto para minúsculas."""
    return texto.lower()

def juntar_texto(*partes):
    """
    Junta várias partes de texto.
    
    Args:
        *partes: Strings para juntar
        
    Returns:
        str: Texto concatenado
    """
    return ''.join(str(parte) for parte in partes)

def tamanho_texto(texto):
    """Retorna o número de caracteres do texto."""
    return len(texto)

def substituir_texto(texto, antigo, novo):
    """Substitui parte do texto."""
    return texto.replace(antigo, novo)

def contem_texto(texto, substring):
    """Verifica se o texto contém uma substring."""
    return substring in texto

def texto_para_numero(texto):
    """Converte texto para número inteiro."""
    try:
        return int(texto)
    except:
        return 0

def numero_para_texto(numero):
    """Converte número para texto."""
    return str(numero)

# Exemplo de uso
if __name__ == "__main__":
    texto = "Ola, BitDogLab!"
    print(f"Original: {texto}")
    print(f"Maiusculas: {para_maiusculas(texto)}")
    print(f"Substring (0-3): {obter_substring(texto, 0, 3)}")
    print(f"Juntar: {juntar_texto('A', 'B', 'C')}")
