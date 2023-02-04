import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import LoginButton from './LoginButton'
import LogoutButton from './LogoutButton'
import Profile from './Profile'
import Table from './Table'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Table></Table>
      <LoginButton></LoginButton>
      <LogoutButton></LogoutButton>
      <Profile></Profile>
    </div>
  )
}

export default App
