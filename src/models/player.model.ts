import e from 'express';
import mongoose from 'mongoose';

export interface PlayerType {
  meta: {
    fullName: string,
    born: Date,
    currentAge: string, // Store as string for "30 years 240 days"
    bats: string,
    bowls: string,
    Teams: string[],
  },
  matches: MatchStatsType[]
}

export interface MatchStatsType {
  matchesYear: string, // e.g. "2024-"
  batting: {
    innings: number,
    notOuts: number,
    aggregate: number,
    highestScore: number,
    average: number,
    median: number,
    thirties: number,
    fifties: number,
    hundreds: number,
    ducks: number,
    fours: number,
    sixes: number,
    ballsFaced: number,
    scoringRate: number,
    openedBatting: number,
    topScoredInInnings: number,
    percentTeamRuns: number
  },
  bowling: {
    overs: number,
    runsConceded: number,
    wickets: number,
    average: number,
    fiveWicketsInInnings: number,
    tenWicketsInMatch: number,
    bestInnings: String, // e.g., "7/59"
    bestMatch: String,   // e.g., "13/140"
    economyRate: number,
    strikeRate: number
  },
  fielding: {
    catches: number,
    mostCatchesInInnings: number
  },
  wicketkeeping: {
    catches: number,
    stumpings: number,
    mostCatchesInInnings: number,
    mostDismissalsInInnings: number
  },
  captaincy: number
}


const playerSchema = new mongoose.Schema({
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
        bestMatch: String,   // e.g., "13/140"
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

export const Player = mongoose.model('Player', playerSchema);   
