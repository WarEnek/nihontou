import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Login from './components/Login';
import Chat from './pages/Chat';
import Manage from './pages/Manage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/chat',
    element: <Chat />,
  },
  {
    path: '/manage',
    element: <Manage />,
  },
]);

export default router;