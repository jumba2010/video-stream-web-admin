import React, {Component} from 'react';
import {Badge, Col, Nav, NavItem, NavLink,Row,Input,Progress,Button,FormGroup,Label,Form,Alert, TabContent, TabPane,  Card,
  CardBody,
  CardFooter,
 } from 'reactstrap';
 import ReactDropzone from 'react-dropzone';

 import categories from './categories';

 import api,{baseURL} from './../../services/api'
 import { USER_KEY } from "./../../services/auth";

import { Player } from 'video-react';

import {FadeLoader} from 'react-spinners';

import Loader from 'react-loader-advanced';

import "../../../node_modules/video-react/dist/video-react.css"; 

const spinner=<div className='d-flex justify-content-center'><FadeLoader sizeUnit={"px"} size={200} color={'#ffffff'} loading={true}/></div>;

const defaultsize = 680668160;
const defaulttime = 5;

const initState={
  title: '',
  category: '',
  details: '',
  screenshot:'',
  url:'',  
  confirm: false,
  sucess:false,
  uploaded: false,
  issaving: false,
  uploading:false,
  recomended:false,
  percentage: 0,
  duration:0,
  filename:[],
  notfinish: true,
  titleerror: false,
  categoryerror:false,
  screenshoterror:false,
  files: [],
    activeTab:'1'
}


class CreateVideo extends Component {

  constructor(props) {
    super(props);
    this.state = initState;
    this.fileInputRef = React.createRef();
    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);   
    this.openFileDialog = this.openFileDialog.bind(this);
    this.onFilesAdded = this.onFilesAdded.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDrop = this.onDrop.bind(this);      

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

  }

  openFileDialog() {
    if (this.props.disabled) return;
    this.fileInputRef.current.click();
  }

  onFilesAdded(evt) {
    if (this.props.disabled) return;
    const files = evt.target.files;
    this.toggle('2')
    this.setState({ files: files });
    this.uploadVideo(files)
  }

  onDragOver(event) {
    event.preventDefault();
    if (this.props.disabed) return;
    this.setState({ hightlight: true });
  }

  onDragLeave(event) {
    this.setState({ hightlight: false });
  }

  onDrop(event) {
    event.preventDefault();
    if (this.props.disabed) return;
    const files = event.dataTransfer.files;
    this.toggle('2')
    this.setState({ files: files });
    this.uploadVideo(files);
    
  }

  createVideo = async e => {
    e.preventDefault();
    let user = JSON.parse(localStorage.getItem(USER_KEY));
    let createdBy=user._id;
    if(this.state.title 
      && this.state.category
      && this.state.screenshot
     ){
      this.setState({issaving:true})
      const { title, category, details, url,screenshot ,recomended,duration} = this.state
           await api.post("/api/video", {title, category, url,details,createdBy,screenshot,recomended,duration});

      //    api.post("/api/youtube/upload", {title, url,description:details}); 
      this.toggle('3')
      setTimeout( () =>{
      this.setState({visible:false, issaving: false })
     }, 4000);
   api.post("/api/notification", {title:title, _id:url,_class:'video',notfiatiodescription:'Novo Video publicado '});  
   }
  
   else{
    this.setState({
      screenshoterror:!this.state.screenshot,
      titleerror:!this.state.title,
      categoryerror:!this.state.category,    
   });
   }
  
  }

  uploadVideo = async (files) => {     
    let increment=0;
         this.setState({uploading:true})
      const updateProgress=(timetotal)=>{
       increment=increment+100/timetotal;
      if (this.state.percentage<100) {
          if(increment>=1){
        this.setState({percentage:this.state.percentage+1});
        increment=0;
      }     
        setTimeout(function () {
          updateProgress(timetotal);
        }, 1000);
            
      }

    };

    //Preparando para mandar o video 
    if (files.length !== 0) {
      //let loggedUser = JSON.parse(localStorage.getItem(USER_KEY));
      const data = new FormData();
      data.append('file', files[0],'VIDEO_'+(new Date()).getTime()+'.'+files[0].name.split('.').pop());
      data.append('filename', 'VIDEO_'+(new Date()).getTime()+'.'+files[0].name.split('.').pop());
      data.append('userId', 1);

      const config = {
        headers: {
          "content-type": "multipart/form-data"
        }
      };

      //Monitorando o progress bar
      let fileSize = files[0].size;
      let totalTime = fileSize * defaulttime / defaultsize;
    updateProgress(totalTime);
   let response= await api.post(
        "/api/upload/videos",
        data, config
      );

      increment=100
         this.setState({ percentage: 100, notfinish: false, url:response.data.file,confirm:true,uploaded:true,uploading:false,duration:response.data.duration })

    }

  }

  handleDrop =async (files) => {  
     //Preparando para mandar as imagens
     if (files.length !== 0) {
           const data = new FormData();
           data.append('file', files[0],'CAPA_'+(new Date()).getTime()+'.'+files[0].name.split('.').pop());
           data.append('filename', 'CAPA_'+(new Date()).getTime()+'.'+files[0].name.split('.').pop());

           const config = {
                 headers: {
                       "content-type": "multipart/form-data"
                 }
           };

          let resp= await api.post(
                 "/api/upload/videos/capa",
                 data, config
           );
                  this.setState({
            screenshot:resp.data.file,
           });
     }

    
  }
  
 toggle( tab) {   
    this.setState({
      activeTab: tab,
    });
  }

  tabPane() {
    return (
      <>


<TabPane tabId="1">

<div
        className={`Dropzone ${this.state.hightlight ? "Highlight" : ""}`}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
        onClick={this.openFileDialog}
        style={{ cursor: this.props.disabled ? "default" : "pointer" }}
      >
        <input
          ref={this.fileInputRef}
          className="FileInput"
          type="file"
          multiple
          onChange={this.onFilesAdded}
        />
        <img
          alt="upload"
          className="Icon"
          src={'assets/baseline-cloud_upload-24px.svg'}
          
        />

<h3><span>Seleccione o video para carregar</span></h3>
        <span>ou arraste e large o ficheiro</span>
      </div>

</TabPane>
        <TabPane tabId="2">
        <Loader show={this.state.issaving} message={spinner}   foregroundStyle={{color:'white'}} messageStyle={{margin:'auto',padding:'10px'}}>
        <div class="container">
  <div class="row">
    <div class="col-2">

<Loader show={this.state.uploading} message={spinner} hideContentOnLoad={true} backgroundStyle={{color:'white'}} messageStyle={{margin:'auto',padding:'10px'}}>
<div id='playVideo'>

<Player src={this.state.percentage!==100?'':`https://nacoesparacristo.org/public/files/videos/${this.state.url}`} 
                    playsInline
                  />

</div></Loader>
<Card > 
   <div id='banner'>
     <img alt='Capa de apresentação' src={!this.state.screenshot?'':`${baseURL}/${this.state.screenshot}`} style={{height:'6em',width:'100%', "background-size": 'cover'}}  />    
           
       <span>{this.state.screenshoterror? <div className="required">Por favor seleccione a capa</div>:null}</span>   </div>    </Card>            
              <Button color='primary' size='sm' style={{width:'100%'}} block outline> <ReactDropzone  multiple={ true } onDrop={this.handleDrop.bind(this)} accept="image/*" >
      {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <i className="icon-cloud-upload"></i>  Carregar capa de apresentação
            </div>
          )}
           
    </ReactDropzone></Button>
    </div>

   
    <div class="col-10">
   
    <Card>        
              <CardBody>            
              <Progress value={this.state.percentage}  animated={this.state.percentage===100?false:true} color={this.state.percentage===100?"success":"info"}  className="mb-3">{this.state.percentage}% </Progress>
              <Form action="" method="post">

              <FormGroup className="pr-1">
                    <Label htmlFor="exampleInputEmail2" className="pr-1">Titulo do vídeo</Label>
                    <Input type="text" onChange={this.handleChange} name="title" value={this.state.title} placeholder="Informe o título do video" />
                    <span>{this.state.titleerror? <div className="required">Por favor informe o título</div>:null}</span>
                  </FormGroup> 
              <FormGroup>
                    <Label htmlFor="nf-email">Categoria</Label>
                    <Input type="select" name="category" onChange={this.handleChange} >
                       
                        <option value={this.state.category}>{this.state.category?categories.filter(cat=>cat.code===this.state.category)[0].desc:''}</option>
                {
                       categories.map((cat,index) =>   
                        <option value={cat.code} key={index}>{cat.desc}</option>  
                                        )  
                  }                  
                       </Input>
                        <span>{this.state.categoryerror? <div className="required">Por favor seleccione a categoria de video</div>:null}</span>
        </FormGroup>                  

                  <FormGroup className="pr-1">
                    <Label htmlFor="exampleInputEmail2" className="pr-1">Descriçao extra</Label>
                    <Input type="textarea" rows="3" onChange={this.handleChange} name="details" value={this.state.details} placeholder="indroduza o endereço do local"  />
                    </FormGroup>                 
                
                  </Form> 
              </CardBody>
              <CardFooter>
               <span> <Button type="submit" size="sm" onClick={this.createVideo.bind(this)} color="primary"> Confirmar </Button>
               </span> <span><Button onClick={this.reset.bind(this)} type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Cancelar</Button>
               </span> </CardFooter>
            </Card>  
            
    </div>
 
  </div>
</div>
</Loader>
        </TabPane> 

        <TabPane tabId="3">
        
    
        <Alert color="success" isOpen={this.state.visible} toggle={this.onDismiss.bind(this)}>
                 Operação Realizada com sucesso!
                </Alert> 
        <div class="container">
  <div class="row">
    <div class="col-2">



 <Card > 

     <di id='banner'>
     <img alt='Capa de apresentação' src={!this.state.screenshot?'':`${baseURL}/${this.state.screenshot}`} style={{height:'6em',width:'100%', "background-size": 'cover'}}  />  
       </di>  
                </Card>            

    </div>
    <div class="col-10">
 
    <Card>        
              <CardBody>
              <div>         
<div className='details'>
<strong>Título do video: </strong>
<Label htmlFor="nf-email">{this.state.title}</Label>            
</div></div>
              <div>         
<div className='details'>
<strong>Categoria do Video: </strong>
<Label htmlFor="nf-email">{this.state.category?categories.filter(cat=>cat.code===this.state.category)[0].desc:''}</Label>            
</div></div> 

<div>
<div className='details'>
<strong>Descrição extra: </strong>
<Label htmlFor="nf-email">{this.state.details}</Label>            
</div>
</div>
</CardBody>
<CardFooter>
<Button type="submit" size="sm" onClick={this.reset.bind(this)}  color="primary"> Publicar novo video </Button>
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
               Carregar Vídeo            
                </NavLink>
              </NavItem> 
              <NavItem>
                <NavLink
                  active={this.state.activeTab === '2'}
                
                >
                Publicar Vídeo                
                </NavLink>
              </NavItem>     
                         <NavItem>
                <NavLink
                  active={this.state.activeTab=== '3'}
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

export default CreateVideo;
