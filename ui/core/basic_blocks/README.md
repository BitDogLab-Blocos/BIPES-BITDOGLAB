# Basic Blocks - Control and Logic

Simple blocks for repetition, logic, and basic control flow.

## Files

- `blocks_basic_definitions.js` - Block definitions (UI)
- `generator_basic.js` - Python code generators

## Blocks Included

### Repetition Blocks

1. **Repetir N vezes** (`controls_repeat_simple`)
   - Repeats actions a specific number of times
   - Example: Repeat 10 times

2. **Repetir enquanto** (`controls_while_simple`)
   - Repeats while condition is true
   - Example: Repeat while x < 10

3. **Para** (`controls_for_simple`)
   - Counts from one number to another
   - Example: For i from 1 to 10

### Logic Blocks

4. **Se** (`controls_if_simple`)
   - Executes actions if condition is true
   - Example: If x > 5

5. **Se-senão** (`controls_if_else_simple`)
   - Executes one action if true, another if false
   - Example: If x > 5 then ... else ...

### Comparison Blocks

6. **Comparação** (`logic_compare_simple`)
   - Compares two values: =, ≠, <, ≤, >, ≥
   - Returns true or false

### Logical Operators

7. **E/Ou** (`logic_operation_simple`)
   - Combines conditions with AND or OR
   - Example: x > 5 and y < 10

8. **Não** (`logic_not_simple`)
   - Inverts boolean value
   - Example: not (x > 5)

### Time Block

9. **Aguardar** (`time_delay_simple`)
   - Pauses execution for seconds
   - Example: Wait 1 second

## How to Use

Add these scripts to your HTML file:

```html
<script src="core/basic_blocks/blocks_basic_definitions.js"></script>
<script src="core/basic_blocks/generator_basic.js"></script>
```

## Code Generation Examples

### Repeat N times
```python
for _i in range(10):
  # your code here
```

### While loop
```python
while x < 10:
  # your code here
```

### For loop
```python
for i in range(1, 10 + 1):
  # your code here
```

### If-else
```python
if x > 5:
  # your code here
else:
  # alternative code
```

### Comparison
```python
x == 10  # equals
x != 10  # not equals
x < 10   # less than
```

### Logical operators
```python
x > 5 and y < 10  # AND
x > 5 or y < 10   # OR
not (x > 5)       # NOT
```

### Delay
```python
import time
time.sleep(1)
```
