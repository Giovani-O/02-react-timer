import { FormProvider, useForm } from 'react-hook-form'
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'
import { HandPalm, Play } from 'phosphor-react'
import { NewCycleForm } from './components/NewCycleForm'
import { Countdown } from './components/Countdown'
import * as zod from 'zod' // Biblioteca de validações
import { zodResolver } from '@hookform/resolvers/zod' // Resolver para integrar hook-form e zod
import { useContext } from 'react'
import { CyclesContext } from '../../contexts/CyclesContext'

// Controlled and uncontrolled components
// Controlled component sempre armazena os valores inseridos em um estado
// Uncontrolled component só busca um valor quando ele for necessário

// Variável definindo regras de validação, biblioteca zod
const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(5, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo mínimo é de 5 min')
    .max(60, 'O ciclo máximo é de 60 min'),
})

// Cria a "interface" através do zod.infer
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {
  const { activeCycle, createNewCycle, interruptCurrentCycle } =
    useContext(CyclesContext)

  // Desconstruindo o retorno de useForm
  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema), // Aplicando a validação
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  // obtém métodos do useForm do React hook form
  const { handleSubmit, watch, reset } = newCycleForm

  function handleCreateNewCycle(data: NewCycleFormData) {
    createNewCycle(data)
    reset()
  }

  const task = watch('task')
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        {/* Provider do contexto */}
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Countdown />

        {activeCycle && !activeCycle.finishedDate ? (
          <StopCountdownButton type="button" onClick={interruptCurrentCycle}>
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Iniciar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
