
import { FormContainer, MinutesAmountInput, TaskInput } from "./styles"
import { useContext } from "react"
import { CyclesContext } from '../..'
import { useFormContext } from "react-hook-form"


export function NewCycleForm() {
  // usa os contextos
  const { activeCycle } = useContext(CyclesContext)
  const { register } = useFormContext()
  



  return (
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
  )
}