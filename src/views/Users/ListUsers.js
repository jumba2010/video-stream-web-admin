import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Row, Table} from 'reactstrap';
import {ClipLoader} from 'react-spinners';
import Loader from 'react-loader-advanced';
import api,{baseURL} from '../../services/api'


import Pagination from '../Utils/Paination'
const elementsPerPage=6;
const spinner=<div className='d-flex justify-content-center'><ClipLoader sizeUnit={"px"} size={50} color={'#123abc'} loading={true}/></div>;
function UserRow(props) {
  const user = props.user
  const userLink = `/users/${user.userName}`

   return (
    <tr key={user.userName}>
      <th scope="row">        
      <img src={`${baseURL}/${user.picture}`} style={{height:'30px'}} className="img-avatar" alt="Nenhuma" /></th>
      <td><Link to={userLink}>{user.name} {user.lastname}</Link></td>      
        
         <td>{user.contactprefix} {user.contact}</td>
      <td>{user.email}</td>
      <td>{user.countryName}</td>
           <td>
      {user.profile==='guest'?'Visitante':user.profile}</td>
      <td>{user.creationDate.substring(0, 10)}</td> 
      <td> <button type="button" class="btn btn-outline-primary btn-sm" ><i className="fa fa-edit"></i></button></td>
      <td> <button type="button" class="btn btn-success btn-sm" ><i className="fa fa-phone"></i></button></td>
    
    </tr>
  )
}

class Listusers extends Component {
  constructor(props) {
    super(props);
      this.state = {
      users: [],
      total:'',
      curentpage:1,
      ranges:[],
      processing: false
    }
  }
  previousPageNumber=()=>{
    this.setState({curentpage:this.state.curentpage-1}); 
    this.loadusers(this.state.curentpage-1)            
    }

  nextPageNumber=()=>{
      this.setState({curentpage:this.state.curentpage+1}); 
      this.loadusers(this.state.curentpage+1)            
    }

    loadusers(page){
      this.setState({processing:true }); 
      api.get('/api/user/all/'+page)
      .then(res => {
        const users = res.data;     
        this.setState({users:users,processing:false });             
      })                  
    }
    
    upateCurentPage=(page)=>{
      this.setState({curentpage:page}); 
      this.loadusers(page)        
    }
   componentWillMount() {
    api.get('/api/user/count/all/users')
        .then(res => {         
          this.setState({total:res.data.total});           
        })
      
        this.loadusers(this.state.curentpage)
  }

  render() {

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Utilizadores  <a href='#'><h5 style={{float:'right'}}>[{(this.state.curentpage-1)*elementsPerPage+1} - {this.state.curentpage*elementsPerPage<=this.state.total?this.state.curentpage*elementsPerPage:this.state.total} de {this.state.total}]</h5></a>
              </CardHeader>             
              <CardBody>
              <Loader show={this.state.processing} message={spinner}  backgroundStyle={{color:'white'}} messageStyle={{margin:'auto',padding:'10px'}}>
                <Table responsive hover size="sm" >
                  <thead>
                    <tr>
                      <th scope="col">Fotografia</th>
                      <th scope="col">Nome</th>
                      <th scope="col">Contacto</th>
                      <th scope="col">Email</th>
                      <th scope="col">País</th>
                      <th scope="col">Perfil</th>
                      <th scope="col">Data de Cadastro</th>
                      <th scope="col"></th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  
                  <tbody>
                 
                    {this.state.users.map((user, index) =>
                      <UserRow key={index} user={user}/>
                    )}
                  </tbody>

                </Table>  </Loader>
               
<Pagination curent={this.state.curentpage} 
pages={Math.ceil(this.state.total/elementsPerPage)} 
upateCurentPage={this.upateCurentPage}
 nextPageNumber={this.nextPageNumber}
  previousPageNumber={this.previousPageNumber}/>
              </CardBody>
             
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Listusers;
