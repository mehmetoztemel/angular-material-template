import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IResult } from "../models/result";

export abstract class BaseRestService<T> {
  constructor(protected http: HttpClient, protected apiUrl: string) { }

  public get(): Observable<IResult> {
    return this.http.get<IResult>(this.apiUrl);
  }
  public getById(id: string | number): Observable<IResult> {
    return this.http.get<IResult>(this.apiUrl + id);
  }
  public save(item: T): Observable<IResult> {
    return this.http.post<IResult>(this.apiUrl, item);
  }
  public update(itemToUpdate: any): Observable<IResult> {
    return this.http.put<IResult>(this.apiUrl, itemToUpdate);
  }
  public delete(item: string | number): Observable<IResult> {
    return this.http.delete<IResult>(this.apiUrl + item);
  }
}