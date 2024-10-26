import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'

// Replace the hardcoded localhost URLs with an environment variable
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080"

function App() {
  const [count, setCount] = useState(0)
  const [array, setArray] = useState([])
  const [skus, setSkus] = useState([])
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  const fetchAPI = async () => {
    const response = await axios.get(`${API_URL}/api/users`)
    setArray(response.data.users)
  }

  const fetchSKUs = async () => {
    const response = await axios.get(`${API_URL}/api/sku`)
    setSkus(response.data.skus)
  }

  const fetchMessages = async () => {
    const response = await axios.get(`${API_URL}/api/messages`)
    setMessages(response.data.messages)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (message.trim()) {
      await axios.post(`${API_URL}/api/messages`, { message })
      setMessage('')
      fetchMessages()
    }
  }

  useEffect(() => {
    fetchAPI()
    fetchSKUs()
    fetchMessages()
  }, [])

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
          {
            array.map((user,index) => (
              <div key={index}>
              <span key={index}>{user}</span><br></br>
              </div>
            ))
          }
      </div>
      <div className="sku-list">
        <h3>Available SKUs:</h3>
        {
          skus.map((sku, index) => (
            <div key={index}>
              <span>{sku}</span><br/>
            </div>
          ))
        }
      </div>
      <div className="message-form">
        <h3>Add Message</h3>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message"
          />
          <button type="submit">Submit</button>
        </form>
        
        <div className="messages">
          <h3>Stored Messages:</h3>
          {messages.map((msg, index) => (
            <div key={index}>
              <p>{msg}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default App
