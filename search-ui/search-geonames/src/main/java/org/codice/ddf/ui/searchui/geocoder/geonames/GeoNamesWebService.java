/**
 * Copyright (c) Codice Foundation
 *
 * This is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser
 * General Public License as published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details. A copy of the GNU Lesser General Public License
 * is distributed along with this program and can be found at
 * <http://www.gnu.org/licenses/lgpl.html>.
 *
 **/
package org.codice.ddf.ui.searchui.geocoder.geonames;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;

import org.codice.ddf.ui.searchui.geocoder.GeoCoder;
import org.codice.ddf.ui.searchui.geocoder.GeoResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import net.minidev.json.JSONArray;
import net.minidev.json.JSONObject;
import net.minidev.json.parser.JSONParser;
import net.minidev.json.parser.ParseException;

public class GeoNamesWebService implements GeoCoder {

    private static final Logger LOGGER = LoggerFactory.getLogger(GeoNamesWebService.class);

    private static final String POPULATED_PLACE = "PPL";

    private static final String ADMINISTRATIVE_LOCATION = "ADM";

    private static final String POLITICAL_ENTITY = "PCL";

    //geonames requires an application username, this is the default name for DDF
    protected String username = "ddf_ui";

    protected String geoNamesApiServer = "api.geonames.org";

    protected String geoNamesProtocol = "http";

    @Override
    public GeoResult getLocation(String location) {
        String urlStr;
        String method = "search";
        String term = "q=";

        try {
            location = URLEncoder.encode(location, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            LOGGER.error("Unable to encode location.", e);
        }
        urlStr = geoNamesProtocol + "://" + geoNamesApiServer + "/" + method + "JSON" + "?" + term
                + location + "&username=" + username;

        URL url = null;
        try {
            url = new URL(urlStr);
        } catch (MalformedURLException e) {
            LOGGER.error("Geonames URL is invalid: {}", urlStr, e);
        }

        GeoResult geoResult = new GeoResult();
        if (url != null) {
            URLConnection urlConnection = null;
            try {
                urlConnection = url.openConnection();
            } catch (IOException e) {
                LOGGER.error("Unable to open connection to Geonames service.", e);
            }

            if (urlConnection != null) {
                try {
                    urlConnection.connect();
                } catch (IOException e) {
                    LOGGER.error("Unable to connect to Geonames service", e);
                }

                JSONParser parser = new JSONParser(JSONParser.MODE_JSON_SIMPLE);

                Object result = null;
                try {
                    result = parser.parse(urlConnection.getInputStream());
                } catch (ParseException e) {
                    LOGGER.error("Error while parsing JSON message from Geonames service.", e);
                } catch (IOException e) {
                    LOGGER.error("Error reading input stream from Geonames service.", e);
                }

                if (result != null) {
                    if (result instanceof JSONObject) {
                        JSONObject jsonResult = (JSONObject) result;
                        JSONArray geonames = (JSONArray) jsonResult.get("geonames");
                        if (geonames != null && geonames.size() > 0) {
                            JSONObject firstResult = (JSONObject) geonames.get(0);
                            if (firstResult != null) {
                                double lat = Double.valueOf((String) firstResult.get("lat"));
                                double lon = Double.valueOf((String) firstResult.get("lng"));

                                Long population = (Long) firstResult.get("population");
                                String adminCode = (String) firstResult.get("fcode");

                                geoResult = GeoResultCreator.createGeoResult(
                                        (String) firstResult.get("name"), lat, lon, adminCode,
                                        population);
                            }
                        }
                    }
                }
            }
        }

        return geoResult;
    }
}
