import { useEffect, useState } from "react"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod' // Resolver para integrar hook-form e zod
import * as zod from 'zod' // Biblioteca de validações
import { 
  HomeContainer, 
  FormContainer, 
  CountdownContainer, 
  Separator, 
  StartCountdownButton, 
  StopCountdownButton, 
  TaskInput, 
  MinutesAmountInput 
} from "./styles"
import { HandPalm, Play} from "phosphor-react"
import { differenceInSeconds } from 'date-fns'

// Controlled and uncontrolled components
// Controlled component sempre armazena os valores inseridos em um estado
// Uncontrolled component só busca um valor quando ele for necessário

// Variável definindo regras de validação
const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number()
    .min(1, "O ciclo mínimo é de 5 min")
    .max(60, "O ciclo máximo é de 60 min"),
});

// Cria a "interface" através do zod.infer
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

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
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  // Desconstruindo o retorno de useForm
  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema), // Aplicando a validação
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  }); 

  const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;

  // Comparando com o Vue.js, useEffect parece uma combinação de mounted() e watch,
  // ou seja, ele vai executar uma instrução quando o componente for renderizado
  // e também quando uma variável especifica for atualizada. Esses comportamentos podem ser manipulados
  useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(new Date(), activeCycle.startDate)

        if (secondsDifference >= totalSeconds) {
          setCycles(state => state.map((cycle) => {
            if (cycle.id === activeCycleId) {
              return { ...cycle, finishedDate: new Date() }
            } else {
              return cycle
            }
          }))

          setAmountSecondsPassed(totalSeconds)

          clearInterval(interval)
        } else {
          setAmountSecondsPassed(secondsDifference)
        }

        
      }, 1000)
    }

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
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput 
            type="text" 
            id="task" 
            placeholder="Dê um nome para o seu projeto"
            disabled={!!activeCycle}
            list="task-suggestions"
            {...register('task')} // register recebe o nome do componente e retorna algumas funções
          />

          <datalist id="task-suggestions">
            <option value="Projeto 1" />
            <option value="Projeto 2" />
            <option value="Projeto 3" />
            <option value="Mergear branches" />
          </datalist>

          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput 
            type="number" 
            id="minutesAmount" 
            placeholder="00" 
            step={5}
            min={1}
            max={60}
            disabled={!!activeCycle}
            {...register('minutesAmount', { valueAsNumber: true })}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

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