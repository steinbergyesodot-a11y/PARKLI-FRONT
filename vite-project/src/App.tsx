import './App.css'
import { Home } from './components/Home'
import 'leaflet/dist/leaflet.css';
import { DrivewayCard } from './components/DrivewayCard';
import { Dashboard } from './components/Dashboard';
import { DrivewayDetailed } from './components/DrivewayDetailed';
import { ProfileDropdown } from './components/ProfileDropdown';
import { Analytics } from '@vercel/analytics/react';



function App() {

  return (
    <>
   <Home/>
       <Analytics />
    </>
  )
}

export default App
