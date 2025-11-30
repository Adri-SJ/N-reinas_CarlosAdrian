import React, { useState, useMemo } from 'react';
import Board from './Board';
import './Solver.css'; 


import { FaPlay, FaSync, FaArrowLeft, FaArrowRight, FaRuler, FaRegLightbulb, FaCheckCircle, FaCrown } from 'react-icons/fa';
import { MdErrorOutline } from 'react-icons/md';


const API_URL = import.meta.env.VITE_API_URL || '/api/solve';

const Solver = () => {
    // -----------------------------------------------------------
    // 1. ESTADO
    // -----------------------------------------------------------
    const [N, setN] = useState(8); 
    const [steps, setSteps] = useState([]); 
    const [currentStepIndex, setCurrentStepIndex] = useState(0); 
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [solutionFound, setSolutionFound] = useState(false);
    
    // -----------------------------------------------------------
    // 2. CÁLCULO DEL ESTADO ACTUAL (Optimizada con useMemo)
    // -----------------------------------------------------------
    const currentBoard = useMemo(() => {
        if (steps.length === 0) {
            return { 
                positions: Array(N).fill(-1), 
                N: N, 
                row: -1, 
                col: -1, 
                action: "INICIO" 
            };
        }
        
        const step = steps[currentStepIndex];
        return {
            positions: step.queens_positions || [],
            N: step.N,
            row: step.current_row,
            col: step.current_col,
            action: step.action,
        };
    }, [steps, currentStepIndex, N]);

    // -----------------------------------------------------------
    // 3. MANEJO DE LA API (handleSolve)
    // -----------------------------------------------------------
    const handleSolve = async () => {
        if (N < 4 || N > 12) {
          alert("N debe estar entre 4 y 12 para evitar el timeout de Vercel.");
          return;
        }

        setIsLoading(true);
        setSteps([]);
        setCurrentStepIndex(0);
        setError(null);
        setSolutionFound(false);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ N }),
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            if (!data.solution_found) {
                setError(`No se encontró solución para N=${N}.`);
                setSteps(data.steps || []); 
                setSolutionFound(false);
            } else {
                setSteps(data.steps);
                setSolutionFound(true);
            }
            
        } catch (err) {
            console.error("Fallo completo de la API:", err);
            setError(`Fallo al conectar con el servidor: ${err.message}. Asegúrate que el Backend esté corriendo.`);
            
        } finally {
            setIsLoading(false);
        }
    };

    // -----------------------------------------------------------
    // 4. NAVEGACIÓN MANUAL
    // -----------------------------------------------------------
    const goToNextStep = () => {
        setCurrentStepIndex(prev => Math.min(steps.length - 1, prev + 1));
    };

    const goToPrevStep = () => {
        setCurrentStepIndex(prev => Math.max(0, prev - 1));
    };
    
    const isFirstStep = currentStepIndex === 0;
    const isLastStep = currentStepIndex === steps.length - 1;


    // -----------------------------------------------------------
    // 5. RENDERIZADO
    // -----------------------------------------------------------
    return (
        <div className="solver-container">
            <h1><FaCrown /> Solucionador N-Reinas</h1>

            <div className="main-layout">
                {/* ------------------------------------- */}
                {/* 1. Panel de Controles/Input (Sidebar) */}
                {/* ------------------------------------- */}
                <div className="control-panel">
                    <h3><FaSync /> Configuración & Acción</h3>
                    
                    {/* Controles de Input */}
                    <div className="input-control">
                        <label>
                            Tamaño N (4-12):
                            <input
                                type="number"
                                value={N}
                                onChange={(e) => setN(parseInt(e.target.value) || 0)}
                                min="4"
                                max="12"
                                disabled={isLoading}
                            />
                        </label>
                    </div>

                    {/* Botón de Resolver */}
                    <button 
                        onClick={handleSolve} 
                        disabled={isLoading || N < 4 || N > 12}
                        style={{ width: '100%', marginBottom: '20px' }}
                    >
                        {isLoading ? (
                            <>Calculando...</>
                        ) : (
                            <><FaPlay /> Iniciar Backtracking</>
                        )}
                    </button>
                    
                    {/* Indicadores de Estado */}
                    {error && (
                        <p style={{ color: '#c0392b', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <MdErrorOutline size={18} /> Error: {error}
                        </p>
                    )}
                    
                    {/* Mostrar estado de la solución */}
                    {solutionFound && isLastStep && (
                        <p style={{ color: '#27ae60', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <FaCheckCircle /> ¡Solución Finalizada!
                        </p>
                    )}

                    {steps.length > 0 && (
                        <>
                            <h3><FaRuler /> Estado del Proceso</h3>
                            <div className="status-info" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                                <p>Paso: <strong>{currentStepIndex + 1}</strong> / <strong>{steps.length}</strong></p>
                                <p>
                                    Acción: 
                                    <strong 
                                      style={{ 
                                        color: currentBoard.action === "COLOCAR" ? '#27ae60' : 
                                               currentBoard.action === "RETROCEDER" ? '#e74c3c' : '#3498db' 
                                      }}
                                    >
                                      {currentBoard.action}
                                    </strong> 
                                    {currentBoard.col !== null && ` en Fila ${currentBoard.row}, Columna ${currentBoard.col}`}
                                </p>
                            </div>

                            {/* Controles de Navegación Manual */}
                            <div className="navigation-controls" style={{ marginTop: '20px', justifyContent: 'space-between' }}>
                                <button onClick={goToPrevStep} disabled={isFirstStep}>
                                    <FaArrowLeft /> Anterior
                                </button>
                                
                                <button onClick={goToNextStep} disabled={isLastStep}>
                                    Siguiente <FaArrowRight />
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* ------------------------------------- */}
                {/* 2. Visualización del Tablero */}
                {/* ------------------------------------- */}
                <div className="board-container">
                    <Board 
                        N={currentBoard.N} 
                        queens={currentBoard.positions} 
                        highlightRow={currentBoard.row}
                        highlightCol={currentBoard.col}
                        action={currentBoard.action}
                    />
                </div>
            </div>
        </div>
    );
};

export default Solver;