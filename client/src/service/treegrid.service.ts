import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TreegridService {

  constructor(private http: HttpClient) {
   }

  public getTreeData() {
    const url = `${environment.API_URL}/treeGridData`;
    return this.http.get(url);
  }
  
  public addRow(obj: any) {
    const url = `${environment.API_URL}/treeGridData/add-row`;
    return this.http.post<any>(url, obj);
  }
  public addChild(obj: any, id:any) {
    const url = `${environment.API_URL}/treeGridData/add-child/${id}`;
    return this.http.post<any>(url, obj);
  }
  public editRow(obj: any, id:any) {
    const url = `${environment.API_URL}/treeGridData/edit-row/${id}`;
    return this.http.post<any>(url, obj);
  }
  public deleteRow(obj: any, id:any) {
    const url = `${environment.API_URL}/treeGridData/delete-row/${id}`;
    return this.http.post<any>(url, obj);
  }
  public updateColumn(obj: any, id:any) {
    const url = `${environment.API_URL}/treeGridData/update-columns`;
    return this.http.post<any>(url, obj);
  }
}
