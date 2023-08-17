import { CountdownContainer, Separator } from "./styles"
import { useEffect, useContext } from "react"
import { differenceInSeconds } from 'date-fns'
import { CyclesContext } from "../../../../contexts/CyclesContext"

export function Countdown() {
  // Usa o contexto, desconstruindo com todas as propriedades e funções
  const { 
    activeCycle, 
    activeCycleId, 
    markCurrentCycleAsFinished, 
    amountSecondsPassed, 
    setSecondsPassed
  } = useContext(CyclesContext)
  

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  // Comparando com o Vue.js, useEffect parece uma combinação de mounted() e watch,
  // ou seja, ele vai executar uma instrução quando o componente for renderizado
  // e também quando uma variável especifica for atualizada. Esses comportamentos podem ser manipulados
  // Se houver um ciclo ativo, atualiza a página a cada 1 segundo até finalizar e atualiza os estados
  useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(), 
          activeCycle.startDate,
        )

        if (secondsDifference >= totalSeconds) {
          markCurrentCycleAsFinished()
          setSecondsPassed(totalSeconds)
          clearInterval(interval)
        } else {
          setSecondsPassed(secondsDifference)
        }

      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, totalSeconds, activeCycleId, markCurrentCycleAsFinished, setSecondsPassed])

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;

  const minutesAmount = Math.floor(currentSeconds / 60);
  const secondsAmount = currentSeconds % 60;

  // padStart insere caracteres no início de uma string até ela alcançar o comprimento determinado
  const minutes = String(minutesAmount).padStart(2, '0');
  const seconds = String(secondsAmount).padStart(2, '0');
  
  // Altera o nome da página ao iniciar um ciclo
  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds} - ${activeCycle.task}`
    }
  }, [minutes, seconds, activeCycle])

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  )
}