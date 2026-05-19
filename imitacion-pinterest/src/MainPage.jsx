import { HashRouter, Routes, Route } from 'react-router-dom'
import Header from './GeneralComponents/Header.jsx'
import Feed from './PagesComponents/Feed.jsx'
import PinDetail from './PinComponents/PinDetail.jsx'
import ProfilePage from './ProfileComponents/ProfilePage.jsx'
import Login from './ProfileComponents/Login.jsx'
import Register from './ProfileComponents/Register.jsx'
import Discover from './PagesComponents/Discover.jsx'
import Update from './PagesComponents/Update.jsx'
import Create from './PagesComponents/Create.jsx'
import './scss/styles.scss'
import './style.css'
import * as bootstrap from 'bootstrap'
import './theme.js'


function MainPage() {
  return (
      <HashRouter>
        <Header />
        
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/pin/:id" element={
            <>
              <PinDetail /> 
              <Feed />
              </>
          } />
          <Route path="/profile" element={<ProfilePage /> } />
          <Route path="/profile/login" element={<Login />} />
          <Route path="/profile/register" element={<Register />} />
          <Route path="/create" element={<Create />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/modboard/:id" element={
            <Update type="board" />
          } />
          <Route path="/modpin/:id" element={
            <Update type="pin" />
          } />
          <Route path="*" element={<h2 className="text-center mt-5">404 - Página no encontrada</h2>} />
        </Routes>
      </HashRouter>
  )
}

export default MainPage;

