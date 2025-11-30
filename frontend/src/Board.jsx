import React from 'react';


/**
 * Componente que renderiza el tablero de ajedrez y las reinas.
 * @param {number} N - Tamaño del tablero (NxN).
 * @param {number[]} queens - Array de posiciones de reinas (queens[fila] = columna).
 * @param {number} highlightRow - Fila actual para resaltar.
 * @param {number} highlightCol - Columna actual para resaltar.
 * @param {string} action - Acción actual (COLOCAR, RETROCEDER, etc.)
 */
const Board = ({ N, queens, highlightRow, highlightCol, action }) => {
  if (N < 4) return <p>Ingresa un valor de N válido (4-12) y presiona Resolver.</p>;
  
  const cells = [];
  
  // Iterar sobre filas y columnas para crear las celdas
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      
      // Determina la clase CSS para el patrón de ajedrez
      const isBlack = (r + c) % 2 !== 0; 
      
      // Verifica si hay una reina en esta celda
      const hasQueen = queens[r] === c; 
      
      // Verifica si es la celda que se está procesando actualmente
      const isCurrentCell = r === highlightRow && c === highlightCol;
      
      // Lógica de resaltado para la visualización del backtracking
      let highlightClass = '';
      if (isCurrentCell) {
          if (action === 'COLOCAR') {
              highlightClass = 'cell-placing'; 
          } else if (action === 'RETROCEDER') {
              highlightClass = 'cell-backtracking'; 
          } else if (action === 'SOLUCION_ENCONTRADA') {
              highlightClass = 'cell-solution';
          }
      }

      cells.push(
        <div 
          key={`${r}-${c}`}
          className={`cell ${isBlack ? 'black' : 'white'} ${highlightClass}`}
        >
          {hasQueen && (
            <span 
              className="queen-icon" 
              role="img" 
              aria-label="queen"
            >
              ♕
            </span>
          )}
        </div>
      );
    }
  }

  return (
    <div 
      className="chess-board"
      style={{
        gridTemplateColumns: `repeat(${N}, 1fr)`,
        gridTemplateRows: `repeat(${N}, 1fr)`,
        
      }}
    >
      {cells}
    </div>
  );
};

export default Board;