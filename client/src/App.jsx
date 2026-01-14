import { BrowserRouter, Routes, Route} from 'react-router'
import Home from './pages/HomePage/HomePage';
import AdminLogin from './pages/LoginForAdmin/AdminLogin';
import AdminPage from './pages/AdminPage/AdminPage'; 
import CreateReport from './pages/CreateReport';
import StudentConfirmationPage from './pages/StudentConfirmationPage/StudentConfirmationPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; 
import Layout from './components/Layout/Layout';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient(); 

function App() {
  return (
    <QueryClientProvider client={queryClient}> 
    <BrowserRouter>
    <Toaster position="top-center" reverseOrder={false} />
      <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminPage/>} />
            <Route path="/report/:schoolId" element={<CreateReport />} />
            <Route path="/confirmation" element={<StudentConfirmationPage/>} />
          </Routes>
        </Layout>
    </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
