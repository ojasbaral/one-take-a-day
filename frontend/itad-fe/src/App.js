import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/landing'

function App() {
  return (
    <BrowserRouter>
      <main>
        <Routes>
          <Route path='/' element={<Landing></Landing>}></Route>
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
