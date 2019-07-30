import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatPaginator } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Passenger } from './models/Passenger';
import { PassengerService } from './services/passenger.service';
import { ShowPopupEditComponent } from './show-popup-edit/show-popup-edit.component';

@Component({
  selector: 'fly-passenger',
  templateUrl: './passenger.component.html',
  styleUrls: ['./passenger.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PassengerComponent implements OnInit {
  isLinear = false;
  displayedColumns: string[] = ['email', 'name', 'edit'];
  passengerForm: FormGroup;
  passenger$: Observable<Passenger[]>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private passengerService: PassengerService,
    private toastr: ToastrService,
    private changeDetectorRefs: ChangeDetectorRef,
    private matDialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.initPassengerForm();
    this.passenger$ = this.passengerService.getAllPassengers();
  }

  private initPassengerForm() {
    this.passengerForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      name: new FormControl('', Validators.required)
    });
  }

  public registerPassenger(passengerForm: FormGroup) {
    if ( passengerForm.valid ) {
      this.passengerService.createPassenger(passengerForm.value).subscribe(resp => {
        if ( resp.status === 200 ) {
          this.toastr.success('Pasajero creado correctamente!', '¡Correcto!');
          this.refresh();
          this.passengerForm.reset();
        } else {
          this.toastr.error('Ocurrio un error creando el pasajero', 'Ooops!!');
        }
      });
    } else {
      this.toastr.info('Completa el formulario', 'Ooops!!');
    }
  }

  private refresh() {
    this.passenger$ = this.passengerService.getAllPassengers();
    this.changeDetectorRefs.detectChanges();
  }

  public showEditPassenger(id: number) {
    const dialogRef = this.matDialog.open(ShowPopupEditComponent, {
      width: '400px',
      data: id
    });

    dialogRef.afterClosed().subscribe(resp => {
      if ( resp ) {
        this.refresh();
      }
    });

  }
}

