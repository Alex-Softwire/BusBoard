import { TFLStopPointService } from "./TFLStopPointService.js";
import { Util } from "./Util.js";


export class BusStopInformationService {
    constructor() {
        this.stop_point_service = new TFLStopPointService();
    }

    sort_buses_by_time_to_station(buses) {
        return buses.sort((a, b) => a.eta - b.eta);
    }

    async get_first_n_buses(stop_code, n) {
        let buses = await this.stop_point_service.get_bus_stop_arrivals(stop_code);
        this.sort_buses_by_time_to_station(buses);
        return buses.slice(0, n);
    }

    display_bus_information(bus) {
        console.log(
            `Line: ${bus.line}, ` +
            `Destination: ${bus.destination}, ` +
            `ETA: ${Util.seconds_to_formatted_string(bus.eta)}.`
        );
    }

    async display_stop_information(stop_code) { // TODO: change to be a stop instead of its code
        const first_five_buses = await this.get_first_n_buses(stop_code, 5);

        if (!first_five_buses.length) {
            console.log("No buses.")
        }

        first_five_buses.forEach(this.display_bus_information);
    }
}