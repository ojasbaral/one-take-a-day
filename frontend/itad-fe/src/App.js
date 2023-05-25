import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/landing'
import Register from './pages/register'
import Login from './pages/login'
import About from './pages/about'

function App() {
  return (
    <BrowserRouter>
      <main>
        <Routes>
          <Route path='/' element={<Landing></Landing>}></Route>
          <Route path='/register' element={<Register></Register>}></Route>
          <Route path='/login' element={<Login></Login>}></Route>
          <Route path='/about' element={<About></About>}></Route>
        </Routes>
        <script src="../path/to/flowbite/dist/flowbite.min.js"></script>
      </main>
    </BrowserRouter>
  );
}

export default App;
