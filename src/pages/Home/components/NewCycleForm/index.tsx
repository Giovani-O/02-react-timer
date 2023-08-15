import { useForm } from "react-hook-form";
import { FormContainer, MinutesAmountInput, TaskInput } from "./styles";
import * as zod from 'zod' // Biblioteca de validações
import { zodResolver } from '@hookform/resolvers/zod' // Resolver para integrar hook-form e zod


export function NewCycleForm() {
  // Variável definindo regras de validação
const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number()
    .min(1, "O ciclo mínimo é de 5 min")
    .max(60, "O ciclo máximo é de 60 min"),
});

// Cria a "interface" através do zod.infer
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

  // Desconstruindo o retorno de useForm
  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema), // Aplicando a validação
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  }); 

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