export default {
  items: [
    {
      haschildren:false,
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
      badge: {
        variant: 'info',
        text: 'NEW',
      },
    },
    
    {
      haschildren:false,
      title: true,
      name: 'Administração',
      wrapper: {
        element: '',
        attributes: {},
      },
    },

    {
      haschildren:true,
      name: 'Membros de Direção',
      url: '/workers',
      icon: 'icon-user',
      children: [
        {
          code:'002_MEMB_DIR',
          name: 'Cadastrar Membro',
          url: '/workers/createworkers',
          icon: 'icon-user-follow',
        },
        {
          code:'001_MEMB_DIR',
          name: 'Listar Membros',
          url: '/workers/listworkers',
          icon: 'icon-user',
        }
      ],
    },

    {
      haschildren:true,
      name: 'Parceiros',
      url: '/patners',
      icon: 'icon-people',
      children: [
        {code:'002_PNR',
          name: 'Cadastrar Parceiro',
          url: '/patners/createpatners',
          icon: 'icon-user-follow',
        },
        {code:'001_PNR',
          name: 'Listar Parceiros',
          url: '/patners/listpatners',
          icon: 'icon-people',
        }
      ],
    },

    {
      haschildren:true,
      name: 'Utilizadores',
      url: '/users',
      icon: 'icon-people',
      children: [
       
        {code:'001_USR',
          name: 'Listar Utilizadores',
          url: '/users/listusers',
          icon: 'icon-people',
        }
      ],
    },

    {
      haschildren:true,
      name: 'Livros',
      url: '/books',
      icon: 'icon-layers',
      children: [
        {code:'002_B',
          name: 'Cadastrar Livro',
          url: '/books/createbook',
          icon: 'icon-note',
        },
        {
          code:'001_B',
          name: 'Listar Livros',
          url: '/books/listbooks',
          icon: 'icon-layers',
        }
      ],
    },

    {
      haschildren:true,
      name: 'Anúcios',
      url: '/anouncements',
      icon: 'icon-location-pin',
      children: [
        {
          code:'002_EVT',
          name: 'Publicar Anúcio',
          url: '/anouncements/createanouncement',
          icon: 'icon-bell',
        },
        { code:'001_EVT',
          name: 'Listar anúcios',
          url: '/anouncements/listanouncements',
          icon: 'icon-location-pin',
        }
      ],
    },

    {
      haschildren:true,
      name: 'Videos',
      url: '/videos',
      icon: 'icon-puzzle',
      children: [
        { code:'002_V',
          name: 'Publicar Video',
          url: '/videos/createvideos',
          icon: 'icon-cloud-upload',
        },
        { code:'001_V',
          name: 'Listar Videos',
          url: '/videos/listvideos',
          icon: 'icon-puzzle',
        }
      ],
    },

    {
      haschildren:true,
      name: 'Células',
      url: '/sucursals',
      icon: 'icon-home',
      children: [
        {code:'002_CELL',
          name: 'Cadastrar Célula',
          url: '/sucursals/createsucursal',
          icon: 'icon-cursor',
        },
        {code:'001_CELL',
          name: 'Listar Células',
          url: '/sucursals/listsucursals',
          icon: 'icon-home',
        }
      ],
    },

    {
      haschildren:false,
      divider: true,
    },
    { haschildren:false,
      title: true,
      name: 'Relatórios',
    },
 
    { haschildren:false,
      code:'001_RLC',
      name: 'Relatórios de Cultos',
      url: '/worshipreports/list',
      icon: 'icon-briefcase'
    },

     { haschildren:false,
      code:'001_AT',
      name: 'Aprovar Testemunho',
      url: '/testimonies/list',
      icon: 'icon-briefcase'
    }, 
    { haschildren:false,
      code:'001_RS',
      name: 'Reservas',
      url: '/bookings/listbookings',
      icon: 'icon-credit-card'
    },

    { haschildren:false,
      code:'',
      name: 'Compras',
      url: '/payment/list',
      icon: 'icon-basket-loaded'
    }
   
  ],
};
