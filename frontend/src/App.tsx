import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import IntroPage from './pages/IntroPage';
import FormPage from './pages/FormPage';
import ResultsPage from './pages/ResultsPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/how-to-use" replace />} />
        <Route path="/how-to-use" element={<IntroPage />} />
        <Route path="/evaluate" element={<FormPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="*" element={<Navigate to="/how-to-use" replace />} />
      </Route>
    </Routes>
  );
}
