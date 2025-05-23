import { Route, Routes } from 'react-router-dom'
import { Home } from './pages/home/index.tsx'
import "./style.css"
import { Header } from './components/Header/index.tsx'
import { ProductDisplay } from './pages/ShowProduct/index.tsx'
import { RegisterPage } from './pages/register/index.tsx'
function App() {
  return(
    <>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/productos/:name" element={<ProductDisplay />} />
      <Route path="/registrarse" element={<RegisterPage />} />
    </Routes>
  </>
  )
}

export default App
