import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/landing'
import Register from './pages/register'
import Login from './pages/login'
import About from './pages/about'
import Feed from './pages/feed'
import ErrorPage from './pages/errorPage'
import PostPage from './pages/postPage'
import Account from './pages/account'
import Friends from './pages/friends'
import Search from './pages/search'

function App() {
  return (
    <BrowserRouter>
      <main>
        <Routes>
          <Route path='/' element={<Landing></Landing>}></Route>
          <Route path='/register' element={<Register></Register>}></Route>
          <Route path='/login' element={<Login></Login>}></Route>
          <Route path='/about' element={<About></About>}></Route>
          <Route path='/home/:id' element={<Feed></Feed>}></Route>
          <Route path="/error" element={<ErrorPage></ErrorPage>}></Route>
          <Route path='/post/:id/:user_id' element={<PostPage></PostPage>}></Route>
          <Route path='/account/:id/:view_id' element={<Account></Account>}></Route>
          <Route path='/friends/:id' element={<Friends></Friends>}></Route>
          <Route path='/search/:id/:word' element={<Search></Search>}></Route>
        </Routes>
        <script src="../path/to/flowbite/dist/flowbite.min.js"></script>
      </main>
    </BrowserRouter>
  );
}

export default App;
