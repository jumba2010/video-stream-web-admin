import React, {Component} from 'react';
import {Badge, Col, Nav, NavItem,ButtonToolbar,CardTitle,ButtonGroup, NavLink, Row,Input,Button,FormGroup,Label,Form,Alert, TabContent,TabPane,  Card,
  CardBody,
  CardFooter,
 } from 'reactstrap';
 import ReactDropzone from 'react-dropzone';
 import {FadeLoader} from 'react-spinners';
 
 import Loader from 'react-loader-advanced';

 import api,{baseURL} from './../../services/api'
 import { USER_KEY } from "./../../services/auth";

import rooTypes from './roomTypes'

const spinner=<div className='d-flex justify-content-center'><FadeLoader sizeUnit={"px"} size={200} color={'#ffffff'} loading={true}/></div>;

const initState={
  email: '',
  name: '',
  activeTab:'1',
  contact: '',
  today:Date.now(),
  amount:'',
  room:'',
  total:0,
  roomdesc:'',
  residence:{},
  radioSelected:0,
  roomcode:'',
  days:0,
  checkoutDate:'',
  properties:[],
  checkoutDate:'',
  address: '',
  date: '',        
  files:[],
  one:false,
  two:false,
  three:false,
  four:false,
  five:false,
  six:false,
  seven:false,
  height:false,
  roomtypeerror:false,
  roomerror:false,
  checkindateerror:false,
  checkoutdateerror:false,
  notempt:false,          
  error: false,
}

class CreateWorker extends Component {
  constructor(props) {
    super(props);
    this.state = initState;
    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this); 
    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
    this.handleChangeStartDate = this.handleChangeStartDate.bind(this); 
    this.handleChangeEndDate = this.handleChangeEndDate.bind(this);
    this.handleChangeRoomType = this.handleChangeRoomType.bind(this); 
  }

  reset(){
    window.scrollTo(0, 0);
    this.setState(initState);  
    this.toggle('1');
   }

  onDismiss() {
    this.setState({ visible: false });
  }

  addDays(date, days) {
		return new Date(date.setDate(date.getDate() + days))
	}

  onRadioBtnClick(radioSelected) {
    this.setState({
      room: radioSelected,radioSelected
    });
  }


  componentDidMount(){
    window.scrollTo(0, 0);
    }

    previousPage (evt) {
        this.toggle('1');   
    } 


    handleChangeRoomType(evt) {
      this.setState({
      [evt.target.name]: evt.target.value ,
      roomtypeerror: !this.state.roomcode   
    })

    this.setState({one:false,two:false,three:false,four:false,five:false,six:false,seven:false,height:false,checkinDate:'',room:''})

    } 

  handleChange(evt) {
      this.setState({
      [evt.target.name]: evt.target.value ,
      nameerror: !this.state.name,
         addresserror: !this.state.address,
         roomerror:!this.state.room,
      contacterror: !this.state.contact       
    })

  }

  handleChangeStartDate(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
    this.setState({one:false,two:false,three:false,four:false,five:false,six:false,seven:false,height:false})

		api.get(`/api/property/available/${evt.target.value}`)
			.then(res => {  
        this.setState({properties:res.data});       
        let properties =  res.data.filter(property=>property.capacity==this.state.roomcode);           
            properties.forEach(this.updateState.bind(this))
			})
  }
  
   updateState(p) {
    if(p.roomNumber==1){
      this.setState({one:true})
    }
   
    if(p.roomNumber==2){
      this.setState({two:true})
    }

    if(p.roomNumber==3){
      this.setState({three:true})
    }

    if(p.roomNumber==4){
      this.setState({four:true})
    }

    if(p.roomNumber==5){
      this.setState({five:true})
    }

    if(p.roomNumber==6){
      this.setState({six:true})
    }

    if(p.roomNumber==7){
      this.setState({seven:true})
    }

    if(p.roomNumber==8){
      this.setState({height:true})
    } 
 
  }

	handleChangeEndDate(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
	}

  createBooking = async e => {
    e.preventDefault();
    this.setState({ issaving: true })
    let loggedUser = JSON.parse(localStorage.getItem(USER_KEY));
   let createdBy=loggedUser._id;  
    let { name, email, contact, address, file, total, residence,checkinDate, days,checkoutDate } = this.state
  
    let picture = file;

    await api.put("api/property/reserve/"+residence._id,{ ocuppationDate:checkinDate,desocuppationDate:checkoutDate, updatedBy:loggedUser._id });
    
    await api.post("/api/booking/create", {
      name, email, contact, address,picture, checkinDate, checkoutDate,description:residence.name,discount:0,persons:residence.capacity,createdBy ,
          numberOfDays:days, total,property:residence
   });

    this.toggle('4')
   setTimeout( () =>{
   this.setState({visible:false, issaving: false })
  }, 4000);


}

  handleDrop =async (files) => {
  
     let picture = '';
     //Preparando para mandar as imagens
     if (files.length != 0) {
      this.setState({uploading:true})
           const data = new FormData();
           data.append('file', files[0],'PIC_'+(new Date()).getTime()+'.'+files[0].name.split('.').pop());
           data.append('filename', 'PIC_'+(new Date()).getTime()+'.'+files[0].name.split('.').pop());

           const config = {
                 headers: {
                       "content-type": "multipart/form-data"
                 }
           };

        let resp=   await api.post(
                 "/api/upload/pictures",
                 data, config
           );
   
        this.setState({
          file:resp.data.file,uploading:false,
         });
     }

    
  }
  
 nextPage(evt) {
    evt.preventDefault();
    if (this.state.name
           && this.state.contact 
      && this.state.address
     ) {
    
        this.setState({
          nameerror: false,
                    addresserror:false,
          contacterror: false
        });
        this.toggle('2')
     
    }
    else {
      this.setState({
        nameerror: !this.state.name,
              addresserror: !this.state.address,
        contacterror: !this.state.contact       
      })
    }
  }
  toggle( tab) {   
    this.setState({
      activeTab: tab,
    });
  }



  nextPage2(){
if(!this.state.checkoutDate 
   ||!this.state.checkinDate 
   ||!this.state.room
   ||!this.state.roomcode 
   || this.state.checkoutDate<=this.state.checkinDate) {
    this.setState({
      checkindateerror: !this.state.checkinDate,
      checkoutdateerror: !this.state.checkoutDate,
      roomerror: !this.state.room,
      roomtypeerror: !this.state.roomcode 
    })
}

else{
  this.toggle('3')
  let difdays = Math.round((new Date(this.state.checkoutDate) - new Date(this.state.checkinDate)) / (1000 * 60 * 60 * 24))
  let difdays2 = Math.ceil((new Date(this.state.checkoutDate) - new Date(this.state.checkinDate)) / (1000 * 60 * 60 * 24))
  if(difdays2>difdays){
    difdays=difdays2;
  }

  let properties =  this.state.properties.filter(property=>property.roomNumber==this.state.room); 
let total=properties[0].price*difdays;
  this.setState({
    checkindateerror: false,
      checkoutdateerror: false,
      roomerror: false,
      total,
      residence:properties[0],
      days:difdays,
      roomtypeerror: false      
  })
} 

  }

  tabPane() {
    return (
      <>
        <TabPane tabId="1">
        <div class="container">
  <div class="row">
    <div class="col-2">


    <Loader show={this.state.uploading} message={spinner} hideContentOnLoad={true} backgroundStyle={{color:'white'}} messageStyle={{margin:'auto',padding:'10px'}}>
 <Card > 
 
     <di id='photo'>
     <img  alt='Fotografia' src={!this.state.file?`${baseURL}/blank-user.png`:`${baseURL}/${this.state.file}`} style={{height:'12em',width:'100%', "background-size": 'cover'}}  />     
       </di>  
               </Card>  </Loader>           
              <Button size='sm' style={{width:'100%'}}> <ReactDropzone  multiple={ true } onDrop={this.handleDrop.bind(this)} accept="image/*" >
      {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
             Carregar Fotografia
            </div>
          )}
           
    </ReactDropzone></Button>

    </div>
    <div class="col-10">
 
    <Card>        
              <CardBody>
              <Form action="" method="post">
                  <FormGroup>
                    <Label htmlFor="nf-email">Nome Completo</Label>
                    <Input type="text" onChange={this.handleChange} name="name"  value={this.state.name}  placeholder="Introduza o nome.."  required/>
                    <span>{this.state.nameerror? <div className="required">Por favor introduza o nome completo</div>:null}</span>
                  </FormGroup> 
                  <FormGroup className="pr-1">
                    <Label htmlFor="exampleInputEmail2" className="pr-1">Email</Label>
                    <Input type="email" onChange={this.handleChange} name="email" value={this.state.email} placeholder="jane.doe@example.com"  />
                    <span>{this.state.emailerror? <div className="required">Por favor informe o email</div>:null}</span>
                  </FormGroup>
                  <FormGroup className="pr-1">
                    <Label htmlFor="exampleInputEmail2" className="pr-1">Contacto</Label>
                    <Input type="text" name="contact" onChange={this.handleChange} value={this.state.contact} placeholder="(XXX) XXXXXXXX"  />
                    <span>{this.state.contacterror? <div className="required">Por favor informe o contacto</div>:null}</span>
                  </FormGroup>
                  <FormGroup className="pr-1">
                    <Label htmlFor="exampleInputEmail2" className="pr-1">Endereço</Label>
                    <Input type="textarea" rows="2" onChange={this.handleChange} name="address" value={this.state.address} placeholder="Av. Exemplo1, Rua ex2, Casa nr. x"  />
                    <span>{this.state.addresserror? <div className="required">Por favor informe o Endereço</div>:null}</span>
                  </FormGroup>                                              
                </Form>
              </CardBody>
              <CardFooter>
               <span> <Button type="submit" size="sm" onClick={this.nextPage.bind(this)} color="primary"> Próximo <i className="fa fa-chevron-circle-right"></i></Button>
               </span> <span><Button onClick={this.reset.bind(this)} type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Cancelar</Button>
               </span> </CardFooter>
            </Card>   
            
    </div>
 
  </div>
</div>
        </TabPane>
  <TabPane tabId="2">    
       
    <Card>        
              <CardBody>
              <Form action="" method="post">

              <FormGroup>
                    <Label htmlFor="nf-email">Tipo de Quarto</Label>
                    <Input type="select" name="roomcode" onChange={this.handleChangeRoomType}>
                       
                        <option value={this.state.roomcode}>{this.state.roomcode?rooTypes.filter(room=>room.capacity===this.state.roomcode)[0].desc:''}</option>
                {
                       rooTypes.map((room,index) =>   
                        <option value={room.capacity} key={index}>{room.desc}</option>
  
                                        )
  
                  }        
                
                       </Input>
                        <span>{this.state.roomtypeerror? <div className="required">Por favor seleccione o tio de quarto</div>:null}</span>
        </FormGroup>      
        <FormGroup>
                    <Label htmlFor="nf-email">Data de Check-In</Label>
                    <Input type="date" min={new Date().toISOString().split("T")[0]} onChange={this.handleChangeStartDate} name="checkinDate"  value={this.state.checkinDate}  placeholder="Introduza a data de check-in.."  required/>
                    <span>{this.state.checkindateerror? <div className="required">Por favor introduza a data de check-in</div>:null}</span>
                  </FormGroup> 

                    <FormGroup>
                    <Label htmlFor="nf-email">Data de Check-Out</Label>
                    <Input type="date" min={new Date().toISOString().split("T")[0]} onChange={this.handleChangeEndDate} name="checkoutDate"  value={this.state.checkoutDate}  placeholder="Introduza a data de check-out.."  required/>
                    <span>{this.state.checkoutdateerror? <div className="required">Por favor introduza a data de check-out</div>:null}</span>
                    <span>{this.state.checkoutDate<=this.state.checkinDate? <div className="required">A data de check-out deve ser superior a data de check-in</div>:null}</span>
                  </FormGroup>   

                  <FormGroup>

                  <Row>
                  <Col sm="5">
                    <CardTitle className="mb-0">Selecione um dos quartos disponíveis </CardTitle>
                                     </Col>
                  <Col sm="7" className="d-none d-sm-inline-block">
                       <ButtonToolbar className="float-right" aria-label="Toolbar with button groups">
                      <ButtonGroup className="mr-3" aria-label="First group">
                        <Button color={this.state.one?"outline-success":"outline-secondary"} onClick={() => this.onRadioBtnClick(1)} active={this.state.radioSelected === 1} disabled={!this.state.one} >Nr. 1</Button>
                        <Button color={this.state.two?"outline-success":"outline-secondary"} onClick={() => this.onRadioBtnClick(2)} active={this.state.radioSelected === 2} disabled={!this.state.two} >Nr. 2</Button>
                        <Button color={this.state.three?"outline-success":"outline-secondary"} onClick={() => this.onRadioBtnClick(3)} active={this.state.radioSelected === 3} disabled={!this.state.three} >Nr. 3</Button>
                        <Button color={this.state.four?"outline-success":"outline-secondary"} onClick={() => this.onRadioBtnClick(4)} active={this.state.radioSelected === 4} disabled={!this.state.four} >Nr. 4</Button>
                        <Button color={this.state.five?"outline-success":"outline-secondary"} onClick={() => this.onRadioBtnClick(5)} active={this.state.radioSelected === 5} disabled={!this.state.five}>  Nr. 5</Button>
                        <Button color={this.state.six?"outline-success":"outline-secondary"} onClick={() => this.onRadioBtnClick(6)} active={this.state.radioSelected === 6} disabled={!this.state.six}>Nr. 6</Button>
                        <Button color={this.state.seven?"outline-success":"outline-secondary"} onClick={() => this.onRadioBtnClick(7)} active={this.state.radioSelected === 7} disabled={!this.state.seven}>Nr. 7</Button>
                        <Button color={this.state.height?"outline-success":"outline-secondary"} onClick={() => this.onRadioBtnClick(8)} active={this.state.radioSelected === 8} disabled={!this.state.height}>Nr. 8</Button>
                      </ButtonGroup>
                    </ButtonToolbar>
                  </Col>
                  <span>{this.state.roomerror? <div className="required">Por favor selecione o número do quarto, dentro dos quartos disponíveis</div>:null}</span>
                </Row>

                  </FormGroup>

                </Form></CardBody>
                <CardFooter>
                <span><Button type="submit" size="sm" onClick={this.toggle.bind(this,'1')} color="primary"> <i className="fa fa-chevron-circle-left"></i>Anterior</Button>
                </span> <span> <Button type="submit" size="sm"  onClick={this.nextPage2.bind(this)} color="primary"> Próximo <i className="fa fa-chevron-circle-right"></i></Button>
                </span> <span> <Button type="reset" onClick={this.reset.bind(this)} size="sm" color="danger"><i className="fa fa-ban"></i> Cancelar</Button>
                </span> </CardFooter>
                </Card>
        </TabPane>
        <TabPane tabId="3">  
   
        <div class="container">
  <div class="row">
    <div class="col-2">

 <Card > 

     <di id='photo'>
     <img alt='Fotografia' src={!this.state.file?`${baseURL}/blank-user.jpg`:`${baseURL}/${this.state.file}`} style={{height:'12em',width:'100%', "background-size": 'cover'}}  />     
       </di>  
                </Card>            

    </div>
    <div class="col-10">
 
    <Card>        
              <CardBody>

              <div>         
<div className='details'>
<strong>Nome Completo: </strong>
<Label htmlFor="nf-email">{this.state.name}</Label>            
</div></div> 
<div>
<div className='details'>
<strong>Email: </strong>
<Label htmlFor="nf-email">{this.state.email}</Label>            
</div>
</div>

<div>
<div className='details'>
<strong>Contacto: </strong>
<Label htmlFor="nf-email">{this.state.contact}</Label>            
</div>
</div>
<div>
<div className='details'>
<strong>Endereço: </strong>
<Label htmlFor="nf-email">{this.state.address}</Label>            
</div>
</div>

<div>
<div className='details'>
<strong>Tipo e Nr. de Quarto: </strong>
<Label htmlFor="nf-email">{this.state.roomcode?rooTypes.filter(room=>room.capacity===this.state.roomcode)[0].desc:''} Nr. {this.state.room}</Label>            
</div>
</div>

<div>
<div className='details'>
<strong>Data de Check-In: </strong>
<Label htmlFor="nf-email">{this.state.checkinDate}</Label>            
</div>
</div>

<div>
<div className='details'>
<strong>Data de Check-Out: </strong>
<Label htmlFor="nf-email">{this.state.checkoutDate}</Label>            
</div>
</div>

<div>
<div className='details'>
<strong>Nr de dias: </strong>
<Label htmlFor="nf-email">{this.state.days}</Label>            
</div>
</div>

<div>
  
<div className='details'>
<strong>Total da Reserva: </strong>
<Label htmlFor="nf-email">{this.state.total} MZN</Label>            
</div>
</div>

              </CardBody>
              <CardFooter>
              <span><Button type="submit" size="sm" onClick={this.state.user?this.toggle.bind(this,'2'):this.toggle.bind(this,'2')} color="primary"> <i className="fa fa-chevron-circle-left"></i>Anterior</Button>
                </span> <span> <Button type="submit" size="sm"  onClick={this.createBooking.bind(this)} color="primary"> Confirmar </Button>
                </span> <span> <Button onClick={this.reset.bind(this)} type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Cancelar</Button>
                </span></CardFooter>
            </Card>   
            
    </div>
 
  </div>
</div>
        
       
        </TabPane>

        <TabPane tabId="4">
        
        
        <Alert color="success" isOpen={this.state.visible} toggle={this.onDismiss.bind(this)}>
                 Operação Realizada com sucesso!
                </Alert> 
        <div class="container">
  <div class="row">
    <div class="col-2">



 <Card > 

     <di id='photo'>
     <img alt='Fotografia' src={!this.state.file?`${baseURL}/blank-user.jpg`:`${baseURL}/${this.state.file}`} style={{height:'12em',width:'100%', "background-size": 'cover'}}  />     
       </di>  
                </Card>            

    </div>
    <div class="col-10">
 
    <Card>        
              <CardBody>
              <div>         
<div className='details'>
<strong>Nome Completo: </strong>
<Label htmlFor="nf-email">{this.state.name}</Label>            
</div></div> 
<div>
<div className='details'>
<strong>Email: </strong>
<Label htmlFor="nf-email">{this.state.email}</Label>            
</div>
</div>

<div>
<div className='details'>
<strong>Contacto: </strong>
<Label htmlFor="nf-email">{this.state.contact}</Label>            
</div>
</div>
<div>
<div className='details'>
<strong>Endereço: </strong>
<Label htmlFor="nf-email">{this.state.address}</Label>            
</div>
</div>

<div>
<div className='details'>
<strong>Tipo e Nr. de Quarto: </strong>
<Label htmlFor="nf-email">{this.state.roomcode?rooTypes.filter(room=>room.capacity===this.state.roomcode)[0].desc:''} Nr. {this.state.room}</Label>            
</div>
</div>

<div>
<div className='details'>
<strong>Data de Check-In: </strong>
<Label htmlFor="nf-email">{this.state.checkinDate}</Label>            
</div>
</div>

<div>
<div className='details'>
<strong>Data de Check-Out: </strong>
<Label htmlFor="nf-email">{this.state.checkoutDate}</Label>            
</div>
</div>

<div>
<div className='details'>
<strong>Nr de dias: </strong>
<Label htmlFor="nf-email">{this.state.days}</Label>            
</div>
</div>

<div>
  
<div className='details'>
<strong>Total da Reserva: </strong>
<Label htmlFor="nf-email">{this.state.total} MZN</Label>            
</div>
</div>
              </CardBody>
              <CardFooter>
               <Button type="submit" size="sm" onClick={this.reset.bind(this)}  color="primary"> Cadastrar outro Parceiro </Button>
                </CardFooter>
            </Card>   
            
    </div>
 
  </div>
</div>
        </TabPane>
      </>
    );
  }

  render() {
    return (
      
      <div className="animated fadeIn">    
        <Row>
                    <Col xs="12" md="12" className="mb-4">
            <Nav tabs>
              <NavItem>
                <NavLink
                  active={this.state.activeTab === '1'}
                
                >
                Dados Pessoais                
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={this.state.activeTab === '2'}              
                >
               Dados da Reserva
            
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={this.state.activeTab === '3'}
                  >
               Confirmar
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink
                  active={this.state.activeTab=== '4'}
                 >
                    <i className="icon-check"></i>
                    <span className={this.state.activeTab === '4' ? '' : 'd-none'}><Badge pill color="success">Sucesso</Badge> </span>
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
              {this.tabPane()}
            </TabContent>
          </Col>
        </Row>
      </div>
    );
  }
}

export default CreateWorker;
