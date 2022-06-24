import express from "express";
import log4js from "log4js";

log4js.configure({
    appenders: {
        file: { type: 'fileSync', filename: 'logs/debug.log' }
    },
    categories: {
        default: { appenders: ['file'], level: 'debug'}
    }
});

import { LocationBusInformationService } from "./services/LocationBusInformationService.js";

const logger = log4js.getLogger('index.js');

const app = express()
const port = 3000

const location_bus_information_service = new LocationBusInformationService();

app.use(express.static('frontend'));
app.use('/history', express.static('frontend/history.html'))
app.get('/departureBoards/:post_code', async (request, response) => {
    const post_code = request.params.post_code;
    logger.info(`Requesting stops for postcode: ${post_code}.`);

    try {
        const info = await location_bus_information_service
                            .get_nearest_two_stops_information(post_code);

        logger.debug(`Stop information (for postcode: ${post_code}) is: ${info}`);
        response.status(200).send(info);
    } catch (e) {
        logger.error(`Error while getting stop information: ${e}`);

        if (e.response) {
            response.status(e.response.status).send();
        } else {
            response.status(500).send();
        }
    }
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})

// NW5 1TL
// SW1A 1AA
// HA9 0WS