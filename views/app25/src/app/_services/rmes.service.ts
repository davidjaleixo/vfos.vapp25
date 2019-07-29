import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RmesService {
    constructor(private http: HttpClient) { }
    
    getByPar(parId: String) {
        return this.http.get(environment.apiUrl + '/rmes?par=' + parId);
    }
    create(status: Number, description: String){
        return this.http.post(environment.apiUrl + '/rmes', {status: status, statusdescription: description});
    }
    getNewly(){
        return this.http.get(environment.apiUrl + '/rmes?newly=true');
    }
    updateStatus(rmeId: String, newStatus: Number) {
        return this.http.patch(environment.apiUrl + '/rmes?id=' + rmeId, { status: newStatus })
    }
}