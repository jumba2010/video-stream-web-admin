import React, { Component } from 'react';
import { Card, CardBody, Badge,CardHeader, Col, Row,Label} from 'reactstrap';
import months from '../Utils/months';
import api,{baseURL} from '../../services/api'
const getBadge = (status) => {
  let color
  if(status==='CONFIRMED'){
    color='info'
  }
  else  if(status==='COMPLETE'){
    color='success'
  }
  else  if(status==='CANCELED'){
    color='danger'
  }
  else{
    color='warning'
  }
  return color
}
class BookingDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      booking: {}
    };    
  }
  componentWillMount() {
    console.log(this.props.match.params.id)
    api.get(`/api/booking/${this.props.match.params.id}`)
      .then(res => {
        console.log(res.data)
              this.setState({ booking:res.data, processing: false });
      })
  }

  render() {

   return (
      <div className="animated fadeIn">
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader>
                <strong><i className="icon-info pr-1"></i>Detalhes da Reserva</strong>
              </CardHeader>
              <CardBody>          
     

              <div class="container">
  <div class="row">
    <div class="col-2">



 <Card > 

     <di id='photo'>
     <img alt='Fotografia' src={!this.state.booking.customer?`${baseURL}/blank-user.png`:`${baseURL}/${this.state.booking.customer.picture}`} style={{height:'12em',width:'100%', "background-size": 'cover'}}  />     
       </di>  
                </Card>            

    </div>
    <div class="col-10">
 
    <Card>        
<CardBody>
<div>         
<div className='details'>
<strong>Nome Completo: </strong>
<Label htmlFor="nf-email">{this.state.booking.customer?this.state.booking.customer.name:''}</Label>            
</div></div> 
<div><div className='details'>
<strong>Contacto: </strong>
<Label htmlFor="nf-email">{this.state.booking.customer?this.state.booking.customer.contact:''}</Label>            
</div>
</div>
<div><div className='details'>
<strong>Email: </strong>
<Label htmlFor="nf-email">{this.state.booking.customer?this.state.booking.customer.email:''}</Label>            
</div>
</div>
<div><div className='details'>
<strong>País: </strong>
<Label htmlFor="nf-email">{this.state.booking.customer?this.state.booking.customer.coutry:''}</Label>            
</div>
</div>
<div>
<div className='details'>
<strong>Reserva: </strong>
<Label htmlFor="nf-email">{this.state.booking.description} Nr. {this.state.booking.property?this.state.booking.property.roomNumber:''} {this.state.booking.numberOfDays} dias</Label>            
</div>
</div>
<div>
<div className='details'>
<strong>Check-in / Check-out: </strong>
<Label htmlFor="nf-email">{this.state.booking.checkinDate?this.state.booking.checkinDate.substring(8, 10):''} de {this.state.booking.checkinDate ? months.filter(m => m.code == parseInt(this.state.booking.checkinDate.substring(5, 7)))[0].desc : ''} de {this.state.booking.checkinDate?this.state.booking.checkinDate.substring(0, 4):''} - {this.state.booking.checkoutDate?this.state.booking.checkoutDate.substring(8, 10):''} de {this.state.booking.checkoutDate ? months.filter(m => m.code == parseInt(this.state.booking.checkoutDate.substring(5, 7)))[0].desc : ''} de {this.state.booking.checkoutDate?this.state.booking.checkoutDate.substring(0, 4):''}  </Label>            
</div>
</div>
<div><div className='details'>
<strong>Total: </strong>
<Label htmlFor="nf-email">{this.state.booking.total} MZN</Label>            
</div>
</div>
<div>
<div className='details'>
<strong>Estado: </strong>
<Label htmlFor="nf-email"><Badge color={getBadge(this.state.booking.status)}>{this.state.booking.status==='CONFIRMED'?'Confirmada':(this.state.booking.status==='COMPLETE'?'Finalizada':(this.state.booking.status==='CANCELED'?'Cancelada':'Pendente'))}</Badge></Label>            
</div>
</div>


              </CardBody>
           
            </Card>   
            
    </div>
 
  </div>
</div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default BookingDetails;
