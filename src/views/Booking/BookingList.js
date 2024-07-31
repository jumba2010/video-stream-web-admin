import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Card, CardBody, CardHeader, FormGroup,Input,Label,Col, Row,Modal,ModalBody,ModalHeader,Button,ModalFooter, Table} from 'reactstrap';

import api,{baseURL} from './../../services/api'

import Pagination from '../Utils/Paination'
import months from '../Utils/months';

const elementsPerPage=6;
const getBadge = (status) => {
  let color
  if(status==='CONFIRMED'){
    color='info'
  }
  else  if(status==='COMPLETE'){
    color='success'
  }

  else  if(status==='CANCELED' || status==='REFUSED'){
    color='danger'
  }
  else{
    color='warning'
  }
  return color
}



class BookingList extends Component {

  constructor(props){
    super(props);
    this.state={
    bookings:[],
    total:'',
    remarks:'',
    booking:{},
    open:false,
    openfinalise:false,
    openrefuse:false,
    customer:{},
    curentpage:1,
    ranges:[],
    issaving:true
    }
      }
    
      componentDidMount() {
        api.get('/api/booking/count/all/bookings')
        .then(res => {         
          this.setState({total:res.data.total});           
        })
 
        this.loadbookings(this.state.curentpage)
      }

      handleChange(evt) {
        this.setState({ [evt.target.name]: evt.target.value });     
          }

       previousPageNumber=()=>{
      this.setState({curentpage:this.state.curentpage-1}); 
      this.loadbookings(this.state.curentpage-1)
          
      }

      nextPageNumber=()=>{
        this.setState({curentpage:this.state.curentpage+1}); 
        this.loadbookings(this.state.curentpage+1)
          
      }

      loadbookings(page){
        api.get('/api/booking/all/'+page)
        .then(res => {
          const bookings = res.data;           
          this.setState({bookings:bookings,issaving:false });           
        })       
      }

      upateCurentPage=(page)=>{
        this.setState({curentpage:page}); 
        this.loadbookings(page)          
      }

      toggleFade=(b) =>{
        this.setState( {open: !this.state.open,booking:b})       
             
      }

      toggleFadeFinalise=(b) =>{
        this.setState( {openfinalise:!this.state.openfinalise,booking:b})       
             
      }
      
      toggleFadeRefuse=(b) =>{
        this.setState( {openrefuse:!this.state.openrefuse,booking:b})       
             
      }

      confirmBooking = async b => {       
        await api.put("/api/booking/confirm/"+b._id,{remarks:this.state.remarks});     
        this.setState( {open: false}) 
        this.loadbookings(this.state.curentpage)
      }

      finalizebooking = async b => { 
        await api.put("/api/booking/complete/"+b._id); 
        await api.put("/api/property/release/"+b.property.code);     
        this.setState( {openfinalise: false})         
        this.loadbookings(this.state.curentpage)        
      }

      refusebooking = async b => { 
        await api.put("/api/booking/refuse/"+b._id,{remarks:this.state.remarks});
        await api.put("/api/property/release/"+b.property.code);    
        this.setState({openrefuse: false})         
        this.loadbookings(this.state.curentpage)          
        }

      toggleOpenClose=()=> {
        this.setState({
          open: !this.state.open});
      }

      toggleOpenCloseFinalise=()=> {
        this.setState({
          openfinalise:!this.state.openfinalise
        });
      }
        toggleOpenCloseRefuse=()=> {
          this.setState({
            openrefuse:!this.state.openrefuse
          });
      }

  render() {

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Reservas 
              </CardHeader>
              <CardBody>
                <Table hover responsive className="table-outline mb-0 d-none d-sm-table" >
                <thead className="thead-light">
                    <tr> 
                    <th scope="col">Foto</th>                  
                      <th scope="col">Nome</th>
                      <th scope="col">Contacto</th>
                      <th scope="col">Check-in</th>
                      <th scope="col">Check-out</th>
                      <th scope="col">Nr. dias</th>
                      <th scope="col">Total</th>
                      <th scope="col">Reserva</th>
                      <th scope="col">Estado</th>
                      <th scope="col"></th>
                      <th scope="col"></th>
                      <th scope="col"></th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.bookings.map((booking, index) =>                     
                     <tr key={booking._id.toString()}> 
                     <th scope="row">        
                     <img src= {!booking.customer.picture?`${baseURL}/blank-user.png`:`${baseURL}/${booking.customer.picture}`} style={{height:'30px'}} className="img-avatar" alt="Fotografia" /></th>           
                     <td><Link to={`/bookings/${booking._id.toString()}`}>{booking.customer.name}</Link></td>      
                     <td>{booking.customer.phonePrefix}{booking.customer.contact}</td>
                <td>{booking.checkinDate.substring(8, 10)} de {booking.checkinDate ? months.filter(m => m.code == parseInt(booking.checkinDate.substring(5, 7)))[0].desc : ''} de {booking.checkinDate.substring(0, 4)}</td>
                                <td>{booking.checkoutDate.substring(8, 10)} de {booking.checkoutDate ? months.filter(m => m.code == parseInt(booking.checkoutDate.substring(5, 7)))[0].desc : ''} de {booking.checkoutDate.substring(0, 4)}</td>
                <td>{booking.numberOfDays}</td>
                <td><strong>{booking.total} MZN</strong></td>
                <td>{booking.description} Nr. {booking.property.roomNumber}</td>
                <td><Link to={`/bookings/${booking._id.toString()}`}><Badge color={getBadge(booking.status)}>{booking.status==='CONFIRMED'?'Confirmada':(booking.status==='COMPLETE'?'Finalizada':(booking.status==='CANCELED'?'Cancelada':(booking.status==='REFUSED'?'Recusada':'Pendente')))}</Badge></Link></td>
                <td> <button type="button" class="btn btn-outline-warning btn-sm"   ><i className="fa fa-edit"></i>Actualizar</button></td>
                <td> <button type="button" class="btn btn-outline-danger btn-sm" onClick={booking.status==='PENDING' || booking.status==='CONFIRMED'?this.toggleFadeRefuse.bind(this,booking):this}  ><i className="fa fa-edit"></i>Recusar</button></td>
                <td> <button type="button" class="btn btn-outline-primary btn-sm" onClick={booking.status==='PENDING'?this.toggleFade.bind(this,booking):this}  ><i className="fa fa-edit"></i>Confirmar</button></td>
                <td> <button type="button" class="btn btn-outline-success btn-sm" onClick={booking.status==='CONFIRMED'?this.toggleFadeFinalise.bind(this,booking):this}><i className="fa fa-check-square"></i>Finalizar</button></td>
              </tr>
                    )}
                  </tbody>
                </Table>
                <Pagination curent={this.state.curentpage} 
pages={Math.ceil(this.state.total/elementsPerPage)} 
upateCurentPage={this.upateCurentPage}
 nextPageNumber={this.nextPageNumber}
  previousPageNumber={this.previousPageNumber}/>

<Modal color='info' isOpen={this.state.open} toggle={this.toggleOpenClose.bind(this)}
  className={'modal-info modal-lg ' + this.props.className} >
<ModalHeader toggle={this.props.toggleOpenClose}>{this.state.booking.description}</ModalHeader>
<ModalBody>
<h4>Confirme a Reserva</h4>

<div class="row">
    <div class="col-2">
      
    <FormGroup>
     <Label htmlFor="nf-email">Observações</Label>                  
      </FormGroup>
      </div>
      <div class="col-10">     
      <FormGroup>                     
        <Input type="textarea" rows="4" onChange={this.handleChange.bind(this)} name="remarks"  value={this.state.remarks}  placeholder="Observações" />
        </FormGroup>
        </div>      
      </div>
</ModalBody>
<ModalFooter>
<Button color="primary" onClick={this.confirmBooking.bind(this,this.state.booking)}>Confirmar</Button>{' '}
<Button color="secondary" onClick={this.toggleOpenClose.bind(this)}>Cancelar</Button>
</ModalFooter>
</Modal>

<Modal color='info' isOpen={this.state.openrefuse} toggle={this.toggleOpenCloseRefuse.bind(this)}
  className={'modal-danger modal-lg ' + this.props.className}>
<ModalHeader toggle={this.props.toggleOpenCloseFinalise}>{this.state.booking.description}</ModalHeader>
<ModalBody>
<h4>Recusar a Reserva</h4>

<div class="row">
    <div class="col-2">
      
    <FormGroup>
     <Label htmlFor="nf-email">Observações</Label>                  
      </FormGroup>
      </div>
      <div class="col-10">     
      <FormGroup>                     
        <Input type="textarea" rows="4" onChange={this.handleChange.bind(this)} name="remarks"  value={this.state.remarks}  placeholder="Observações" />
        </FormGroup>
        </div>      
      </div>
</ModalBody>
<ModalFooter>
<Button color="danger" onClick={this.refusebooking.bind(this,this.state.booking)}>Recusar</Button>{' '}
<Button color="secondary" onClick={this.toggleOpenCloseRefuse.bind(this)}>Cancelar</Button>
</ModalFooter>
</Modal>

<Modal color='success' isOpen={this.state.openfinalise} toggle={this.toggleOpenCloseFinalise.bind(this)}
  className={'modal-success ' + this.props.className}>
<ModalHeader toggle={this.props.toggleOpenCloseFinalise}>{this.state.booking.description}</ModalHeader>
<ModalBody>
Finalise a Reserva
</ModalBody>
<ModalFooter>
<Button color="success" onClick={this.finalizebooking.bind(this,this.state.booking)}>Finalizar</Button>{' '}
<Button color="secondary" onClick={this.toggleOpenCloseFinalise.bind(this)}>Cancelar</Button>
</ModalFooter>
</Modal>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default BookingList;
