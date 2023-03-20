import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from "./user.service";
import { environment } from "../../environments/environment";
import {lastValueFrom, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private apiPath: string = environment.apiUrl;

  constructor(private http: HttpClient, private userService: UserService) { }

  get(destination: string) {
    const request = this.http.get<any>(this.apiPath + destination, this.getRequestOptions());

    this.authorisedFilter(request);

    return request;
  }

  post(destination: string, body: any) {
    body = JSON.stringify(body);
    const request = this.http.post<any>(this.apiPath + destination, body, this.getRequestOptions())

    this.authorisedFilter(request);

    return request;
  }

  delete(destination: string) {
    const request = this.http.delete(this.apiPath + destination, this.getRequestOptions())

    this.authorisedFilter(request);

    return request;
  }

  put(destination: string, body: any) {
    body = JSON.stringify(body);
    const request = this.http.put<any>(this.apiPath + destination, body, this.getRequestOptions())

    this.authorisedFilter(request);

    return request;
  }

  authorisedFilter(request: Observable<any>) {
    request.subscribe({
      error: (error) => {
        if (error.status == 403) {
          this.userService.onUnauthorised();
        }
      }
    })
  }

  private getRequestOptions() {

    let headers = new HttpHeaders({'Content-Type': 'application/json'});

    if (this.userService.getJwtToken() != undefined) {
      headers = headers.append('Authorization', "Bearer " + this.userService.getJwtToken().replace("\"", ""))
    }

    let requestOptions: Object = {
      observe: 'response',
      responseType: 'json',
      headers: headers
    };
    return requestOptions;
  }
}
