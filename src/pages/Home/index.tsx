import { createContext, useState } from "react"
import { FormProvider, useForm } from 'react-hook-form'
import { 
  HomeContainer,
  StartCountdownButton, 
  StopCountdownButton,
} from "./styles"
import { HandPalm, Play} from "phosphor-react"
import { NewCycleForm } from "./components/NewCycleForm"
import { Countdown } from "./components/Countdown"
import * as zod from 'zod' // Biblioteca de validações
import { zodResolver } from '@hookform/resolvers/zod' // Resolver para integrar hook-form e zod

// Controlled and uncontrolled components
// Controlled component sempre armazena os valores inseridos em um estado
// Uncontrolled component só busca um valor quando ele for necessário

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
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
}

// Criação e tipagem do contexto
export const CyclesContext = createContext({} as CyclesContextType)

// Variável definindo regras de validação, biblioteca zod
const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number()
    .min(1, "O ciclo mínimo é de 5 min")
    .max(60, "O ciclo máximo é de 60 min"),
});

// Cria a "interface" através do zod.infer
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {
  // usando os estados necessários
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  // Desconstruindo o retorno de useForm
  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema), // Aplicando a validação
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  }); 

  // obtém métodos do useForm do React hook form
  const {handleSubmit, watch, reset } = newCycleForm

  // Busca o ciclo ativo
  const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

  // Função com retorno void para o contexto
  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }
    
  function markCurrentCycleAsFinished() {
    setCycles(state => 
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, finishedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
  }

  function handleCreateNewCycle(data: NewCycleFormData) {
    const id = String(new Date().getTime());

    const newCycle: Cycle = {
      id: id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }
    
    setCycles(state => [...state, newCycle])
    setActiveCycleId(id)
    setAmountSecondsPassed(0)

    reset()
  }

  function handleInterruptCycle() {
    setCycles(state => state.map((cycle) => {
      if (cycle.id === activeCycleId) {
        return { ...cycle, interruptedDate: new Date() }
      } else {
        return cycle
      }
    }))

    setActiveCycleId(null)
  }

  const task = watch ('task');
  const isSubmitDisabled = !task;
  
  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        {/* Provider do contexto */}
        <CyclesContext.Provider value={{ 
          activeCycle, 
          activeCycleId, 
          markCurrentCycleAsFinished, 
          amountSecondsPassed, 
          setSecondsPassed 
        }}>
          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>
          <Countdown />
        </CyclesContext.Provider>

        {
          activeCycle ? 
            (
              <StopCountdownButton type="button" onClick={handleInterruptCycle}>
                <HandPalm size={24} />
                Interromper
              </StopCountdownButton>
            ) 
            : 
            (
              <StartCountdownButton disabled={isSubmitDisabled} type="submit">
                <Play size={24} />
                Iniciar
              </StartCountdownButton>
            )
        }
      </form>
    </HomeContainer>
  )
}