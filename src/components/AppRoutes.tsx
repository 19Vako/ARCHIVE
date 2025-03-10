/* eslint-disable react/jsx-pascal-case */
import { Routes, Route, Navigate} from 'react-router'; 
import { useStore } from '../context/Context';

import Manager_log_in from '../screens/Manager_log_in';
import Admin_log_in from '../screens/Admin_log_in';
import Manager from '../screens/Manager';
import Admin from '../screens/Admin';
import DocumentCard from '../screens/DocumentCard';
import StartScreen from '../screens/StartScreen';

const AppRoutes = () => {
  const { log_in } = useStore();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/Manager_log_in" element={<Manager_log_in />} />
      <Route path="/Admin_log_in" element={<Admin_log_in />} />

      {/* Protected Routes */}
      <Route path="/Manager" element={log_in ? <Manager /> : <Navigate to="/Manager_log_in" />} />
      <Route path="/Admin" element={log_in ? <Admin /> : <Navigate to="/Admin_log_in" />} />
      <Route path="/document/card/:id" element={<DocumentCard />} />

      {/* Default Route */}
      <Route path="/" element={<StartScreen />} />
    </Routes>
  );
}

export default AppRoutes