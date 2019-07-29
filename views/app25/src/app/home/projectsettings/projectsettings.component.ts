import { Component, OnInit } from '@angular/core';
import { ProjectService, AuthenticationService, UserService, AccountsService, MaterialService } from '../../_services';
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-projectsettings',
  templateUrl: './projectsettings.component.html',
  styleUrls: ['./projectsettings.component.css']
})
export class ProjectsettingsComponent implements OnInit {

  project: any;
  unsetProject: any;
  materials: any;
  materialName: String;
  users: any;
  availableusers: any;
  groupedusers: any = [{ group: 'Admins', items: [] }, { group: 'Contractors', items: [] }, { group: 'Providers', items: [] }]
  selectedUser: any;
  user: any;
  newUserForm: FormGroup;


  constructor(
    private projectservice: ProjectService,
    private router: ActivatedRoute,
    private rou: Router,
    private authentication: AuthenticationService,
    private alert: ToastrService,
    private userservice: UserService,
    private accountservice: AccountsService,
    private materialservice: MaterialService,
    private fb: FormBuilder) { }

  getUsersOnProject() {
    this.userservice.getOnProject(this.router.snapshot.paramMap.get("idproject")).subscribe(
      data => {
        this.users = data;
        console.log("users", data);
      }, err => {
        console.log(err);
      }
    )
  }

  getMaterials() {
    //get materials list available
    this.materialservice.getAll().subscribe(
      data => {
        this.materials = data;
      }, err => {
        console.log("err", err);
      }
    )
  }
  ngOnInit() {
    this.materialName = '';

    

    //define the newUserForm
    this.newUserForm = this.fb.group({
      newuser: [''],
    });

    this.projectservice.getProject(this.router.snapshot.paramMap.get("idproject")).subscribe(
      data => {
        this.project = data;
        this.unsetProject = data;
      }, err => {
        console.log(err);
      })




    this.getUsersOnProject();

    let user = this.authentication.getUserDetails();
    if (user != null) {
      this.user = user;

      this.accountservice.getAvailableUsers(this.user.id).subscribe(
        data => {
          this.availableusers = data;
          this.availableusers.forEach(eachUser => {
            //contractors
            if (eachUser.idroles == 1) {
              this.groupedusers.forEach(eachGroup => {
                if (eachGroup.group == "Contractors") { eachGroup.items.push(eachUser) }
              })
            }
            //admins
            if (eachUser.idroles == 2) {
              this.groupedusers.forEach(eachGroup => {
                if (eachGroup.group == "Admins") { eachGroup.items.push(eachUser) }
              })
            }
            //providers
            if (eachUser.idroles == 3) {
              this.groupedusers.forEach(eachGroup => {
                if (eachGroup.group == "Providers") { eachGroup.items.push(eachUser) }
              })
            }
          });

        }, err => {
          console.log("available users err: ", err);
        }
      )

    }
    this.getMaterials();
  }

  updateName(projectId) {
    this.projectservice.updateName(projectId, this.project.name).subscribe(
      data => {
        this.alert.success('Name updated');
        this.unsetProject.name = this.project.name;
      }, err => {
        this.alert.error('Name not updated');
        this.project.name = this.unsetProject.name
      }
    )
  }

  updateDescription(projectId) {
    this.projectservice.updateDescription(projectId, this.project.description).subscribe(
      data => {
        this.alert.success('Description updated');
        this.unsetProject.description = this.project.description;
      }, err => {
        this.alert.error('Description not updated');
        this.project.description = this.unsetProject.description
      }
    )
  }

  updateStatus(projectId) {
    let newStatus = { boolean: false, value: 'f', previous: 'f' };
    if (this.project.status == 't') {
      newStatus.boolean = false;
      newStatus.value = 'f';
      newStatus.previous = 't';
    } else {
      newStatus.boolean = true;
      newStatus.value = 't';
      newStatus.previous = 'f';
    }
    this.projectservice.updateStatus(projectId, newStatus.boolean).subscribe(
      data => {
        this.alert.success('Status updated');
        this.project.status = newStatus.value;
        this.unsetProject.status = newStatus.value;
      }, err => {
        this.alert.error('Status not updated');
        this.project.status = newStatus.previous;
        this.unsetProject.status = newStatus.previous;
      }
    )
  }



  deleteProject(projectId) {
    this.projectservice.delete(projectId).subscribe(
      data => {
        this.alert.success('Project deleted');
        this.rou.navigate(['/home/projects']);
      }, err => {
        this.alert.error('Project not deleted');
      })
  }

  createMaterial() {
    this.materialservice.create(this.materialName).subscribe(
      data => {
        this.alert.success("Material created");
        this.getMaterials();
      }, err => {
        this.alert.error("Material not created")
      }
    )
  }


  deleteMat(id) {
    this.materialservice.delete(id).subscribe(
      data => {
        this.alert.success("Material deleted")
        this.getMaterials();
      }, err => {
        this.alert.error("Material not deleted");
      }
    )
  }
  get f() { return this.newUserForm.controls }
  addUser() {
    console.log("selected user:", this.f.newuser.value);
    this.userservice.allocate(this.f.newuser.value.idaccounts, this.project.idprojects).subscribe(
      data => {
        this.alert.success("User has been added to this project");
        this.getUsersOnProject();
      }, err => {
        this.alert.error("User was not added to the project");
        console.log(err);
      }
    )
    this.newUserForm.reset();

  }
  deleteUser(AllocationId) {
    this.userservice.unAllocate(AllocationId).subscribe(data => {
      this.alert.success("User has been deleted from this project")
      this.getUsersOnProject();
    }, err => {
      this.alert.error("User was not deleted from the project");
      console.log(err);
    })
  }


}
