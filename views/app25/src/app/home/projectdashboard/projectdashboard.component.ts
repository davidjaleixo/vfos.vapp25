import { Component, OnInit } from '@angular/core';
import { ProjectService, ParsService, RmesService, MaterialReceivedService } from 'src/app/_services';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-projectdashboard',
  templateUrl: './projectdashboard.component.html',
  styleUrls: ['./projectdashboard.component.css']
})
export class ProjectdashboardComponent implements OnInit {

  project: any;
  pars: any;
  parstobe: any;
  rmes: any;
  mats: any;
  rmestobe: any;
  parinfo: any;
  parinfoitems: any;

  constructor(private projectservice: ProjectService,
    private router: ActivatedRoute,
    private parsservice: ParsService,
    private rmesservice: RmesService,
    private matrec: MaterialReceivedService,
    private alert: ToastrService
  ) { }

  getPars() {
    this.parstobe = [];
    this.rmestobe = [];
    this.parsservice.getByProject(this.router.snapshot.paramMap.get("idproject")).subscribe(data => {
      this.pars = data;



      console.log("pars done");
      this.matrec.getAllByProject(this.router.snapshot.paramMap.get("idproject")).subscribe(data => {
        this.mats = data;
        console.log("mats done")

        this.pars.forEach(eachPar => {
          if (eachPar.status == 1) {
            this.parstobe.push(eachPar)
          }
          //init new variables
          if (!eachPar.totalreceived) {
            eachPar.totalreceived = 0;
          }
          if (!eachPar.totalitems) {
            eachPar.totalitems = 0;
          }
          if (!eachPar.rmesapproved) {
            eachPar.rmesapproved = 0
          }
          if (!eachPar.rmesrejected) {
            eachPar.rmesrejected = 0
          }
          if (!eachPar.rmestobe) {
            eachPar.rmestobe = 0
          }
          this.mats.forEach(eachItem => {
            if (eachItem.idpars == eachPar.idpars) {
              // get the approved rmes to get total amount of materials received
              if (eachItem.rmesstatus == 2) {
                eachPar.totalreceived += +eachItem.receivedqtd;
              }
              // sum the amount of items to be received
              eachPar.totalitems += +eachItem.itemqtd
              // sum the rmes status
              if (eachItem.rmesstatus == 2) {
                eachPar.rmesapproved += 1
              }
              if (eachItem.rmesstatus == 3) {
                eachPar.rmesrejected += 1
              }

              //get the unique RMES needing attention
              if (eachItem.rmesstatus == 1) {
                console.log("consolidating rmes...")
                //check if the list is empty
                if (this.rmestobe.length == 0) {
                  //add
                  this.rmestobe.push({ idrme: eachItem.idrme, item: [eachItem.idlist], par: eachItem.idpars })
                  console.log("First done");
                } else {
                  //check if it already exists
                  this.rmestobe.forEach((eachRme, idx, array) => {
                    if (eachRme.idrme == eachItem.idrme) {
                      //do nothing - dont add this
                      console.log("this rme " + eachItem.idrme + "already exists")
                      eachRme.item.push(eachItem.idlist);
                      return
                    }
                    if (idx == array.length - 1) {
                      //add

                      this.rmestobe.push({ idrme: eachItem.idrme, item: [eachItem.idlist], par: eachItem.idpars })
                      console.log("RMES TOBE: ", this.rmestobe)
                    }
                  })
                }

              }
            }

          })
        });
      })

    })



  }

  ngOnInit() {
    this.pars = [];
    this.rmes = [];
    this.parstobe = [];
    this.projectservice.getProject(this.router.snapshot.paramMap.get("idproject")).subscribe(
      data => {
        console.log(data);
        this.project = data;
      }, err => {
        console.log(err);
      })
    this.getPars();
  }
  approvePar(parid) {
    console.log(parid)
    this.parsservice.updateStatus(parid, 2).subscribe(data => {
      this.alert.success("PAR " + parid + " has been approved!")

      this.getPars();

    })
  }
  rejectPar(parid) {
    console.log(parid)
    this.parsservice.updateStatus(parid, 3).subscribe(data => {
      this.alert.success("PAR " + parid + " has been rejected!")
      this.getPars();
    })
  }
  approveRme(rmeid) {
    console.log(rmeid)
    this.rmesservice.updateStatus(rmeid, 2).subscribe(data => {
      this.alert.success("RME " + rmeid + " has been approved!")
      this.getPars();

    })
  }
  rejectRme(rmeid) {
    console.log(rmeid)
    this.rmesservice.updateStatus(rmeid, 3).subscribe(data => {
      this.alert.success("RME " + rmeid + " has been rejected!")
      this.getPars();
    })
  }
  showParInfo(parid) {
    this.parinfoitems = [];
    this.pars.forEach(eachPar => {
      this.mats.forEach(eachItem => {
        if (eachPar.idpars == parid && eachItem.idpars == parid) {
          this.parinfo = eachPar;
          //check if this item was already inserted
          let found = false;
          if (this.parinfoitems.length == 0) {
            this.parinfoitems.push(eachItem)
          } else {
            this.parinfoitems.forEach((eachItemInfo, idx, array) => {
              if (eachItemInfo.idlist == eachItem.idlist) {
                found = true;
              }
              if (idx == array.length - 1 && !found) {
                this.parinfoitems.push(eachItem)
                found = false;
              }
            })
          }


        }
      })
    })
  }
  showRmeInfo(parid) {

  }

}
