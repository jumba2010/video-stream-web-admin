import React from 'react';


const Dashboard = React.lazy(() => import('./views/Dashboard'));
const Users = React.lazy(() => import('./views/Users/ListUsers'));
const UserDetails = React.lazy(() => import('./views/Users/UserDetails'));
const ListWorkers = React.lazy(() => import('./views/Workers/ListWorkers'));
const CreateWorker = React.lazy(() => import('./views/Workers/CreateWorker'));
const EditWorker = React.lazy(() => import('./views/Workers/EditWorkers'));
const ListPatners = React.lazy(() => import('./views/Patners/ListPatners'));
const ListSucursals = React.lazy(() => import('./views/Sucursal/ListSucursals'));
const SucursalDetails = React.lazy(() => import('./views/Sucursal/SucursalDetails'));
const CreateSucursal = React.lazy(() => import('./views/Sucursal/CreateSucursal'));
const PatnerDetails = React.lazy(() => import('./views/Patners/PatnerDetails'));
const WorkerDetails = React.lazy(() => import('./views/Workers/WorkerDetails'));
const ListWorshipReports = React.lazy(() => import('./views/WorshipReports/ListWorshipReports'));
const WorshipReportDetails = React.lazy(() => import('./views/WorshipReports/WorshipReportDetails'));
const BookDetails = React.lazy(() => import('./views/Books/BookDetails'));
const ListBooks = React.lazy(() => import('./views/Books/ListBooks'));
const BookingDetails = React.lazy(() => import('./views/Booking/BookingDetails'));
const BookingList = React.lazy(() => import('./views/Booking/BookingList'));
const CreateBook = React.lazy(() => import('./views/Books/CreateBook'));
const CreateVideo = React.lazy(() => import('./views/Video/CreateVideo'));
const VideoDetails = React.lazy(() => import('./views/Video/VideoDetails'));
const ListVideos = React.lazy(() => import('./views/Video/ListVideos'));
const CreatePatner = React.lazy(() => import('./views/Patners/CreatePatner'));
const CreateAnouncement = React.lazy(() => import('./views/Anouncement/CreateAnouncement'));
const ListAnouncement = React.lazy(() => import('./views/Anouncement/ListAnouncement'));
const ViewProfile=React.lazy(() => import('./views/Users/Profile'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/workers', exact: true, name: 'Membros de Direção', component: ListWorkers },
  { path: '/workers/listworkers', name: 'Listar Membros', component: ListWorkers },
  {path:'/workers/createworkers', name: 'Cadastrar Membro', component: CreateWorker},
  {path:'/workers/editworkers/:id', name: 'Editar Membro', component: EditWorker},
  { path: '/workers/:id', exact: true, name: 'Detalhes do Membro', component: WorkerDetails },
  { path: '/patners', exact: true, name: 'Parceiros', component: ListPatners },
  { path: '/patners/listpatners', name: 'Listar Parceiros', component: ListPatners },
  { path: '/patners/createpatners', name: 'Cadastrar Parceiro', component: CreatePatner },
  { path: '/patners/:id', exact: true, name: 'Detalhes do Parceiro', component: PatnerDetails },
  { path: '/sucursals', exact: true, name: 'Células', component: ListSucursals },
  { path: '/sucursals/createsucursal', name: 'Cadastrar Célula', component: CreateSucursal },
  { path: '/sucursals/listsucursals', name: 'Listar Células', component: ListSucursals },
  { path: '/sucursals/:id', exact: true, name: 'Detalhes da Célula', component: SucursalDetails },
  { path: '/books', exact: true, name: 'Livros', component: ListBooks },
  { path: '/books/listbooks', name: 'Listar Livros', component: ListBooks },
 
  { path: '/books/createbook', name: 'Cadastrar Livro', component: CreateBook },
  { path: '/books/:id', exact: true, name: 'Detalhes do Livro', component: BookDetails },
  
  { path: '/bookings', exact: true, name: 'Reservas', component: BookingList },
  { path: '/bookings/listbookings', name: 'Listar Reservas', component: BookingList },
  { path: '/bookings/:id', exact: true, name: 'Detalhes da Reserva', component: BookingDetails }, 


  { path: '/worshipreports',exact: true, name: 'Relatórios de Cultos', component: ListWorshipReports },
  { path: '/worshipreports/list', name: 'Listar Relatórios de Cultos', component: ListWorshipReports },
  { path: '/worshipreports/:id', exact: true, name: 'Detalhes do Relatórios de Cultos', component: WorshipReportDetails },

 
  { path: '/users', exact: true,  name: 'Users', component: Users }, 
  { path: '/users/listusers',   name: 'Listar Utilizadores', component: Users },
  { path: '/users/:userName', exact: true, name: 'Detalhes do Utlizador', component: UserDetails },  
  { path: '/videos', exact: true, name: 'Videos', component: ListVideos },
  { path: '/videos/listvideos', name: 'Listar Videos', component: ListVideos },
  { path: '/videos/createvideos', name: 'Publicar Video', component: CreateVideo },
  { path: '/videos/:id', exact: true, name: 'Detalhes do Video', component: VideoDetails },
  { path: '/anouncements', exact: true, name: 'Anúcios', component: ListAnouncement },
  { path: '/anouncements/listanouncements', name: 'Listar Anúcios', component: ListAnouncement },
  { path: '/anouncements/createanouncement', name: 'Publicar Anúcios', component: CreateAnouncement },
  { path: '/profile',exact: true, name: 'Meu Perfil', component: ViewProfile },
];

export default routes;
