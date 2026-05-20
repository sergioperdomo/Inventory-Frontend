import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { StockMovement, StockMovementRequest } from '../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockMovementService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/stock-movements';

  getAll(): Observable<StockMovement[]> {
    return this.http.get<StockMovement[]>(this.apiUrl);
  }

  getByProduct(productId: number): Observable<StockMovement[]> {
    return this.http.get<StockMovement[]>(`${this.apiUrl}/by-product/${productId}`);
  }

  register(request: StockMovementRequest): Observable<StockMovement> {
    return this.http.post<StockMovement>(this.apiUrl, request);
  }
}
