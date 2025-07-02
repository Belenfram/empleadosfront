import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from '../../services/empleado.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-listar-empleados',
  imports: [RouterLink],
  templateUrl: './listar-empleados.component.html',
  styleUrl: './listar-empleados.component.css'
})
export class ListarEmpleadosComponent implements OnInit {

  //propiedades
  listaEmpleados:any = [];

  constructor(private empleadoService:EmpleadoService){
    this.getEmpleados();
  }

  ngOnInit(): void {
    
  }

  //método que hace la petición al service para obtener los empleados
  getEmpleados(){
    this.empleadoService.getEmpleados().subscribe((data) => {
      this.listaEmpleados = data;
    })
  }

  //método para eliminar un empleado
  eliminarEmpleado(empleado:any, index:any){
    if (window.confirm('¿Estás seguro de eliminar este empleado?')) {
      this.empleadoService.eliminarEmpleado(empleado._id)
        .subscribe((data) => {
          this.listaEmpleados.splice(index,1);
        })
    }
  }

}
