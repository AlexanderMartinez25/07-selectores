import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { pipe } from 'rxjs';
import { Pais, PaisSmall } from '../../interfaces/pais.interface';
import { PaisesService } from '../../services/paises.service';
import { switchMap, tap } from "rxjs/operators";

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: []
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required]
  })

  //llenar selectores
  regiones: string[] = [];
  paises: PaisSmall[] = [];
  // fronteras: string[] = [];
  fronteras: PaisSmall[] = []

  //UI
  cargando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private ps: PaisesService
  ) { }

  ngOnInit(): void {
    this.regiones = this.ps.regiones;

    // cuando cambie la region
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        // reseteando pais
        tap((_) => {
          this.miFormulario.get('pais')?.reset('')
          this.cargando = true;
        }),
        // hacemos consulta directa
        switchMap(region => this.ps.getPaisesByRegion(region)),
      )
      // obtenemos respuesta de la consulta directa
      .subscribe(paises => {
        this.paises = paises;
        this.cargando = false;

      })

    // cuando cambie el país
    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        // reseteando pais
        tap(() => {
          this.fronteras = [];
          this.miFormulario.get('frontera')?.reset('')
          this.cargando = true;

        }),
        // llamamos el servicio y nos retorna un pais
        switchMap(codigo => this.ps.getPaisByCode(codigo)),
        // con ese pais ejecutamos otro llamado al servicio
        switchMap(pais => this.ps.getPaisesByCodes(pais?.borders!))
      )
      .subscribe(paises => {
        this.fronteras = paises;
        this.cargando = false;
      })
  }

  guardar() {
    console.log(this.miFormulario.value);
  }
}
