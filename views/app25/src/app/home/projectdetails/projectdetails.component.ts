import { Component, OnInit } from '@angular/core';
import { ProjectService, AuthenticationService, SupplierService, CompositionsService, SlumpService, NotificationService, MaterialService, ParsService, ItemsService, RmesService, ReceivedService, ParsLinksService } from '../../_services';
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
//loading spinner
import { NgxSpinnerService } from 'ngx-spinner';
import { empty, EMPTY } from 'rxjs';
import { createOfflineCompileUrlResolver } from '@angular/compiler';

@Component({
  selector: 'app-projectdetails',
  templateUrl: './projectdetails.component.html',
  styleUrls: ['./projectdetails.component.css']
})
export class ProjectdetailsComponent implements OnInit {

  project: any;
  user: any;
  materials: any;
  newItem: FormGroup;
  newRme: FormGroup;
  submitted: boolean;
  itemsList: any[];
  pars: any;
  newParLink: any;
  newParLinks: any;
  parslist: any;
  receivingList: any[];
  showpar: any;
  showmaterialsspecs: any;
  listrmes: any;
  approvedrmes: any;
  approvedrmesqtd: any;
  showquantityalert: boolean;
  cancreaterme: boolean;

  nextaction: any = { show: false };


  constructor(
    private projectservice: ProjectService,
    private router: ActivatedRoute,
    private authentication: AuthenticationService,
    private slumpservice: SlumpService,
    private fb: FormBuilder,
    private alert: ToastrService,
    private spinner: NgxSpinnerService,
    private notificationservice: NotificationService,
    private materialservice: MaterialService,
    private parsservice: ParsService,
    private itemservice: ItemsService,
    private rmesservice: RmesService,
    private receivedservice: ReceivedService,
    private parslinksservice: ParsLinksService
  ) { }

  ngOnInit() {
    this.showquantityalert = false;
    this.cancreaterme = true;
    this.newParLinks = [];
    this.newParLink = { description: '', link: '' };
    this.showmaterialsspecs = {name:''}

    //init the new item form
    this.newItem = this.fb.group({
      name: ['', [Validators.required]],
      qtd: ['', [Validators.required]],
      itemmaterial: ['', [Validators.required]]
    });

    //init the new rme form
    this.newRme = this.fb.group({
      parnumber: ['', [Validators.required]],
      qtd: ['', [Validators.required]],
      description: ['', [Validators.required]]
    })

    //init items list
    this.itemsList = [];

    this.listrmes = [];
    this.approvedrmes = 0;
    this.approvedrmesqtd = 0;
    this.showpar = { idpars: 0, description: "", qtd: 0 };
    this.projectservice.getProject(this.router.snapshot.paramMap.get("idproject")).subscribe(
      data => {
        console.log(data);
        this.project = data;
      }, err => {
        console.log(err);
      }
    )

    //get user details
    let user = this.authentication.getUserDetails();
    if (user != null) {
      this.user = user
    }

    //get available materials
    this.materialservice.getByProject(this.router.snapshot.paramMap.get("idproject")).subscribe(data => {
      console.log("materials for the project ", this.router.snapshot.paramMap.get("idproject"), ":", data);
      this.materials = data;
    }, err => { })

    this.getProjectPars();
  }

  getProjectPars(){
    //get available pars for this project
    this.parsservice.getByProject(this.router.snapshot.paramMap.get("idproject")).subscribe(
      data => {
        this.pars = data
      }, err => {
        console.log(err);
      }
    )
  }

  getListRme(parid) {
    this.rmesservice.getByPar(parid).subscribe(listrme => {
      this.listrmes = listrme;
      console.log("All RMES: ", listrme);
      this.approvedrmes = 0;
      this.approvedrmesqtd = 0;
      this.listrmes.forEach(eachRme => {
        if (+eachRme.status == 1) {
          console.log("Approved RME found");
          this.approvedrmes = this.approvedrmes + 1;
          this.approvedrmesqtd = this.approvedrmesqtd + +eachRme.qtd;
          //check if its possible to create a new RME
          if(this.approvedrmesqtd >= this.showpar.qtd){
            this.cancreaterme = false;
          }
        }
      })
    })
  }
  getListMaterialSpecs(idmaterial){
    this.materialservice.getById(idmaterial).subscribe(data => {
      console.log("MAT SPECS:", data);
      this.showmaterialsspecs = data;
      this.materialservice.getLinksById(idmaterial).subscribe(matlinks => {
        this.showmaterialsspecs.links = matlinks
      })
    })
  }
  getListFromPar(parid) {
    this.cancreaterme = true;
    this.parsservice.getById(parid).subscribe(data => {
      console.log("PAR:", data);
      this.showpar = data;
      this.getListMaterialSpecs(this.showpar.idmaterials)
      //get links for this par
      this.parslinksservice.getByParId(parid).subscribe(parlinks => {
        this.showpar.links = parlinks;
      })
      //get material infomation

    })
    // this.itemservice.getByPar(parid).subscribe(data => {
    //   this.parslist = data;
    //   this.receivingList = new Array(this.parslist.length);
    // })
  }

  //getter
  get f() { return this.newItem.controls }

  get frme() { return this.newRme.controls }

  addItem() {
    this.submitted = true;
    if (this.newItem.invalid) {
      console.log(this.f);
      return;
    }
    let newItem = { id: this.itemsList.length + 1, description: this.f.name.value, qtd: this.f.qtd.value, itemmaterial: this.f.itemmaterial.value }
    this.itemsList.push(newItem);
    //flush the form
    this.newItem.reset();
    this.submitted = false;
  }
  delLink(id) {
    this.newParLinks.forEach((eachLink, idx, array) => {
      if (eachLink.id == id) {
        this.newParLinks.splice(idx, 1);
      }
    })
  }

  onParSelectChange(parObject) {
    console.log(parObject);
    this.getListFromPar(parObject.idpars);
    this.getListRme(parObject.idpars);

  }
  addLink() {
    if (this.newParLink.description != '' && this.newParLink.link != '') {
      this.newParLink.id = this.newParLinks.length + 1;
      this.newParLinks.push(this.newParLink);
      this.newParLink = { description: '', link: '' };
    } else {
      this.alert.error("The description and link form must be filled");
    }
  }
  createRME() {
    this.submitted = true;
    if (this.newRme.invalid) {
      console.log(this.frme);
      return;
    }
    if (this.showpar.idpars) {
      let status = null;
      //check if the qtd is acceptable
      if(+this.frme.qtd.value > (+this.showpar.qtd - +this.approvedrmesqtd) ){
        this.alert.error("You cannot receive more then the requested quantity")
        this.showquantityalert = true;
        return;
      }
      if (this.user.role == "2") { status = 1 }
      this.rmesservice.create(this.frme.parnumber.value.idpars, this.frme.qtd.value, status, this.frme.description.value).subscribe(data => {
        this.alert.success("New RME created");
        this.showquantityalert = false;
        this.submitted = false;
        this.newRme.reset();
        //clear rest of the form
        this.showpar = { idpars: 0, description: "", qtd: 0 }
        this.showmaterialsspecs = {name:''}
        this.approvedrmes = 0;
        this.approvedrmesqtd = 0;
      })
    }
  }
  createPAR() {
    this.submitted = true;
    if (this.newItem.invalid) {
      console.log(this.f);
      return;
    }
    // let newItem = { id: this.itemsList.length + 1, description: this.f.name.value, qtd: this.f.qtd.value, itemmaterial: this.f.itemmaterial.value }
    // this.itemsList.push(newItem);
    console.log("Creating PAR...");
    console.log(this.f.itemmaterial.value);
    this.parsservice.create(this.project.idprojects, this.f.name.value, this.f.itemmaterial.value.idmaterials, this.f.qtd.value).subscribe(data => {
      this.alert.success("PAR created");

      //get the newly created
      this.parsservice.getByProject(this.project.idprojects).subscribe(data => {
        let createdPar: any;
        createdPar = data;
        //create the links for this new par
        this.newParLinks.forEach((eachLink, idx, array) => {
          this.parslinksservice.create(createdPar[createdPar.length - 1].idpars, eachLink.description, eachLink.link).subscribe(data => {
            this.alert.success("Link " + eachLink.description + " added");
          })
          if (idx == array.length - 1) {
            //reset the form variable
            this.newParLinks = [];
            //flush the form
            this.newItem.reset();
            this.submitted = false;
            this.getProjectPars();
          }
        })

      })
    }, err => {
      this.alert.error(err);
    })

  }


}
