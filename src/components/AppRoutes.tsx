/* eslint-disable react/jsx-pascal-case */
import { Routes, Route, Navigate} from 'react-router'; 
import { useStore } from '../context/Context';

import Log_in from '../screens/Log_in';
import Manager from '../screens/Manager';
import Admin from '../screens/Admin';
import DocumentCard from '../screens/DocumentCard';


const AppRoutes = () => {
  const { log_in } = useStore();

  return (
    <Routes>
      {/* Protected Routes */}
      <Route path="/Manager" element={log_in ? <Manager /> : <Navigate to="/" />} />
      <Route path="/Admin" element={log_in ? <Admin /> : <Navigate to="/" />} />
      <Route path="/document/card/:id" element={<DocumentCard />} />

      {/* Default Route */}
      <Route path="/" element={<Log_in />} />
    </Routes>
  );
}

export default AppRoutes