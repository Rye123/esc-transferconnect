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
// Pages
import IndexPage from './routes/IndexPage';
import LoginPage from './routes/LoginPage';
import ProfilePage from './routes/ProfilePage';
import LoyaltyProgramsListPage from './routes/LoyaltyProgramsListPage';
import LoyaltyProgramInfoPage from './routes/LoyaltyProgramInfoPage'
import TransfersListPage from './routes/TransfersListPage';
import TransferPage from './routes/TransferPage';
import NotFoundPage from './routes/NotFoundPage';
// Routes
import RequireAuthRoute from './routes/RequireAuthRoute';
import LogoutRoute from './routes/LogoutRoute';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />}>
        <Route index element={<IndexPage />} />
        <Route path='login' element={<LoginPage />} />
        <Route path='profile' element={<RequireAuthRoute><ProfilePage /></RequireAuthRoute>} />

        <Route path='loyalty_programs' element={<RequireAuthRoute><LoyaltyProgramsListPage /></RequireAuthRoute>} />
        <Route path='loyalty_programs/:loyaltyProgramId' element={<RequireAuthRoute><LoyaltyProgramInfoPage /></RequireAuthRoute>} />

        <Route path='transfer_history' element={<RequireAuthRoute><TransfersListPage /></RequireAuthRoute>} />
        <Route path='transfers/:transferId' element={<RequireAuthRoute><TransferPage /></RequireAuthRoute>} />

        <Route path='logout' element={<RequireAuthRoute><LogoutRoute /></RequireAuthRoute>} />
        <Route
          path='*'
          element={<NotFoundPage />}
        />
      </Route>
    </Routes>
  </BrowserRouter>
);
