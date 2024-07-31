import React, {Component} from 'react';
import {Badge, Col, Nav, NavItem,InputGroupAddon,InputGroup,InputGroupText, NavLink, Row,Input,Button,FormGroup,Label,Form,Alert, TabContent,TabPane,  Card,
  CardBody,
  CardFooter,
 } from 'reactstrap';
 import ReactDropzone from 'react-dropzone';
 import {FadeLoader} from 'react-spinners';
 
 import Loader from 'react-loader-advanced';

 import api,{baseURL} from './../../services/api'
 import { USER_KEY } from "./../../services/auth";

import compromisseTypes from './compromisseTypes'
import compromisseFrequencies from './compromisseFrequencies'
import compromisseDestinations from './compromisseDestinations'
import months from './months'

const spinner=<div className='d-flex justify-content-center'><FadeLoader sizeUnit={"px"} size={200} color={'#ffffff'} loading={true}/></div>;

const initState={
  email: '',
  name: '',
  activeTab:'1',
  lastname:'',
  contact: '',
  today:Date.now(),
  amount:'',
  destination:'',
  compromisse:'',
  type:'',
  address: '',
  date: '',        
  year: '2019',
  month:'',
  frequency:'',
  designation:'',
  files:[],
  amounterror:false, 
  designationerror:false, 
  frequencyerror:false, 
  montherror:false,
  compromisseerror:false,
  destinationerror:false, 
  typeError:false,
  notempt:false,          
  error: false,
}

class CreateWorker extends Component {
  constructor(props) {
    super(props);
    this.state = initState;
    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this); 

  }

  reset(){
    window.scrollTo(0, 0);
    this.setState(initState);  
    this.toggle('1');
   }

  onDismiss() {
    this.setState({ visible: false });
  }


  componentDidMount(){
    window.scrollTo(0, 0);
    }

    previousPage (evt) {
        this.toggle('1');   
    } 


  handleChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
     this.setState({
      nameerror: !this.state.name,
      lastnameerror: !this.state.lastname,
      addresserror: !this.state.address,
      contacterror: !this.state.contact       
    })

  }

  createPatner = async e => {
    e.preventDefault();
    this.setState({ issaving: true })
    let loggedUser = JSON.parse(localStorage.getItem(USER_KEY));
   let createdBy=loggedUser._id;  
    let { name, email, contact, amount, address, file, designation, lastname, frequency, year, month,destination, compromisse } = this.state
    let type = compromisse
    
    compromisse = {
          type,
          amount,
          designation,
          frequency,
          destination,
          year,
          month
    }

    let picture = file;


    let code = 'MNC' + '-' + name + '' + lastname
    await api.post("/api/patner", {
          code, name, lastname, email, contact,
          address, compromisse, picture, createdBy
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
      && this.state.lastname
      && this.state.contact 
      && this.state.address
     ) {
    
        this.setState({
          nameerror: false,
          lastnameerror: false,
          addresserror:false,
          contacterror: false
        });
        this.toggle('2')
     
    }
    else {
      this.setState({
        nameerror: !this.state.name,
        lastnameerror: !this.state.lastname,
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
if((this.state.compromisse==='C01' && (!this.state.destination ||!this.state.amount)) 
   ||!this.state.frequency 
   ||!this.state.month 
   ||!this.state.compromisse
   || (this.state.compromisse!=='C01' && !this.state.designation)) {
    this.setState({
      frequencyerror: !this.state.frequency,
      designationerror: !this.state.designation,
      destinationerror: !this.state.designation,
      compromisseerror: !this.state.compromisse,
      montherror: !this.state.month,       
    })
}

else{
  this.toggle('3')
  this.setState({
    frequencyerror: false,
    designationerror: false,
    destinationerror: false,
    compromisseerror: false,
    montherror: false,       
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
                    <Label htmlFor="nf-email">Apelido</Label>
                    <Input type="text" onChange={this.handleChange} name="lastname"  value={this.state.lastname}  placeholder="Introduza o apelido.."  required/>
                    <span>{this.state.lastnameerror? <div className="required">Por favor introduza o apelido</div>:null}</span>
                  </FormGroup> 
                  <FormGroup>
                    <Label htmlFor="nf-email">Outros Nomes</Label>
                    <Input type="text" onChange={this.handleChange} name="name"  value={this.state.name}  placeholder="Introduza o nome.."  required/>
                    <span>{this.state.nameerror? <div className="required">Por favor introduza o nome</div>:null}</span>
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
                    <Label htmlFor="nf-email">Compromisso</Label>
                    <Input type="select" name="compromisse" onChange={this.handleChange}>
                       
                        <option value={this.state.compromisse}>{this.state.compromisse?compromisseTypes.filter(comp=>comp.code===this.state.compromisse)[0].desc:''}</option>
                {
                       compromisseTypes.map((compromisse,index) =>   
                        <option value={compromisse.code} key={index}>{compromisse.desc}</option>
  
                                        )
  
                  }        
                
                       </Input>
                        <span>{this.state.compromisseerror? <div className="required">Por favor seleccione ocompromisso</div>:null}</span>
        </FormGroup>  


        {this.state.compromisse==='C01'?  <div>   <FormGroup>
                        <Label htmlFor="appendedPrependedInput">Quantia</Label>
                        <div className="controls">
                          <InputGroup className="input-prepend">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>MZN</InputGroupText>
                            </InputGroupAddon>
                            <Input id="amount" onChange={this.handleChange}  name='amount' size="16" type="text" />
                            <InputGroupAddon addonType="append">
                              <InputGroupText>.00</InputGroupText>
                            </InputGroupAddon>
                            
                          </InputGroup>                       
                        </div>
                        <span>{this.state.amounterror? <div className="required">Por favor indique a quantia</div>:null}</span>
                      </FormGroup>
                      <FormGroup>
                    <Label htmlFor="nf-email">Finalidade</Label>
                    <Input type="select" name="destination" onChange={this.handleChange}>
                       
                        <option value={this.state.destination}>{this.state.destination?compromisseDestinations.filter(d=>d.code===this.state.destination)[0].desc:''}</option>
                {
                       compromisseDestinations.map((destination,index) =>   
                        <option value={destination.code} key={index}>{destination.desc}</option>
  
                                        )
  
                  }        
                
                       </Input>
                        <span>{this.state.destinationerror? <div className="required">Por favor seleccione a Finalidade</div>:null}</span>
        </FormGroup>  
                      
                      
                      </div> :    
                    
                    <FormGroup>
                    <Label htmlFor="nf-email">Designação do Compromisso</Label>
                    <Input type="text" onChange={this.handleChange} name="designation"  value={this.state.designation}  placeholder="Introduza a designação.."  required/>
                    <span>{this.state.designationerror? <div className="required">Por favor introduza a designação</div>:null}</span>
                  </FormGroup>           
                                        
                    }

<FormGroup>
                    <Label htmlFor="nf-email">Frequência da Contribuição</Label>
                    <Input type="select" name="frequency" onChange={this.handleChange}>
                       
                        <option value={this.state.frequency}>{this.state.frequency?compromisseFrequencies.filter(frq=>frq.code===this.state.frequency)[0].desc:''}</option>
                {
                       compromisseFrequencies.map((frequency,index) =>   
                        <option value={frequency.code} key={index}>{frequency.desc}</option>
  
                                        )
  
                  }        
                
                       </Input>
                        <span>{this.state.frequencyerror? <div className="required">Por favor seleccione a frequência</div>:null}</span>
        </FormGroup> 
<FormGroup>

<Row>
                  <Col xs="4">
                    <FormGroup>
                      <Label htmlFor="ccmonth">Mês de Início</Label>
                      <Input type="select" name="month" onChange={this.handleChange}>
                       
                       <option value={this.state.month}>{this.state.month}</option>
               {
                      months.map((month,index) =>   
                       <option value={month.code} key={index}>{month.desc}</option>
 
                                       )
 
                 }        
               
                      </Input>
                       <span>{this.state.montherror? <div className="required">Por favor seleccione o Mês de início</div>:null}</span>
                    </FormGroup>
                  </Col>
                  <Col xs="4">
                    <FormGroup>
                      <Label htmlFor="ccyear">Ano de Início</Label>
                      <Input type="select" name="year" onChange={this.handleChange}>                                                            
                        <option>2019</option>
                        <option>2018</option>   
                        <option>2017</option> 
                        <option>2016</option>
                        <option>2015</option>
                        <option>2014</option>
                        <option>2013</option> 
                        <option>2012</option>                                         
                      </Input>
                      <span>{this.state.birtherror? <div className="required">Por favor seleccione o ano de início</div>:null}</span>
                    </FormGroup>
                  </Col>             
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
<strong>Apelido: </strong>
<Label htmlFor="nf-email">{this.state.lastname}</Label>            
</div></div> 
              <div>         
<div className='details'>
<strong>Nome: </strong>
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
<strong>Compromisso: </strong>
<Label htmlFor="nf-email">{this.state.compromisse?compromisseTypes.filter(comp=>comp.code===this.state.compromisse)[0].desc:''}</Label>            
</div>
</div>
{this.state.compromisse!=='C01'?
<div>
<div className='details'>
<strong>Designação do compromisso: </strong>
<Label htmlFor="nf-email">{this.state.designation}</Label>            
</div>
</div>:<div>
<div>
<div className='details'>
<strong>Quantia: </strong>
<Label htmlFor="nf-email">{this.state.amount} MZN</Label>            
</div>
</div>
<div>
<div className='details'>
<strong>Finalidade: </strong>
<Label htmlFor="nf-email">{this.state.destination?compromisseDestinations.filter(d=>d.code===this.state.destination)[0].desc:''}</Label>            
</div>
</div>
</div>
}
<div>
<div className='details'>
<strong>Frenquência: </strong>
<Label htmlFor="nf-email">{this.state.frequency?compromisseFrequencies.filter(frq=>frq.code===this.state.frequency)[0].desc:''}</Label>            
</div>
</div>

<div>
<div className='details'>
<strong>Ano e Mês de início: </strong>
<Label htmlFor="nf-email">{this.state.month?months.filter(m=>m.code===this.state.month)[0].desc:''}/{this.state.year}</Label>            
</div>
</div>

              </CardBody>
              <CardFooter>
              <span><Button type="submit" size="sm" onClick={this.state.user?this.toggle.bind(this,'2'):this.toggle.bind(this,'2')} color="primary"> <i className="fa fa-chevron-circle-left"></i>Anterior</Button>
                </span> <span> <Button type="submit" size="sm"  onClick={this.createPatner.bind(this)} color="primary"> Confirmar </Button>
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
<strong>Apelido: </strong>
<Label htmlFor="nf-email">{this.state.lastname}</Label>            
</div></div> 
              <div>         
<div className='details'>
<strong>Nome: </strong>
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
<strong>Compromisso: </strong>
<Label htmlFor="nf-email">{this.state.compromisse?compromisseTypes.filter(comp=>comp.code===this.state.compromisse)[0].desc:''}</Label>            
</div>
</div>
{this.state.compromisse!=='C01'?
<div>
<div className='details'>
<strong>Designação do compromisso: </strong>
<Label htmlFor="nf-email">{this.state.designation}</Label>            
</div>
</div>:<div>
<div>
<div className='details'>
<strong>Quantia: </strong>
<Label htmlFor="nf-email">{this.state.amount} MZN</Label>            
</div>
</div>
<div>
<div className='details'>
<strong>Finalidade: </strong>
<Label htmlFor="nf-email">{this.state.destination?compromisseDestinations.filter(d=>d.code===this.state.destination)[0].desc:''}</Label>            
</div>
</div>
</div>
}
<div>
<div className='details'>
<strong>Frenquência: </strong>
<Label htmlFor="nf-email">{this.state.frequency?compromisseFrequencies.filter(frq=>frq.code===this.state.frequency)[0].desc:''}</Label>            
</div>
</div>

<div>
<div className='details'>
<strong>Ano e Mês de início: </strong>
<Label htmlFor="nf-email">{this.state.month?months.filter(m=>m.code===this.state.month)[0].desc:''}/{this.state.year}</Label>            
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
               Compromisso
            
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
