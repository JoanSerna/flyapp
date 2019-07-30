import { Airplanes } from '../../airplanes/models/Airplanes';
import { AirplanesService } from '../../airplanes/services/airplanes.service';
import {
  auditTime,
  distinctUntilChanged,
  map,
  switchMap
  } from 'rxjs/operators';
import { Component, Inject, OnInit } from '@angular/core';
import { Flights } from '../../flights/models/Flights';
import { FlightsService } from '../../flights/services/flights.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { Passenger } from '../../passenger/models/Passenger';
import { PassengerService } from '../../passenger/services/passenger.service';
import { TicketsService } from '../services/tickets.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'fly-show-popup-edit-tickets',
  templateUrl: './show-popup-edit-tickets.component.html',
  styleUrls: ['./show-popup-edit-tickets.component.scss'],
})
export class ShowPopupEditTicketsComponent implements OnInit {
  ticketUpdateForm: FormGroup;
  passengers$: Observable<Passenger[]>;
  filteredPassengers$: Observable<Passenger[]>;
  airplanes$: Observable<Airplanes[]>;
  filteredAirplanes$: Observable<Airplanes[]>;
  flights$: Observable<Flights[]>;
  filteredFlights$: Observable<Flights[]>;
  private iva = 0.19;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private passengerService: PassengerService,
    private airplanesService: AirplanesService,
    private flightsServices: FlightsService,
    private ticketsService: TicketsService,
    private toastrService: ToastrService,
    private matDialog: MatDialog,
    private dialogRef: MatDialogRef<ShowPopupEditTicketsComponent>,
  ) {}

  ngOnInit() {
    this.initTicketUpdateFom();
    this.getAllPassengers();
    this.getAllAirplanes();
    this.getAllFlights();
    this.ticketUpdateForm.get('id').setValue(this.data);
  }

  private initTicketUpdateFom() {
    this.ticketUpdateForm = new FormGroup({
      id: new FormControl('', Validators.required),
      value: new FormControl('', Validators.required),
      ivaTiquete: new FormControl('', Validators.required),
      discount: new FormControl('', Validators.required),
      passenger: new FormControl('', Validators.required),
      passengers: new FormControl('', Validators.required),
      airplanes: new FormControl('', Validators.required),
      airplane: new FormControl('', Validators.required),
      flights: new FormControl('', Validators.required),
      flight: new FormControl('', Validators.required),
    });
  }

  private getAllPassengers() {
    this.passengers$ = this.passengerService.getAllPassengers();
    this.filteredPassengers$ = this.ticketUpdateForm.get('passenger').valueChanges.pipe(
      distinctUntilChanged(),
      auditTime(1000),
      switchMap((value) => this.filterPassengers(value)),
    );
  }

  private getAllAirplanes() {
    this.airplanes$ = this.airplanesService.getAllAirplanes();
    this.filteredAirplanes$ = this.ticketUpdateForm.get('airplane').valueChanges.pipe(
      distinctUntilChanged(),
      auditTime(1000),
      switchMap((value) => this.filterAirplanes(value)),
    );
  }

  private getAllFlights() {
    this.flights$ = this.flightsServices.getAllFlights();
    this.filteredFlights$ = this.ticketUpdateForm.get('flight').valueChanges.pipe(
      distinctUntilChanged(),
      auditTime(1000),
      switchMap((value) => this.filterFlights(value)),
    );
  }

  private filterPassengers(value: string): Observable<Passenger[]> {
    if (value) {
      const filterValue = value.toLowerCase();
      return this.passengers$.pipe(
        map((resp) => resp.filter((passenger) => passenger.name.toLowerCase().indexOf(filterValue) === 0)),
      );
    } else {
      return this.passengers$;
    }
  }

  private filterAirplanes(value: string): Observable<Airplanes[]> {
    if (value) {
      const filterValue = value.toLowerCase();
      return this.airplanes$.pipe(
        map((resp) =>
          resp.filter(
            (airplane) =>
              airplane.airline.toLowerCase().indexOf(filterValue) === 0 ||
              airplane.description.toLowerCase().indexOf(filterValue) === 0,
          ),
        ),
      );
    } else {
      return this.airplanes$;
    }
  }

  private filterFlights(value: string): Observable<Flights[]> {
    if (value) {
      const filterValue = value.toLowerCase();
      return this.flights$.pipe(
        map((resp) =>
          resp.filter(
            (flight) =>
              flight.description.toLowerCase().indexOf(filterValue) === 0 ||
              flight.city_out.toLowerCase().indexOf(filterValue) === 0 ||
              flight.city_from.toLowerCase().indexOf(filterValue) === 0,
          ),
        ),
      );
    } else {
      return this.flights$;
    }
  }

  public setPassengerToControl(passenger: Passenger) {
    this.ticketUpdateForm.get('passengers').setValue(passenger);
  }

  public setFlightsToControl(flight: Flights) {
    this.ticketUpdateForm.get('flights').setValue(flight);
  }

  public setAirplanesToControl(airplane: Airplanes) {
    this.ticketUpdateForm.get('airplanes').setValue(airplane);
  }

  public updateTicket(ticketUpdateForm: FormGroup) {
    if (ticketUpdateForm.valid) {
      this.ticketsService.updateTicket(ticketUpdateForm.value).subscribe((resp) => {
        if (resp.status === 200) {
          this.ticketUpdateForm.reset();
          this.toastrService.success('Se actualizó', '¡Correcto!');
          this.dialogRef.close(true);
        } else {
          this.toastrService.error('Ocurrió un error', '¡Oops...!');
        }
      });
    } else {
      this.toastrService.info('Complete el formulario', '¡Oops...!');
    }
  }

  public calculateIva($event: any) {
    const iva = $event.target.value * this.iva;
    this.ticketUpdateForm.get('ivaTiquete').setValue(iva);
  }
}
