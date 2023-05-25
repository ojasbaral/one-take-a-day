import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/landing'

function App() {
  return (
    <BrowserRouter>
      <main>
        <Routes>
          <Route path='/' element={<Landing></Landing>}></Route>
        </Routes>
        <script src="../path/to/flowbite/dist/flowbite.min.js"></script>
      </main>
    </BrowserRouter>
  );
}

export default App;
