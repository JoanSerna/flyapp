import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { PassengerService } from '../services/passenger.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'fly-show-popup-edit',
  templateUrl: './show-popup-edit.component.html',
  styleUrls: ['./show-popup-edit.component.scss'],
})
export class ShowPopupEditComponent implements OnInit {
  passengerUpdateForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ShowPopupEditComponent>,
    private passengerService: PassengerService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.initPassengerUpdateForm();
    this.passengerUpdateForm.get('id').setValue(this.data);
  }

  public updatePassenger(passengerUpdateForm: FormGroup) {
    if (passengerUpdateForm.valid) {
      this.passengerService.updatePassenger(passengerUpdateForm.value).subscribe((resp) => {
        if (resp.status === 200) {
          this.toastr.success('Pasajero Actulizado Correctamente', '¡Correcto!');
          this.dialogRef.close(true);
        } else {
          this.toastr.error('Ocurrio un error actualizando el pasajero', '¡Oops...!');
        }
      });
    } else {
      this.toastr.info('Completa el formulario', '¡Oops..!');
    }
  }

  private initPassengerUpdateForm() {
    this.passengerUpdateForm = new FormGroup({
      id: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.email]),
      name: new FormControl('', Validators.required),
    });
  }
}
