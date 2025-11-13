import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Welcome } from './components/Welcome'
import { Home } from './components/Home'
import { Profile } from './components/Profile'
import { Chat } from './components/Chat'
import { Schedule } from './components/Schedule'
import { MyProfile } from './components/MyProfile'
import { Signup } from './components/Signup'
import { Login } from './components/Login'
import { CompleteProfile } from './components/CompleteProfile'
import { Matches } from './components/Matches'
import { ChatWindow } from './components/ChatWindow'
import { Learn } from './components/Learn'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome onGetStarted={() => window.location.href = '/signup'} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/chat" element={<ChatWindow />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/my-profile" element={<MyProfile />} />
      </Routes>
    </Router>
  )
}

export default App
