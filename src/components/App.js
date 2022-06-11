// Importing the React Router Dom Library
import { Routes, Route, Navigate } from 'react-router-dom'

// Importing the context provider
import DataContextProvider from '../contexts/DataContext'

// Importing the components
import BootupTime from './BootupTime'
import MainThreadWorkBreakdown from './MainThreadWorkBreakDown'
import NetworkRequests from './NetworkRequests'
import NetworkRTT from './NetworkRTT'
import NetworkServerLatency from './NetworkServerLatency'
import ResourceSummary from './ResourceSummary'
import Search from './Search'
import ThirdPartySummary from './ThirdPartySummary'



/**
 * The main component of the application that renders the different components. It also handles the routing of the different components. 
 * @returns {JSX} - The JSX to be rendered
 */
export default function App() {
  return (
    <>
      <DataContextProvider>
        <Routes>
          <Route path="/" element={<Search />}></Route>
          <Route path='/bootup-time' element={<BootupTime />}></Route>
          <Route path='/mainthread-work-breakdown' element={<MainThreadWorkBreakdown />}></Route>
          <Route path='/network-requests' element={<NetworkRequests />}></Route>
          <Route path='/network-rtt' element={<NetworkRTT />}></Route>
          <Route path='/network-server-latency' element={<NetworkServerLatency />}></Route>
          <Route path='/resource-summary' element={<ResourceSummary />}></Route>
          <Route path='/third-party-summary' element={<ThirdPartySummary />}></Route>
          <Route path="*" element={<Navigate to='/' />} />
        </Routes>
      </DataContextProvider>
    </>

  )
}

