import { HomeContainer, FormContainer, CountdownContainer, Separator, StartCountdownButton, TaskInput, MinutesAmountInput } from "./styles";
import { Play } from "phosphor-react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'; // Resolver para integrar hook-form e zod
import * as zod from 'zod' // Biblioteca de validações

// Controlled and uncontrolled components
// Controlled component sempre armazena os valores inseridos em um estado
// Uncontrolled component só busca um valor quando ele for necessário

// Variável definindo regras de validação
const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmout: zod.number()
    .min(5, "O ciclo mínimo é de 5 min")
    .max(60, "O ciclo máximo é de 60 min"),
});

export function Home() {
  const { register, handleSubmit, watch } = useForm({
    resolver: zodResolver(newCycleFormValidationSchema), // Aplicando a validação
  }); // Desconstruindo o retorno de useForm

  function handleCreateNewCycle(data: any) {
    console.log(data)
  }

  const task = watch ('task')
  const isSubmitDisabled = !task;

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput 
            type="text" 
            id="task" 
            placeholder="Dê um nome para o seu projeto"
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
            min={5}
            max={60}
            {...register('minutesAmount', { valueAsNumber: true })}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>

        <StartCountdownButton disabled={isSubmitDisabled} type="submit">
          <Play size={24} />
          Iniciar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}