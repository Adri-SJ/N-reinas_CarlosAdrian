from typing import List, Dict, Any, Optional

VISUAL_STEPS: List[Dict[str, Any]] = []

def _record_step(board: List[int], N: int, action: str, row: int, col: Optional[int] = None):
    """Guarda una instantánea del estado actual del tablero y la acción realizada."""
    
    current_state = list(board)
    
    
    VISUAL_STEPS.append({
        "queens_positions": current_state, 
        "current_row": row,
        "current_col": col,
        "action": action, 
        "N": N
    })


def _is_safe(row: int, col: int, board: List[int]) -> bool:
   
    
    # Iteramos sobre todas las filas anteriores
    for prev_row in range(row):
        prev_col = board[prev_row]
        
        # Si la columna de la reina anterior es igual a la actual
        if prev_col == col:
            return False
            
        # Diagonal Principal (diferencia de filas == diferencia de columnas)
        if abs(row - prev_row) == abs(col - prev_col):
            return False
            
    return True

def _solve_n_queens_util(row: int, N: int, board: List[int]) -> bool:
    
    # Si se han colocado reinas en todas las filas (0 a N-1)
    if row == N:
        # En este punto se ha encontrado una solución
        _record_step(board, N, "SOLUCION_ENCONTRADA", row)
        return True 
        
    for col in range(N):
        
        if _is_safe(row, col, board):
            
            board[row] = col
            
            _record_step(board, N, "COLOCAR", row, col)
            
            if _solve_n_queens_util(row + 1, N, board):
                return True 
            
            _record_step(board, N, "RETROCEDER", row, col)
            board[row] = -1 
            
    return False

def solve_n_queens_visual(N: int) -> Dict[str, Any]:
    """Función principal para el endpoint."""
    
    global VISUAL_STEPS
    VISUAL_STEPS = []
    
    board = [-1] * N
    
    _record_step(board, N, "INICIO", 0)
    
    solution_found = _solve_n_queens_util(0, N, board)
    
    return {
        "N": N,
        "solution_found": solution_found,
        "final_solution": board if solution_found else [],
        "steps": VISUAL_STEPS
    }