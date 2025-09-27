"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
var mongoose_1 = require("mongoose");
var playerSchema = new mongoose_1.default.Schema({
    meta: {
        type: {
            fullName: { type: String, required: true },
            currentCountry: { type: String },
            born: { type: Date, required: true },
            currentAge: { type: String }, // Store as string for "30 years 240 days"
            bats: { type: String },
            bowls: { type: String },
            Teams: { type: [String] },
            matches: {
                tests: Number,
                odi: Number,
                t20: Number,
                over: Number,
                ipl: Number,
            },
        },
    },
    matchesInfo: {
        type: [{
                matches: Number,
                matchesYear: { type: String }, // e.g. "2024-"
                batting: {
                    innings: Number,
                    notOuts: Number,
                    aggregate: Number,
                    highestScore: Number,
                    average: Number,
                    median: Number,
                    thirties: Number,
                    fifties: Number,
                    hundreds: Number,
                    ducks: Number,
                    fours: Number,
                    sixes: Number,
                    ballsFaced: Number,
                    scoringRate: Number,
                    openedBatting: Number,
                    topScoredInInnings: Number,
                    percentTeamRuns: Number
                },
                bowling: {
                    overs: Number,
                    runsConceded: Number,
                    wickets: Number,
                    average: Number,
                    fiveWicketsInInnings: Number,
                    tenWicketsInMatch: Number,
                    bestInnings: String, // e.g., "7/59"
                    bestMatch: String, // e.g., "13/140"
                    economyRate: Number,
                    strikeRate: Number
                },
                fielding: {
                    catches: Number,
                    mostCatchesInInnings: Number
                },
                wicketkeeping: {
                    catches: Number,
                    stumpings: Number,
                    mostCatchesInInnings: Number,
                    mostDismissalsInInnings: Number
                },
                captaincy: Number,
            }]
    },
});
exports.Player = mongoose_1.default.model('Player', playerSchema);
