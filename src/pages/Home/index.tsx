import { useEffect, useState } from "react"
import { useForm } from 'react-hook-form'


import { 
  HomeContainer,
  StartCountdownButton, 
  StopCountdownButton,
} from "./styles"
import { HandPalm, Play} from "phosphor-react"
import { differenceInSeconds } from 'date-fns'
import { NewCycleForm } from "./components/NewCycleForm"
import { Countdown } from "./components/Countdown"

// Controlled and uncontrolled components
// Controlled component sempre armazena os valores inseridos em um estado
// Uncontrolled component só busca um valor quando ele for necessário



interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

  

  const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

  

  

    // exclui intervalos que naão são mais utilizados
    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, totalSeconds, activeCycleId])

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


  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;

  const minutesAmount = Math.floor(currentSeconds / 60);
  const secondsAmount = currentSeconds % 60;

  // padStart insere caracteres no início de uma string até ela alcançar o comprimento determinado
  const minutes = String(minutesAmount).padStart(2, '0');
  const seconds = String(secondsAmount).padStart(2, '0');
  const task = watch ('task');
  const isSubmitDisabled = !task;

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds} - ${activeCycle.task}`
    }
  }, [minutes, seconds, activeCycle])

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <NewCycleForm />
        <Countdown 
          activeCycle={activeCycle} 
          setCycles={setCycles} 
          activeCycleId={activeCycleId}
        />

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