import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ParsService {
    constructor(private http: HttpClient) { }
    create(projectId: String, status: Number, statusdescription: String) {
        return this.http.post(environment.apiUrl + '/pars', { project: projectId, status: status, statusdescription: statusdescription })
    }
    getByProject(projectId: String) {
        return this.http.get(environment.apiUrl + '/pars?project=' + projectId);
    }
    getNewly(projectId: String){
        return this.http.get(environment.apiUrl + '/pars?project=' + projectId + '&newly=true');
    }
    updateStatus(parId: String, newStatus: Number) {
        return this.http.patch(environment.apiUrl + '/pars?id=' + parId, { status: newStatus })
    }
    updateStatusDescription(parId: String, newDescription: String){
        return this.http.patch(environment.apiUrl + '/pars?id=' + parId, { statusdescription: newDescription })
    }
    delete(parId: String) {
        return this.http.delete(environment.apiUrl + '/pars?id=' + parId)
    }
}