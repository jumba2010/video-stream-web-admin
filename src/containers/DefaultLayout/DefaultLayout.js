import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import * as router from 'react-router-dom';
import { Container } from 'reactstrap';
import {
  AppAside,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppBreadcrumb2 as AppBreadcrumb,
  AppSidebarNav2 as AppSidebarNav,
} from '@coreui/react';

// sidebar nav config
import navigation from '../../_nav';

// routes config
import routes from '../../routes';
import { logout, isAuthenticated, USER_KEY } from "../../services/auth";

const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

class DefaultLayout extends Component {
  state = {
    navegationconf: []
  }
  componentWillMount() {
    this.setState({ navegationconf: navigation })
    const user = JSON.parse(localStorage.getItem(USER_KEY));
    if (isAuthenticated && user) {
      if (user.profile === 'Apóstolo') {
        this.setState({ navegationconf: navigation })
      }

      else {

        //Pegando as transações que o user tem acesso apenas
        let usertransactions = []
        //Adiciona o dasbord e o devider de Administração
        usertransactions =
          navigation.items.filter((nav) => nav.name === 'Dashboard'
            || nav.name === 'Administração'
          )
        let finalMenu = []  
      navigation.items.map(mn=>{    
         
          if(mn.haschildren){
          let children = []
          let found = false
          mn.children.forEach(ch=>{
           const tx = user.transactions.find(item => item.code === ch.code)
           if(tx){            
            const newchildren =  mn.children.filter(c=> c.code === ch.code )
            children = children.concat(newchildren)
            found = true           
           }
          })  
          
          if(found){
            finalMenu.push( {
              ...mn,
              children
                })
            }
         


        }
      
        })

  usertransactions = usertransactions.concat(finalMenu)
   //Validado o menu de Relatórios
   user.transactions.forEach(funcionality => {
    let reportnavs = navigation.items.filter((nav) => (nav.code
      && nav.code === funcionality.code))
    if (reportnavs.length!==0) {

      usertransactions = usertransactions.concat(navigation.items.filter((nav) => nav.name === 'Relatórios'
      )).concat(reportnavs)
    }
  });

         
        let nav = {}
        nav.items = new Set(usertransactions)
        this.setState({ navegationconf: nav })
      }
    }
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">A Processar...</div>

  signOut(e) {
    e.preventDefault()
    logout();
    this.props.history.push('/login')
  }

  render() {
    return (
      <div className="app">
        <AppHeader fixed>
          <Suspense fallback={this.loading()}>
            <DefaultHeader onLogout={e => this.signOut(e)} />
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
              <AppSidebarNav navConfig={this.state.navegationconf} {...this.props} router={router} />
            </Suspense>
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            <AppBreadcrumb appRoutes={routes} router={router} />
            <Container fluid>
              <Suspense fallback={this.loading()}>
                <Switch>
                  {routes.map((route, idx) => {
                    return route.component ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={props => (
                          isAuthenticated() ? <route.component {...props} /> :
                            <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
                        )} />
                    ) : (null);
                  })}
                  <Redirect from="/" to="/dashboard" />
                </Switch>
              </Suspense>
            </Container>
          </main>
          <AppAside fixed>
            <Suspense fallback={this.loading()}>
              <DefaultAside />
            </Suspense>
          </AppAside>
        </div>
        <AppFooter>
          <Suspense fallback={this.loading()}>
            <DefaultFooter />
          </Suspense>
        </AppFooter>
      </div>
    );
  }
}

export default DefaultLayout;
