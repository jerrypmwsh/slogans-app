import './App.css'
import { Container } from '@mui/material'
import NavBar from './NavBar'
import Table from './Table'

function App() {
  return (
    <Container sx={{width: 1}}>
      <NavBar></NavBar>
      <Table></Table>
    </Container>
    
  )
}

export default App
