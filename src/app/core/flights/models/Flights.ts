export class Flights {
  constructor(
    public id?: number,
    public description?: string,
    public date_out?: Date,
    public city_from?: string,
    public city_out?: string,
  ) {}
}
