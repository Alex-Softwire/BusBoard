import { TFLStopPointService } from "./TFLStopPointService.js";
import {BusStopModel} from "../models/BusStopModel.js";
import log4js from "log4js";

const logger = log4js.getLogger('BusStopInformationService.js');

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

        logger.debug(`Next bus arrivals at stop code "${stop_code}" are: ${buses}`);

        return buses.slice(0, n);
    }

    async get_stop_information(stop) {
        const first_five_buses = await this.get_first_n_buses(stop.id, 5);
        logger.debug(`First five buses (for stop ${stop.name}) are: ${first_five_buses}`);

        return new BusStopModel(
            stop,
            first_five_buses
        );
    }
}