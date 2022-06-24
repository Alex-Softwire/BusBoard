import { PostCodeService } from "./PostCodeService.js";
import { TFLStopPointService } from "./TFLStopPointService.js";

import {BusStopInformationService} from "./BusStopInformationService.js";
import log4js from "log4js";

const logger = log4js.getLogger('LocationBusInformationService.js');

export class LocationBusInformationService {
    constructor() {
        this.stop_point_service = new TFLStopPointService();
        this.post_code_service = new PostCodeService();
        this.bus_stop_information_service = new BusStopInformationService();
    }

    sort_stops_by_distance(stops) {
        stops.sort((a, b) => a.distance_to - b.distance_to);
    }

    async get_first_n_stops(postcode, n) {
        logger.debug(`Getting first ${n} stop(s) for postcode: ${postcode}`);
        let coordinate = await this.post_code_service.post_code_to_coordinate(postcode);
        let stops = await this.stop_point_service.get_bus_stops_around_coordinate(coordinate);
        this.sort_stops_by_distance(stops);
        logger.debug(`Stop(s) (for postcode ${postcode}) sorted by distance are: ${stops}`);
        return stops.slice(0, n);
    }

    async get_nearest_two_stops_information(postcode) {
        const stops = await this.get_first_n_stops(postcode, 2)
        logger.debug(`Two nearest stops are: ${stops.map((stop) => stop.name)}.`);

        const stops_detailed = [];
        for (const stop of stops) {
            const info = await this.bus_stop_information_service.get_stop_information(stop);
            stops_detailed.push(info);
        }

        logger.debug(`First detailed stop is: ${stops_detailed}`);
        logger.debug(`Two nearest stops after getting detailed information are: ${stops_detailed.map((it) => it)}`);

        return stops_detailed;
    }
}