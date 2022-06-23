import { question } from "readline-sync";
import { LocationBusInformationService } from "./services/LocationBusInformationService.js";

const location_bus_information_service = new LocationBusInformationService();

const post_code = question("Enter a post code: ")
location_bus_information_service.get_nearest_two_stops_information(post_code);

// NW5 1TL
// SW1A 1AA
// HA9 0WS