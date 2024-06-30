import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from '../../services/empleado.service';
import { NgForm } from '@angular/forms';
import { Empleado } from '../../models/empleado';

declare var M: any;

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css'],
  providers: [EmpleadoService]
})
export class EmpleadosComponent implements OnInit {
  public page!: number;

  constructor(public empleadoService: EmpleadoService) {}

  ngOnInit(): void {
    this.obtenerEmpleados();
  }
//metodo para obtener empleados
  obtenerEmpleados() {
    this.empleadoService.getEmpleados().subscribe(
      (res: any) => {
        this.empleadoService.empleados = res as Empleado[];
      },
      (err) => console.error(err)
    );
  }
//metodo para guardar o editar un empleado
  guardarEmpleado(form?: NgForm) {
    if (this.empleadoService.selectedEmpleado._id) {
      // Si existe _id, entonces es una edición
      this.empleadoService.putEmpleado(this.empleadoService.selectedEmpleado)
        .subscribe(
          res => {
            this.resetForm(form);

              M.toast({ html: 'Empleado Actualizado satisfactoriamente' });
              this.obtenerEmpleados(); // Actualiza la lista de empleados

          },
          error => {console.error(error)
          }
        );
    } else {
      // Si no existe _id, entonces es un nuevo empleado
      this.empleadoService.postEmpleado(form?.value)
        .subscribe(
          res => {
            this.resetForm(form);
            M.toast({ html: 'Agregado satisfactoriamente' });
            this.obtenerEmpleados(); // Actualiza la lista de empleados
          },
          error => {console.error(error)
          }
        );
    }
  }

  editarEmpleado(empleado: Empleado) {
    this.empleadoService.selectedEmpleado = empleado; // Asigna directamente el objeto original
  }

  eliminarEmpleado(_id: string) {
    if (confirm('¿Estás seguro de eliminar este empleado?')) {
      this.empleadoService.deleteEmpleado(_id).subscribe(
        res => {
          this.obtenerEmpleados();
          M.toast({ html: 'Eliminado satisfactoriamente' });
        },
        error => console.error(error)
      );
    }
  }

  resetForm(form?: NgForm) {
    if (form) {
      form.reset();
      this.empleadoService.selectedEmpleado = new Empleado();
    }
  }
}
