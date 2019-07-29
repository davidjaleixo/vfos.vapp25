import { Component, OnInit } from '@angular/core';
import { ProjectService, AuthenticationService, SupplierService, CompositionsService, SlumpService, NotificationService, MaterialService, ParsService, ItemsService, RmesService, ReceivedService } from '../../_services';
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
//loading spinner
import { NgxSpinnerService } from 'ngx-spinner';
import { empty, EMPTY } from 'rxjs';

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
  parslist: any;
  receivingList: any[];

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
    private receivedservice: ReceivedService
  ) { }

  ngOnInit() {

    //init the new item form
    this.newItem = this.fb.group({
      name: ['', [Validators.required]],
      qtd: ['', [Validators.required]],
      itemmaterial: ['', [Validators.required]]
    });

    //init the new rme form
    this.newRme = this.fb.group({
      parnumber: ['', [Validators.required]]
    })

    //init items list
    this.itemsList = [];

    this.projectservice.getProject(this.router.snapshot.paramMap.get("idproject")).subscribe(
      data => {
        console.log(data);
        this.project = data;
      }, err => {
        console.log(err);
      })

    //get user details
    let user = this.authentication.getUserDetails();
    if (user != null) {
      this.user = user
    }

    //get available materials
    this.materialservice.getAll().subscribe(data => {
      this.materials = data;
    }, err => { })

    //get available pars for this project
    this.parsservice.getByProject(this.router.snapshot.paramMap.get("idproject")).subscribe(
      data => {
        this.pars = data
      }, err => {
        console.log(err);
      }
    )
  }

  getListFromPar(parid) {
    this.itemservice.getByPar(parid).subscribe(data => {
      this.parslist = data;
      this.receivingList = new Array(this.parslist.length);
    })
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
  delItem(id) {
    this.itemsList.forEach((eachItem, idx, array) => {
      if (eachItem.id == id) {
        this.itemsList.splice(idx, 1);
        return
      }
    })

  }

  onParSelectChange(parObject) {
    console.log(parObject);
    this.getListFromPar(parObject.idpars);

  }
  createRME() {
    console.log(this.receivingList);
    this.rmesservice.create(0, 'New RME to be approved').subscribe(data => {
      //RME was created
      //get the newly created RME
      this.rmesservice.getNewly().subscribe(data => {
        let newRme: any = data;
        console.log("newRme:", newRme);
        this.parslist.forEach((eachItem, idx, array) => {
          if (this.receivingList[idx] != 0 && this.receivingList[idx] != null) {
            console.log("creating received for ", idx, "-", this.receivingList[idx])
            //create a new item to be received in the new RME created
            this.receivedservice.create(eachItem.idlist, newRme.idrmes, this.receivingList[idx]).subscribe(data => {
              //probably nothing to do here
            })
          }
          if (idx == array.length - 1) {
            this.alert.success("RME was created with id " + newRme.idrmes);
            this.rmesservice.updateStatus(newRme.idrmes, 1).subscribe(statusUpdate => {
              this.alert.success("RME " + newRme.idrmes + " was SENT to approval!");
              //flush the receiving list
              this.receivingList = [];
            })
          }
        })
      })
    })

  }
  createPAR() {
    this.parsservice.create(this.project.idprojects, 0, 'New PAR to be approved').subscribe(data => {
      //PAR was created
      //get the newly created PAR
      this.parsservice.getNewly(this.project.idprojects).subscribe(data => {
        let newPar: any = data;

        console.log("newPar:", newPar);
        this.itemsList.forEach((eachItem, idx, array) => {
          this.itemservice.create(newPar.idpars, eachItem.itemmaterial.idmaterials, eachItem.qtd, eachItem.description).subscribe(response => {
            if (idx == array.length - 1) {
              this.alert.success("PAR was created with id " + newPar.idpars);
              //change par status
              this.parsservice.updateStatus(newPar.idpars, 1).subscribe(statusUpdate => {
                this.alert.success("PAR " + newPar.idpars + " was SENT to approval!");
                //flush the itemsList
                this.itemsList = [];
              })
            }
          }, err => {
            this.alert.error(err);
          })
        })
      }, err => {
        console.log('err', err);
      })

    }, err => {

    })
  }

  // nextactionSend() {
  //   console.log("sending notifications... from:",this.nextaction.answer);
  //   this.nextaction.show = false;
  //   this.spinner.show();
  //   this.notificationservice.sendNotification(this.nextaction.answer).subscribe(
  //     data => {
  //       this.spinner.hide();
  //       this.alert.success("Notifications sent");
  //       this.newslump.reset();
  //     }, err => {
  //       this.spinner.hide();
  //       this.alert.error(err);
  //       this.nextaction.show = false;
  //       this.newslump.reset();
  //     })
  // }
  // nextactionNo() {
  //   console.log("No notifications will be sent");
  //   this.nextaction.show = false;
  //   this.newslump.reset();
  // }

  // saveSlump() {

  //   if (this.f.supplierid.value != "" && this.f.value.value != 0 && this.f.compositionid.value.idcompositions != "" && this.f.loadid.value != "") {
  //     //console.log("max:", this.f.compositionid.value.tholdmax);
  //     //console.log("min:", this.f.compositionid.value.tholdmin);
  //     if (this.f.value.value >= this.f.compositionid.value.tholdmax || this.f.value.value <= this.f.compositionid.value.tholdmin) {

  //       //check if the introduced value is outside of the thresholds
  //       var result = confirm("The slump test value is out of threshold's range - Notification will be sent!");
  //       if (result) {
  //         //if the user wants to trigger a notification already

  //         //get the next predicted value
  //         this.spinner.show();
  //         this.slumpservice.registerTest(this.f.value.value, this.f.compositionid.value.idcompositions, this.project.idprojects, this.f.supplierid.value.idsuppliers, this.f.loadid.value).subscribe(
  //           data => {
  //             console.log("registerTest", data);
  //             this.alert.success("Test was saved")

  //             //generate already the notification because threshold is already overcomed
  //             console.log("Creating first notification... threshold overcomed");
  //             this.notificationservice.sendNotification({ result: { code: 3, message: "outside thresholds", type: "measured" }, prediction: this.f.value.value, idcompositions: this.f.compositionid.value.idcompositions, idprojects: this.project.idprojects, idsuppliers: this.f.supplierid.value.idsuppliers }).subscribe(
  //               notAnswer => {
  //                 console.log("Creating first notification answer: ", notAnswer);
  //                 this.alert.success("Warnings sent");
  //               }, err => {
  //                 console.log("Creating first notification answer: ", err);
  //                 this.alert.success("Warning not sent");
  //               }
  //             )


  //             //get the prediction FOR THE NEXT SLUMP TEST VALUE
  //             this.slumpservice.createPrediction(this.f.value.value, this.f.compositionid.value.idcompositions, this.project.idprojects, this.f.supplierid.value.idsuppliers, this.f.loadid.value).subscribe(
  //               predictionAnswer => {
  //                 this.spinner.hide();
  //                 this.nextaction.answer = predictionAnswer;
  //                 // this.newslump.reset();
  //                 console.log("predictionAnswer", predictionAnswer)
  //                 if (predictionAnswer.result.code != 0 && predictionAnswer.result.code != 4) {
  //                   this.nextaction.show = true;
  //                   this.nextaction.value = predictionAnswer.prediction;
  //                   this.nextaction.deviation = (1 - predictionAnswer.deviation) * 100;
  //                   this.nextaction.message = predictionAnswer.result.message;
  //                 } else {
  //                   this.newslump.reset();
  //                 }
  //               },
  //               predictionErr => {
  //                 console.log("predictionErr", predictionErr)
  //               }
  //             )

  //           }, err => {
  //             this.spinner.hide();
  //             this.alert.error("Error ")
  //           })


  //       } else {
  //         this.alert.info("Test was not stored by your decision");

  //       }

  //     } else {
  //       this.spinner.show();
  //       this.slumpservice.registerTest(this.f.value.value, this.f.compositionid.value.idcompositions, this.project.idprojects, this.f.supplierid.value.idsuppliers, this.f.loadid.value).subscribe(
  //         data => {
  //           console.log("registerTest", data);

  //           this.alert.success("Test was saved")

  //           //get the prediction
  //           this.slumpservice.createPrediction(this.f.value.value, this.f.compositionid.value.idcompositions, this.project.idprojects, this.f.supplierid.value.idsuppliers, this.f.loadid.value).subscribe(
  //             predictionAnswer => {
  //               this.spinner.hide();
  //               this.nextaction.answer = predictionAnswer;
  //               console.log("predictionAnswer", predictionAnswer)
  //               if (predictionAnswer.result.code != 0 && predictionAnswer.result.code != 4) {
  //                 this.nextaction.show = true;
  //                 this.nextaction.value = predictionAnswer.prediction;
  //                 this.nextaction.deviation = (1 - predictionAnswer.deviation) * 100;
  //                 this.nextaction.message = predictionAnswer.result.message;
  //               } else {
  //                 this.newslump.reset();
  //               }
  //             },
  //             predictionErr => {
  //               console.log("predictionErr", predictionErr)
  //             }
  //           )


  //         }, err => {
  //           this.spinner.hide();
  //           this.alert.error("Error ")
  //         })
  //     }
  //   } else {
  //     this.alert.error("Please insert all the fields")
  //   }
  // }

}
