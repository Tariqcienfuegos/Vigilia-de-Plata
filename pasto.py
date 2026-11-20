import random
import shutil

ancho, alto = shutil.get_terminal_size()
alto = alto - 3
random.seed(7)

# De más oscuro (lejos) a más claro (cerca)
verdes = [22, 22, 28, 34, 58, 64, 100]
hojas = ["|", "|", "|", "!", "l", "I", "'"]

# Cada columna tiene un tono propio (hace hebras verticales)
base = [random.random() for _ in range(ancho)]

# Guardamos todo en una cuadrícula antes de imprimir
cuadricula = []
for fila in range(alto):
    prof = fila / alto
    linea = []
    for col in range(ancho):
        v = prof * 0.6 + base[col] * 0.4 + random.uniform(-0.15, 0.15)
        v = min(max(v, 0), 0.999)
        color = verdes[int(v * len(verdes))]
        linea.append((color, random.choice(hojas)))
    cuadricula.append(linea)

def estampar(f, c, forma, color):
    for i, letra in enumerate(forma):
        if 0 <= f < alto and 0 <= c + i < ancho:
            cuadricula[f][c + i] = (color, letra)

# Flores rojas (grupitos de 2x2)
for _ in range(ancho * alto // 80):
    f = random.randint(alto // 4, alto - 2)
    c = random.randint(0, ancho - 3)
    rojo = random.choice([124, 160, 196])
    estampar(f, c, "@@", rojo)
    estampar(f + 1, c, "@@", rojo)

# Margaritas blancas
for _ in range(ancho * alto // 200):
    f = random.randint(alto // 3, alto - 1)
    c = random.randint(0, ancho - 4)
    estampar(f, c, "(o)", 255)

# Imprimir
for linea in cuadricula:
    texto = ""
    for color, letra in linea:
        texto += f"\033[38;5;{color}m{letra}"
    print(texto + "\033[0m")
