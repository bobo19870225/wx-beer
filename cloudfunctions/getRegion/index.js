"use strict";
const geoip = require("geoip-lite");
exports.main = async (event, context) => {

  const { sourceIp } = event;
  const geo = geoip.lookup(sourceIp);
  console.log("---getRegion--- sourceIp:", sourceIp, "geo:", geo);
  return geo;
};
