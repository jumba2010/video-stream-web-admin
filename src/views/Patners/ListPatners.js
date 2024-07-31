import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Row, Table} from 'reactstrap';
import {ClipLoader} from 'react-spinners';
import Loader from 'react-loader-advanced';
import api,{baseURL} from './../../services/api'
import compromisseFrequencies from './compromisseFrequencies'
import months from './months'

import Pagination from '.././Utils/Paination'
const elementsPerPage=6;
const spinner=<div className='d-flex justify-content-center'><ClipLoader sizeUnit={"px"} size={50} color={'#123abc'} loading={true}/></div>;
function UserRow(props) {
  const patner = props.patner
  const userLink = `/patners/${patner._id.toString()}`

   return (
    <tr key={patner._id.toString()}>
      <th scope="row">        
      <img src={`${baseURL}/${patner.picture}`} style={{height:'30px'}} className="img-avatar" alt="Nenhuma" /></th>
      <td><Link to={userLink}>{patner.name} {patner.lastname}</Link></td>      
        
         <td>{patner.contactprefix} {patner.contact}</td>
      <td>{patner.email}</td>
      <td>{patner.countryName}</td>
      <td>{patner.compromisse.type==='C01'?patner.compromisse.amount:patner.compromisse.designation} - 
      {patner.compromisse.frequency?compromisseFrequencies.filter(frq=>frq.code===patner.compromisse.frequency)[0].desc:''}
      </td>
      <td>
      {patner.compromisse.month?months.filter(m=>m.code==patner.compromisse.month)[0].desc:''}
      
      /{patner.compromisse.year}</td>
      <td> <button type="button" class="btn btn-outline-primary btn-sm" ><i className="fa fa-edit"></i></button></td>
      <td> <button type="button" class="btn btn-success btn-sm" ><i className="fa fa-phone"></i></button></td>
    
    </tr>
  )
}

class ListPatners extends Component {
  constructor(props) {
    super(props);
      this.state = {
      patners: [],
      total:'',
      curentpage:1,
      ranges:[],
       processing: true
    }
  }
  previousPageNumber=()=>{
    this.setState({curentpage:this.state.curentpage-1}); 
    this.loadpatners(this.state.curentpage-1)            
    }

  nextPageNumber=()=>{
      this.setState({curentpage:this.state.curentpage+1}); 
      this.loadpatners(this.state.curentpage+1)            
    }

    loadpatners(page){
      this.setState({processing:true }); 
      api.get('/api/patner/all/'+page)
      .then(res => {
        const patners = res.data;     
        this.setState({patners:patners,processing:false });             
      })                  
    }
    
    upateCurentPage=(page)=>{
      this.setState({curentpage:page}); 
      this.loadpatners(page)        
    }
   componentDidMount() {
    api.get('/api/patner/count/all/patners')
        .then(res => {         
          this.setState({total:res.data.total});           
        })
 
        this.loadpatners(this.state.curentpage)
  }

  render() {

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Parceiros <a href='#'><h5 style={{float:'right'}}>[{(this.state.curentpage-1)*elementsPerPage+1} - {this.state.curentpage*elementsPerPage<=this.state.total?this.state.curentpage*elementsPerPage:this.state.total} de {this.state.total}]</h5></a>
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
                      <th scope="col">Compromisso</th>
                      <th scope="col">Início</th>
                      <th scope="col"></th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.patners.map((patner, index) =>
                      <UserRow key={index} patner={patner}/>
                    )}
                  </tbody>
                </Table>    </Loader>  
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

export default ListPatners;
