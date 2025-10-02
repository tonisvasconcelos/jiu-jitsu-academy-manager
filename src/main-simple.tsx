import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/index.css'

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🥋 Jiu-Jitsu International Team</h1>
      <p>Welcome to the Jiu-Jitsu Team Management System!</p>
      <div style={{ marginTop: '20px' }}>
        <h2>Features:</h2>
        <ul>
          <li>Student Management</li>
          <li>Teacher Management</li>
          <li>Branch Management</li>
          <li>Bilingual Support (PT/EN)</li>
        </ul>
      </div>
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <p><strong>Status:</strong> App is running successfully in Power Apps!</p>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

