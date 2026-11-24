import { useState } from 'react'
import Header from "./components/organisms/Header"
import Calendar from "./components/molecules/Calendar"

function App() {
  return (
    <>
    <Header onOpenToday={() => alert("Dagens låge åbnes!")} />
      <Calendar />
    </>
  )
}

export default App