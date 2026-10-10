import { AdminDashboard } from './components/admin/AdminDashboard'
import { Presentation } from './components/Presentation'
import { FarmerMobile } from './components/mobile/FarmerMobile'
import './App.css'
import './Activity.css'
import { useLanguage } from './lib/language'
import { AuthGate } from './components/auth/AuthGate'

function App() {
  useLanguage()
  if (new URLSearchParams(window.location.search).get('preview') === 'farmer') return <AuthGate role="Farmer"><FarmerMobile /></AuthGate>
  return <Presentation><AuthGate role="Admin"><AdminDashboard /></AuthGate></Presentation>
}

export default App
