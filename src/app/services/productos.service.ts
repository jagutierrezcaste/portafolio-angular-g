import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../interfaces/producto.interface';
import { resolve } from 'url';
import { reject } from '../../../node_modules/@types/q';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  cargando = true;
  productos: Producto[] = [];
  productosFiltrado: Producto [] = [];

  constructor( private http: HttpClient) {
    this.cargarProductos();
  }

  private cargarProductos() {

    // tslint:disable-next-line:no-shadowed-variable
    return new Promise( ( resolve, reject ) => {
      this.http.get('https://angular-html-e798e.firebaseio.com/productos_idx.json').subscribe( (resp: Producto[]) => {
        this.productos = resp;
        setTimeout(() => {
          this.cargando = false;
        }, 1000);
        resolve();
      });
    });


  }

  getProducto( id: string) {
    return this.http.get(`https://angular-html-e798e.firebaseio.com/productos/${ id }.json`);

  }

  buscarProducto( termino: string) {

    if ( this.productos.length === 0) {
      /* Cargar productos */
      this.cargarProductos().then( () => {
        /* ejecutar despues de tener productos
        aplicar filtro */
        this.filtrarProductos( termino );
      });
    } else {
      /* aplicar filtro */
      this.filtrarProductos( termino );
    }
  }

  private filtrarProductos( termino: string) {

    console.log(this.productos);
    this.productosFiltrado = [];

    termino = termino.toLocaleLowerCase();

    this.productos.forEach( prod => {

      const tituloLower = prod.titulo.toLocaleLowerCase();

      if ( prod.categoria.indexOf( termino) >= 0 || tituloLower.indexOf(termino) >= 0 ) {
        this.productosFiltrado.push( prod );
      }

    });

  }
}
