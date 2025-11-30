from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from .nqueens_logic import solve_n_queens_visual

app = FastAPI(title="Solucionador N-Reinas")

class NQueensInput(BaseModel):
    N: int = Field(..., ge=4, le=12, description="Tamaño del tablero N. Debe estar entre 4 y 12.")


@app.get("/")
def read_root():
    return {"message": " Simulador N-reinas API está funcionando. Usa /api/solve (POST)."}

@app.post("/api/solve")
def solve(input_data: NQueensInput):
    # Llamar a la función que calcula todos los pasos visuales
    try:
        result = solve_n_queens_visual(input_data.N)
        return result
    except Exception as e:
        # Manejo de errores genérico (aunque para N<12 no debería haber problemas)
        raise HTTPException(status_code=500, detail=f"Error en el algoritmo: {str(e)}")