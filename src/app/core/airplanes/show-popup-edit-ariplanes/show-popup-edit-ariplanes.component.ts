import { AirplanesService } from '../services/airplanes.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'fly-show-popup-edit-ariplanes',
  templateUrl: './show-popup-edit-ariplanes.component.html',
  styleUrls: ['./show-popup-edit-ariplanes.component.scss'],
})
export class ShowPopupEditAriplanesComponent implements OnInit {
  airplaneUpdateForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ShowPopupEditAriplanesComponent>,
    private airplanesService: AirplanesService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.initAirplaneUpdateForm();
    this.airplaneUpdateForm.get('id').setValue(this.data);
  }

  private initAirplaneUpdateForm() {
    this.airplaneUpdateForm = new FormGroup({
      id: new FormControl('', Validators.required),
      airline: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      amount: new FormControl('', Validators.required),
    });
  }

  public updateAirplane(airplaneUpdateForm: FormGroup) {
    if (airplaneUpdateForm.valid) {
      this.airplanesService.updateFlight(airplaneUpdateForm.value).subscribe((resp) => {
        if (resp.status === 200) {
          this.airplaneUpdateForm.reset();
          this.toastr.success('Avion actualizado', '¡Correcto!');
          this.dialogRef.close(true);
        } else {
          this.toastr.error('Ocurrio un error actualizando el avion', '¡Ooops...!');
        }
      });
    } else {
      this.toastr.info('Completa el formulario', '¡Ooops...!');
    }
  }
}
