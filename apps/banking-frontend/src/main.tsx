import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import NetBankingPage from './NetBankingPage.tsx'

createRoot(document.getElementById('root')!).render(
<BrowserRouter>
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="/netbanking/:token" element={<NetBankingPage />} />
  </Routes>
</BrowserRouter>

)
