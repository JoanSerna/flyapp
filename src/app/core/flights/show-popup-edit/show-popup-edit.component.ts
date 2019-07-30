import * as moment from 'moment';
import { Component, Inject, OnInit } from '@angular/core';
import { FlightsService } from '../services/flights.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'fly-show-popup-edit',
  templateUrl: './show-popup-edit.component.html',
  styleUrls: ['./show-popup-edit.component.scss'],
})
export class ShowPopupEditComponent implements OnInit {
  flightUpdateForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ShowPopupEditComponent>,
    private flightsService: FlightsService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.initFlightUpdateForm();
    this.flightUpdateForm.get('id').setValue(this.data);
  }

  private initFlightUpdateForm() {
    this.flightUpdateForm = new FormGroup({
      id: new FormControl('', Validators.required),
      date_out: new FormControl('', Validators.required),
      city_from: new FormControl('', Validators.required),
      city_out: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
    });
  }

  public updateFlight(flightUpdateForm: FormGroup) {
    if (flightUpdateForm.valid) {
      this.flightsService.updateFlight(flightUpdateForm.value).subscribe((resp) => {
        if (resp.status === 200) {
          this.flightUpdateForm.reset();
          this.dialogRef.close(true);
          this.toastr.success('Vuelo actualizado', '¡Correcto!');
        } else {
          this.toastr.error('No se pudo actualizar el vuelo', '¡Oops...!');
        }
      });
    } else {
      this.toastr.info('Completa el formulario', '¡Oops...!');
    }
  }

  public assignDateToControl() {
    const dateFormatted = moment(this.flightUpdateForm.get('date_out').value).format('YYYY-MM-DD');
    this.flightUpdateForm.get('date_out').setValue(dateFormatted);
  }
}
