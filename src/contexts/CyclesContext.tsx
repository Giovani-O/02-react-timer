import { ReactNode, createContext, useState, useReducer } from "react";

interface CreateCycleData {
  task: string
  minutesAmount: number
}

// Tipagem principal dos ciclos
interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

// Tipagem do contexto, quais propriedades/funções ele pode enviar
interface CyclesContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
  createNewCycle:  (data: CreateCycleData) => void
  interruptCurrentCycle: () => void
}

// Criação e tipagem do contexto
export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
  children: ReactNode
}

interface CyclesState {
  cycles: Cycle[],
  activeCycleId: string | null
}

export function CyclesContextProvider({ 
  children 
}: CyclesContextProviderProps) {
  // Usando reducer
  const [cyclesState, dispatch] = useReducer(
    (state: CyclesState, action: any) => {
      if (action.type === 'ADD_NEW_CYCLE') {
        return {
          ...state,
          cycles: [...state.cycles, action.payload.newCycle],
          activeCycleId: action.payload.newCycle.id,
        }
      }
      
      if (action.type === 'INTERRUPT_CURRENT_CYCLE') {
        return {
          ...state,
          cycles: state.cycles.map((cycle) => {
            if (cycle.id === state.activeCycleId) {
              return { ...cycle, interruptedDate: new Date() }
            } else {
              return cycle
            }
          }),
          activeCycleId: null,
        }
      }

      return state
    }, 
    {
      cycles: [],
      activeCycleId: null
    }
  )
  
  // usando os estados necessários
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)
  
  const { cycles, activeCycleId } = cyclesState;

  // Busca o ciclo ativo
  const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

  // Função com retorno void para o contexto
  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function markCurrentCycleAsFinished() {
    dispatch({
      type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
      payload: {
        activeCycleId,
      }
    })
    // setCycles(state => 
    //   state.map((cycle) => {
    //     if (cycle.id === activeCycleId) {
    //       return { ...cycle, finishedDate: new Date() }
    //     } else {
    //       return cycle
    //     }
    //   }),
    // )
  }

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime());

    const newCycle: Cycle = {
      id: id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }
    
    dispatch({
      type: 'ADD_NEW_CYCLE',
      payload: {
        newCycle,
      }
    })
    // setCycles(state => [...state, newCycle])
    setAmountSecondsPassed(0)

    // reset()
  }

  function interruptCurrentCycle() {
    dispatch({
      type: 'INTERRUPT_CURRENT_CYCLE',
      payload: {
        activeCycleId,
      }
    })
  }

  return (
    <CyclesContext.Provider value={{ 
      cycles,
      activeCycle, 
      activeCycleId, 
      markCurrentCycleAsFinished, 
      amountSecondsPassed, 
      setSecondsPassed,
      createNewCycle,
      interruptCurrentCycle
    }}>
      {children}
    </CyclesContext.Provider>
  )
}