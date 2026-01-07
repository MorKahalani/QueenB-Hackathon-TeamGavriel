import { BrowserRouter, Routes, Route} from 'react-router'
import Home from './pages/HomePage/HomePage';
import AdminLogin from './pages/LoginForAdmin/AdminLogin';
// import styles from './styles/App.module.css';
import AdminPage from './pages/AdminPage/AdminPage'; 
import CreateReport from './pages/CreateReport';
import StudentConfirmationPage from './pages/StudentConfirmationPage/StudentConfirmationPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // חדש
import Layout from './components/Layout/Layout';
import { Toaster } from 'react-hot-toast';




const queryClient = new QueryClient();  // חדש-יצרנו מנהל חדש

function App() {
  return (
    <QueryClientProvider client={queryClient}> {/* חדש- עוטפים את האתר במנהל החדש כדי שכל הדפים יוכלו להשתמש בו*/}
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
