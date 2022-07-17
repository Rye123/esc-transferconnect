import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'

import './index.css';
import App from './App';

/* Routes */
import Index from './routes/Index';
import Login from './routes/Login';
import RequireAuth from './routes/RequireAuth';
import Profile from './routes/Profile';
import LoyaltyProgramsListing from './routes/LoyaltyProgramsListing';
import LoyaltyProgramInfo from './routes/LoyaltyProgramInfo'
import TransferHistory from './routes/TransferHistory';
import TransferHistoryItem from './routes/TransferHistoryItem';
import Logout from './routes/Logout';
import NotFound from './routes/NotFound';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />}>
        <Route index element={<Index />} />
        <Route path='login' element={<Login />} />
        <Route path='profile' element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path='loyalty_programs' element={<RequireAuth><LoyaltyProgramsListing /></RequireAuth>} />
        <Route path='loyalty_programs/:loyaltyProgramId' element={<RequireAuth><LoyaltyProgramInfo /></RequireAuth>} />
        <Route path='transfer_history' element={<RequireAuth><TransferHistory /></RequireAuth>} />
        <Route path='transfers/:transferId' element={<RequireAuth><TransferHistoryItem /></RequireAuth>} />
        <Route path='logout' element={<RequireAuth><Logout /></RequireAuth>} />
        <Route
          path='*'
          element={<NotFound />}
        />
      </Route>
    </Routes>
  </BrowserRouter>
);
