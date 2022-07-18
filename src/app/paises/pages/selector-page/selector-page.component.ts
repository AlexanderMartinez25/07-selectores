import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { pipe } from 'rxjs';
import { PaisSmall } from '../../interfaces/pais.interface';
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
    pais: ['', Validators.required]
  })

  //lenar selectores
  regiones: string[] = [];
  paises: PaisSmall[] = [];

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
        }),
        // hacemos consulta directa
        switchMap(region => this.ps.getPaisesByRegion(region))
      )
      // obtenemos respuesta de la consulta directa
      .subscribe(paises => {
        this.paises = paises;
      })
  }

  guardar() {
    console.log(this.miFormulario.value);
  }
}
