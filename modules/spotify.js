"use strict";

// Libraries
const { post, get } = require("request").defaults({ strictSSL: false, json: true, headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.164 Safari/537.36" } });
const { writeFileSync } = require("fs");

function createPlaylist(name, callback) {
    let config = require("../data/spotify.json");

    post({ url: "https://spclient.wg.spotify.com/playlist/v2/playlist", headers: { "Authorization": config.bearer }, body: { "ops": [{ "kind": 6, "updateListAttributes": { "newAttributes": { "values": { "name": name } } } }] } }, function(error, response, playlistBody) {
        if (error)
            return callback(false);

        if (response.statusCode == 200) {
            post({ url: `https://spclient.wg.spotify.com/playlist/v2/user/${config.username}/rootlist/changes`, headers: { "Authorization": config.bearer }, body: { "deltas": [{ "ops": [{ "kind": "ADD", "add": { "fromIndex": 0, "items": [{ "uri": playlistBody.uri, "attributes": { "addedBy": "", "timestamp": Date.now(), "seenAt": "0", "public": false, "formatAttributes": [] } }], "addLast": false, "addFirst": true } }], "info": { "user": "", "timestamp": "0", "admin": false, "undo": false, "redo": false, "merge": false, "compressed": false, "migration": false, "splitId": 0, "source": { "client": "WEBPLAYER", "app": "", "source": "", "version": "" } } }], "wantResultingRevisions": false, "wantSyncResult": false, "nonces": [] } }, function(error, response, body) {
                if (error)
                    return callback(false);

                if (response.statusCode == 200)
                    callback(playlistBody.uri.split(":")[2]);
                else
                    callback(false);
            });
        } else
            callback(false);
    });
}

function playlistMetadata(playlistId, callback) {
    let config = require("../data/spotify.json");

    get({ url: `https://spclient.wg.spotify.com/playlist/v2/playlist/${playlistId}/metadata`, headers: { "Authorization": config.bearer } }, function(error, response, body) {
        if (error)
            return callback(false)

        if (response.statusCode == 200)
            callback({ name: body.attributes.name, count: body.length });
        else
            callback(false);
    });
}

function getSongs(playlistId, offset, callback) {
    let config = require("../data/spotify.json");

    get({ url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks?offset=${offset}&100&additional_types=track%2Cepisode&market=from_token`, headers: { "Authorization": config.bearer } }, function(error, response, body) {
        if (error)
            return callback(false);

        if (response.statusCode == 200) {
            var songIds = [];

            for (var i = 0; i <= body.items.length - 1; i++) {
                if (body && body.items[i] && body.items[i].track && body.items[i].track.uri)
                    songIds.push(body.items[i].track.uri)
            }

            callback(songIds);
        } else
            callback(false);
    });
}

function addSongToPlaylist(playlistId, songs, callback) {
    let config = require("../data/spotify.json");

    if (songs.length <= 0)
        return;

    post({ url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`, headers: { "Authorization": config.bearer }, body: { "uris": songs, "position": null } }, function(error, response, body) {
        if (error)
            return callback(false);

        if (response.statusCode == 201)
            callback(true);
        else
            callback(false);
    });
}

module.exports.refreshToken = function(callback) {
    let config = require("../data/spotify.json");

    get({ url: "https://open.spotify.com/", headers: { "Cookie": "sp_dc=" + config.sp_dc } }, function(error, response, body) {
        if (error)
            return callback(false);

        if (response.statusCode == 200) {
            if (body.includes("accessToken")) {
                var bearerToken = "Bearer " + body.match(/"accessToken":"(.*)","acc/gm)[0].slice(15).replace("\",\"acc", "");

                get({ url: "https://api.spotify.com/v1/me", headers: { "Authorization": bearerToken } }, function(error, response, body) {
                    if (error)
                        return callback(false);

                    if (response.statusCode == 200) {
                        writeFileSync(`${__dirname}/../data/spotify.json`, JSON.stringify({ "sp_dc": config.sp_dc, "bearer": bearerToken, "username": body.id }, null, "\t"));

                        callback(true);
                    } else
                        callback(false);
                });
            } else
                callback(false);
        } else
            callback(false);
    });
}

module.exports.clonePlaylist = function(wantedPlaylist, callback) {
    let config = require("../data/spotify.json");

    playlistMetadata(wantedPlaylist, function(playlist) {
        if (!playlist)
            return callback(false);

        createPlaylist(playlist.name, function(toPlaylist) {
            if (!toPlaylist)
                return callback(false);

            for (var i = 0; i <= playlist.count / 100; i++) {
                setTimeout(function(i, wantedPlaylist, toPlaylist) {
                    getSongs(wantedPlaylist, parseInt(`${i + 1}00`), function(songIds) {
                        if (!songIds)
                            return callback(false);

                        addSongToPlaylist(toPlaylist, songIds, function(successful) {
                            if (!successful)
                                return callback(false);
                        });

                        callback(true);
                    });
                }, 1000 * i, i, wantedPlaylist, toPlaylist);
            }
        });
    });
}

module.exports.getPlaylists = function(callback) {
    let config = require("../data/spotify.json");

    this.get(`https://spclient.wg.spotify.com/user-profile-view/v3/profile/${config.username}/playlists?offset=0&limit=200&market=from_token`, function(body) {
        if (!body)
            return callback(false);

        callback(body.public_playlists);
    });
}

module.exports.get = function(endpoint, callback) {
    let config = require("../data/spotify.json");

    get({ url: endpoint, headers: { "Authorization": config.bearer } }, function(error, response, body) {
        if (error)
            return callback(false);

        if (response.statusCode == 200)
            callback(body);
        else
            callback(false);
    });
}

module.exports.addSongToPlaylist = addSongToPlaylist;