import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ToastProvider } from './components/ui/Toast';
import { Dashboard } from './pages/Dashboard';
import { DemandPlanning } from './pages/DemandPlanning';
import { Purchasing } from './pages/Purchasing';
import { OrderTracking } from './pages/OrderTracking';
import { Receiving } from './pages/Receiving';
import { APPipeline } from './pages/APPipeline';
import { VendorPerformance } from './pages/VendorPerformance';
import { SpendAnalysis } from './pages/SpendAnalysis';
import { SettingsPage } from './pages/Settings';

function App() {
  return (
    <ToastProvider>
      <BrowserRouter basename="/ibexx-apex">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="demand-planning"    element={<DemandPlanning />} />
            <Route path="purchasing"         element={<Purchasing />} />
            <Route path="order-tracking"     element={<OrderTracking />} />
            <Route path="receiving"          element={<Receiving />} />
            <Route path="ap-pipeline"        element={<APPipeline />} />
            <Route path="vendor-performance" element={<VendorPerformance />} />
            <Route path="spend-analysis"     element={<SpendAnalysis />} />
            <Route path="settings"           element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
