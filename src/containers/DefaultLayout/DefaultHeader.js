import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem } from 'reactstrap';
import PropTypes from 'prop-types';

import { AppAsideToggler, AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import logo from '../../assets/img/brand/logo.svg'
import sygnet from '../../assets/img/brand/sygnet.svg'
import { withRouter } from 'react-router-dom'
import {baseURL} from './../../services/api'
import { USER_KEY} from "../../services/auth";

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {
  constructor(props) {
    super(props);    
  }
  gotoProfile(){
    this.props.history.push("/profile");
  }
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: logo, width: 89, height: 25, alt: 'Nações para Cristo' }}
          minimized={{ src: sygnet, width: 30, height: 30, alt: 'Nações para Cristo' }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg" />

        <Nav className="d-md-down-none" navbar>
          <NavItem className="px-3">
            <NavLink to="/dashboard" className="nav-link" >Dashboard</NavLink>
          </NavItem>
          <NavItem className="px-3">
            <Link to="/workers/listworkers" className="nav-link">Membros de Direção</Link>
          </NavItem>
          <NavItem className="px-3">
            <NavLink to="#" className="nav-link">Definições</NavLink>
          </NavItem>
        </Nav>
        <Nav className="ml-auto" navbar>
          <NavItem className="d-md-down-none">
            <NavLink to="#" className="nav-link"><i className="icon-bell"></i><Badge pill color="danger">0</Badge></NavLink>
          </NavItem>
          <NavItem className="d-md-down-none">
            <NavLink to="#" className="nav-link"><i className="icon-list"></i></NavLink>
          </NavItem>
          <NavItem className="d-md-down-none">
            <NavLink to="#" className="nav-link"><i className="icon-location-pin"></i></NavLink>
          </NavItem>
          <AppHeaderDropdown direction="down">
            <DropdownToggle nav>
            {JSON.parse(localStorage.getItem('USER_KEY'))?   <img src={`${baseURL}/${JSON.parse(localStorage.getItem(USER_KEY)).picture}?${Date.now()}`} className="img-avatar"  />:<img src={`${baseURL}/blank-user.png`} className="img-avatar"  />}
            </DropdownToggle>
            <DropdownMenu right style={{ right: 'auto' }}>
              <DropdownItem header tag="div" className="text-center"><strong>Conta</strong></DropdownItem>          
              <DropdownItem><i className="fa fa-envelope-o"></i> Mansagens<Badge color="success">0</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-tasks"></i> Tarefas<Badge color="danger">0</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-comments"></i> Comentários<Badge color="warning">0</Badge></DropdownItem>
              <DropdownItem header tag="div" className="text-center"><strong>Definições</strong></DropdownItem>
              <DropdownItem onClick={this.gotoProfile.bind(this)}><i className="fa fa-user"></i> Perfil</DropdownItem>
              <DropdownItem><i className="fa fa-wrench"></i> Definiçoes</DropdownItem>
              <DropdownItem><i className="fa fa-usd"></i> Pagamentos<Badge color="secondary">0</Badge></DropdownItem>
              <DropdownItem divider />
              <DropdownItem onClick={e => this.props.onLogout(e)}><i className="fa fa-sign-out"></i> Sair</DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown>
        </Nav>
        <AppAsideToggler className="d-md-down-none" />
        {/*<AppAsideToggler className="d-lg-none" mobile />*/}
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default withRouter(DefaultHeader);
