/*
   Copyright 2022 Purdue IEEE and Hadi Ahmed

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

import winston from "winston";
import "winston-daily-rotate-file";
const transport = new winston.transports.DailyRotateFile({
    filename: "boilerbooks-%DATE%.log",
    datePattern:"YYYY-MM-DD",
    zippedArchive: true,
    dirname: "/var/log/boilerbooks/",
    maxSize: "20m",
    maxFiles: 10,
});
const format = winston.format.printf((log) => {
    return `${log.timestamp} [${log.level}]: ${log.message}`;
});
const logger = winston.createLogger({
    transports: [
        transport
    ],
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.splat(),
        format
    ),
});
logger.add(new winston.transports.Console({
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.splat(),
        format
    ),
}));

export {
    logger,
};
