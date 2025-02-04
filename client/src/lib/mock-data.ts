type Game = {
  id: string;
  league: string;
  time: string;
  teams: {
    home: string;
    away: string;
  };
  odds: {
    moneyline: {
      home: string;
      away: string;
    };
    spread: {
      home: number;
      away: number;
    };
    total: number;
  };
};

type OddsData = {
  [key: string]: Game[];
};

export const mockOddsData: OddsData = {
  NBA: [
    {
      id: "nba-1",
      league: "NBA",
      time: "7:00 PM ET",
      teams: {
        home: "Boston Celtics",
        away: "Miami Heat",
      },
      odds: {
        moneyline: {
          home: "-180",
          away: "+160",
        },
        spread: {
          home: -4.5,
          away: 4.5,
        },
        total: 220.5,
      },
    },
    {
      id: "nba-2",
      league: "NBA",
      time: "10:30 PM ET",
      teams: {
        home: "LA Lakers",
        away: "Golden State Warriors",
      },
      odds: {
        moneyline: {
          home: "-130",
          away: "+110",
        },
        spread: {
          home: -2.5,
          away: 2.5,
        },
        total: 228.5,
      },
    },
  ],
  NFL: [
    {
      id: "nfl-1",
      league: "NFL",
      time: "1:00 PM ET",
      teams: {
        home: "Kansas City Chiefs",
        away: "Buffalo Bills",
      },
      odds: {
        moneyline: {
          home: "-145",
          away: "+125",
        },
        spread: {
          home: -3,
          away: 3,
        },
        total: 49.5,
      },
    },
    {
      id: "nfl-2",
      league: "NFL",
      time: "4:25 PM ET",
      teams: {
        home: "San Francisco 49ers",
        away: "Dallas Cowboys",
      },
      odds: {
        moneyline: {
          home: "-170",
          away: "+150",
        },
        spread: {
          home: -3.5,
          away: 3.5,
        },
        total: 47.5,
      },
    },
  ],
  MLB: [
    {
      id: "mlb-1",
      league: "MLB",
      time: "7:05 PM ET",
      teams: {
        home: "NY Yankees",
        away: "Boston Red Sox",
      },
      odds: {
        moneyline: {
          home: "-150",
          away: "+130",
        },
        spread: {
          home: -1.5,
          away: 1.5,
        },
        total: 8.5,
      },
    },
  ],
  NHL: [
    {
      id: "nhl-1",
      league: "NHL",
      time: "7:00 PM ET",
      teams: {
        home: "Toronto Maple Leafs",
        away: "Montreal Canadiens",
      },
      odds: {
        moneyline: {
          home: "-160",
          away: "+140",
        },
        spread: {
          home: -1.5,
          away: 1.5,
        },
        total: 6.5,
      },
    },
  ],
};
