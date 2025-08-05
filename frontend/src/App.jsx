import { useState } from 'react'

function App() {
  const [message, setMessage] = useState('Loading...')

  useEffect(() => {
    fetch("http://localhost:8000/api/test")
    .then((res) => res.json())
    .then((data) =>  setMessage(data.message))
    .catch(() => setMessage("Failed to connect"))
  })

  return (
    <>
      <div>
        <h1>Developer social network</h1>
      </div>
    </>
  )
}

export default App
