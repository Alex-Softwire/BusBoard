import { BusStopInformationService } from "./BusStopInformationService.js";
import { PostCodeService } from "./PostCodeService.js";
import { TFLStopPointService } from "./TFLStopPointService.js";

export class LocationBusInformationService {
    constructor() {
        this.stop_point_service = new TFLStopPointService();
        this.post_code_service = new PostCodeService();
        this.bus_stop_info_service = new BusStopInformationService()
    }

    sort_stops_by_distance(stops) {
        stops.sort((a, b) => a.distance_to - b.distance_to);
    }

    async get_first_n_stops(postcode, n) {
        let coordinate = await this.post_code_service.post_code_to_coordinate(postcode)
        let stops = await this.stop_point_service.get_bus_stops_around_coordinate(coordinate);
        this.sort_stops_by_distance(stops);
        return stops.slice(0, n);
    }

    async get_nearest_two_stops_information(postcode) {
        let first_two_stops = await this.get_first_n_stops(postcode, 2)
        for (let i = 0; i < first_two_stops.length; i++) {
            const stop = first_two_stops[i];
            console.log(`Stop ${i + 1} ${stop.name} (${stop.distance_to.toFixed(1)}m): `);
            await this.bus_stop_info_service.display_stop_information(stop.id)
        }

        // TODO: promise all method - displaying information in parallel
        // Promise.all(stops).then(this.bus_stop_info_service.display_stop_information)

    }
}