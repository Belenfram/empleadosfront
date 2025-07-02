import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmpleadoService } from '../../services/empleado.service';
import { Empleado } from '../../models/empleado';

@Component({
  selector: 'app-editar-empleado',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './editar-empleado.component.html',
  styleUrl: './editar-empleado.component.css'
})
export class EditarEmpleadoComponent implements OnInit {

  //propiedades
  empleadoForm: FormGroup = new FormGroup({});
  enviado: boolean = false;
  empleadoDepartamentos: any = [
    //Sugerencia ponerlo en orden alfabetico
    'Administración',
    'Contabilidad',
    'Recursos Humanos',
    'TI',
    'Ventas'
  ];

  constructor(
    public formBuilder : FormBuilder,
    private router: Router,
    private empleadoService: EmpleadoService,
    private actRoute: ActivatedRoute,
  ){
    //this.mainForm();
  }

  ngOnInit(): void {
    this.mainForm();
    let id = this.actRoute.snapshot.paramMap.get('id');
    this.getEmpleado(id);
  }

  //método para generar el formulario
  mainForm(){
    this.empleadoForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      departamento: ['', [Validators.required]],
      email: ['',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$')
        ]
      ],
      telefono: ['',
        [
          Validators.required,
          Validators.pattern('^[0-9]+$'),
        ]
      ]
    });
  }

  //método que asigna el depto seleccionado al formulario
  actualizarDepartamento(evento:Event) : void {
    const seleccionarElemento = event?.target as HTMLSelectElement;
    const departamentoSeleccionado = seleccionarElemento.value;
    this.empleadoForm.get('departamento')?.setValue(departamentoSeleccionado);
  }

  //getter para acceder a los controles del formulario
  get myForm(){
    return this.empleadoForm.controls;
  }

  //método para buscar al empleado que se va a modificar
  getEmpleado(id:any){
    this.empleadoService.getEmpleado(id)
      .subscribe((data) => {
        this.empleadoForm.setValue({
          nombre: data['nombre'],
          departamento: data['departamento'],
          email: data['email'],
          telefono: data['telefono'],
        });
      })
  }

  //método que se ejecuta cuando se hace el submit
  onSubmit(){
    this.enviado = true;
    if (!this.empleadoForm.valid) {
      return false;
    } else {
      if (window.confirm('¿Estás seguro que lo deseas modificar?')) {
        let id = this.actRoute.snapshot.paramMap.get('id');
        this.empleadoService.actualizarEmpleado(id, this.empleadoForm.value).subscribe({
          complete: () => {
            console.log('Se actualizó correctamente el empleado');
            this.router.navigateByUrl('/listar-empleados');
          },
          error: (e) => {
            console.log(e);
          }
        })
      }
      return;
    }
  }
}
