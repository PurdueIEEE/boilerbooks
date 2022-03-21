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

// variables, functions, enums, etc. that are used elsewhere in the code

// ---------------- un/escape functions ---------------
// Escaping is not necessary with our usage of Prepared Statements
// These are left here if needed but they are not exported or used
// -> Only concern is if the API user does not sanitize the
// ->   possibly valid HTML in the responses.
// ->   Vue does this an thereforore our front-end is safe.

// (NOT USED)
function clean_input_all(string) {
    // ' " \ / < > ` &
    string = string.replaceAll(/['"\\/<>&`]/ig, "");
    string = string.trim();
    return string;
}

// (NOT USED)
function clean_input_keepslash(string) {
    // ' " \ < > ` &
    string = string.replaceAll(/['"\\<>&`]/ig, "");
    string = string.trim();
    return string;
}

// (NOT USED)
function clean_input_encodeurl(string) {
    //string = string.replaceAll(/[']/ig, '%27');
    string = encodeURIComponent(string);
    return string;
}

// (NOT USED)
function unescape_object(obj) {
    for (let key in obj) {
        // javascript is a perfect language with no flaws
        if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key] && typeof(obj[key]) === "string") {
            //obj[key] = obj[key].replaceAll(/[%27]/ig, "'");
            obj[key] = decodeURIComponent(obj[key]);
        }
    }

    return obj;
}
// -------------------------------------------------

// -------------- fiscal year globals -------------

/** CHANGE BELOW ANNUALLY **/
const current_fiscal_year = "2017-2018";
/** CHANGE ABOVE ANNUALLY **/

const first_fiscal_year = "2015-2016";
const yearStart = parseInt(first_fiscal_year.substring(0,4));
const yearEnd = parseInt(current_fiscal_year.substring(0,4));
const fiscal_year_list = [];
for (let year = yearEnd; year >= yearStart; year--) {
    fiscal_year_list.push(`${year}-${year+1}`);
}
// -------------------------------------------------

// ------------ financial committee lut ------------
// this is the best solution I can come up with
//  with out a database schema migration. Here is the problem:
//  the committee column in the database is an enum with some values,
//  but the name of the committee does not match the enum value.
//  Further, the name of the committee is not a http safe thing to put in a URL.
//  Therefore, this is a lookup table of sorts to cross reference these
//  three different names for THE SAME COMMITEE
// format = { http-name: [ db enum, committee name ] }
const committee_lut =
{
    "general":["General IEEE", "General IEEE"],
    "aerial":["Aerial Robotics", "Aerial Robotics"],
    "csociety":["Computer Society", "Computer Society"],
    "embs":["EMBS", "EMBS"],
    "mtt-s":["MTT-S", "MTT-S"],
    "racing":["Racing", "Racing"],
    "rov":["ROV", "ROV"],
    "soga":["SOGA", "SOGA"],
};
// mini-LUT for db enum : committee name
const committee_name_swap =
{
    "General IEEE":"General IEEE",
    "Aerial Robotics":"Aerial Robotics",
    "Computer Society":"Computer Society",
    "EMBS":"EMBS",
    "MTT-S":"MTT-S",
    "Racing":"Racing",
    "ROV":"ROV",
    "SOGA":"SOGA",
};
// -------------------------------------------------

// ------------- dues committee lut ----------------
// List of all committees a member can be part of
const dues_committees =
[
    "Aerial Robotics",
    "Computer Society",
    "EMBS",
    "Growth & Engagement",
    "MTT-S",
    "Industrial Relations",
    "Learning",
    "Racing",
    "ROV",
    "Social",
    "Software Saturdays"
];
// -------------------------------------------------

// ----------------- dues amount -------------------
// Current annual local dues

/** CHANGE BELOW ANNUALLY **/
const dues_amount = 15.0;
/** CHANGE ABOVE ANNUALLY **/

// -------------------------------------------------

// --------------- access level enum ---------------
// *sigh* enums don't exist in js so this is the best approximation
// Going by 2 so that values can be added in between without needing to change the database.
const ACCESS_LEVEL = Object.freeze({
    "member":0,
    "internal_leader":2,
    "officer":4,
    "treasurer":6,
});
// -------------------------------------------------

// ------------------ SMTP mailer ------------------
import nodemailer from "nodemailer";
const mailer = nodemailer.createTransport({
    sendmail: true,
    newline: "unix",
    path: "/usr/sbin/sendmail",
},{
    from: "boilerbooks@purdueieee.org",
});
// -------------------------------------------------

// ----------------- Logging -----------------------
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
// -------------------------------------------------

export {
    current_fiscal_year,
    first_fiscal_year,
    fiscal_year_list,
    committee_lut,
    committee_name_swap,
    dues_committees,
    dues_amount,
    ACCESS_LEVEL,
    mailer,
    logger,
};
