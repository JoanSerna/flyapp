import { Airplanes } from '../../airplanes/models/Airplanes';
import { Flights } from '../../flights/models/Flights';
import { Passenger } from '../../passenger/models/Passenger';

export class Ticket {
  constructor(
    public id?: number,
    public valorTiquete?: DoubleRange,
    public ivaTiquete?: DoubleRange,
    public descuentoTiquete?: DoubleRange,
    public flights?: Flights,
    public airplanes?: Airplanes,
    public passengers?: Passenger
  ) {}
}
