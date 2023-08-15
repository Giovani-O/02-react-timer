import { CountdownContainer, Separator } from "./styles"
import { useState, useEffect } from "react"
import { differenceInSeconds } from 'date-fns'

interface CountdownProps {
  activeCycle: any;
  setCycles: any;
  activeCycleId: any;
}

export function Countdown({ activeCycle, setCycles, activeCycleId}: CountdownProps) {
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

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