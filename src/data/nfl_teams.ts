export const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
export const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

export const NFL_TEAMS = [
  {
    name: 'Detroit Lions',
    searchQuery: 'Detroit Lions',
    color: 'hsl(210, 100%, 40%)',
    logoUrl: 'https://static.www.nfl.com/image/private/f_auto/league/ocvxwnapdvwevupe4tpr'
  },
  {
    name: 'Green Bay Packers',
    searchQuery: 'Green Bay Packers',
    color: 'hsl(85, 60%, 35%)',
    logoUrl: 'https://static.www.nfl.com/image/private/f_auto/league/gppfvr7n8gljgjaqux2x'
  },
  {
    name: 'Chicago Bears',
    searchQuery: 'Chicago Bears',
    color: 'hsl(20, 100%, 25%)',
    logoUrl: 'https://static.www.nfl.com/image/private/f_auto/league/ijrplti0kmzsyoaikhv1'
  },
  {
    name: 'Minnesota Vikings',
    searchQuery: 'Minnesota Vikings',
    color: 'hsl(270, 60%, 40%)',
    logoUrl: 'https://static.www.nfl.com/image/private/f_auto/league/teguylrnqqmfcwxvcmmz'
  },
  {
    name: 'Kansas City Chiefs',
    searchQuery: 'Kansas City Chiefs',
    color: 'hsl(0, 100%, 45%)',
    logoUrl: 'https://static.www.nfl.com/image/private/f_auto/league/ujshjqvmnxce8m4obmvs'
  },
  {
    name: 'Las Vegas Raiders',
    searchQuery: 'Las Vegas Raiders',
    color: 'hsl(0, 0%, 20%)',
    logoUrl: 'https://static.www.nfl.com/image/private/f_auto/league/gzcojbzcyjgubgyb6xf2'
  },
  {
    name: 'Los Angeles Chargers',
    searchQuery: 'Los Angeles Chargers',
    color: 'hsl(195, 100%, 50%)',
    logoUrl: 'https://static.www.nfl.com/image/private/f_auto/league/dhfidtn8jrumakbogeu4'
  },
  {
    name: 'Denver Broncos',
    searchQuery: 'Denver Broncos',
    color: 'hsl(25, 100%, 45%)',
    logoUrl: 'https://static.www.nfl.com/image/private/f_auto/league/t0p7m5cjdjy18rnzzqbx'
  },
  {
    name: 'Buffalo Bills',
    searchQuery: 'Buffalo Bills',
    color: 'hsl(215, 100%, 45%)',
    logoUrl: 'https://static.www.nfl.com/image/private/f_auto/league/giphcy6ie9mxbnldntsf'
  },
  {
    name: 'Miami Dolphins',
    searchQuery: 'Miami Dolphins',
    color: 'hsl(180, 100%, 40%)',
    logoUrl: 'https://static.www.nfl.com/image/private/f_auto/league/lits6p8ycthy9to70bnt'
  },
  {
    name: 'New England Patriots',
    searchQuery: 'New England Patriots',
    color: 'hsl(220, 45%, 25%)',
    logoUrl: 'https://static.www.nfl.com/image/private/f_auto/league/moyfxx3dq5pio4aiftnc'
  },
  {
    name: 'New York Jets',
    searchQuery: 'New York Jets',
    color: 'hsl(140, 60%, 30%)',
    logoUrl: 'https://static.www.nfl.com/h_40,w_40,q_auto,f_auto,dpr_2.0/league/api/clubs/logos/NYJ'
  },
  {
    name: 'Baltimore Ravens',
    searchQuery: 'Baltimore Ravens',
    color: 'hsl(270, 40%, 30%)',
    logoUrl: 'https://static.www.nfl.com/image/private/f_auto/league/ucsdijmddsqcj1i9tddd'
  },
  {
    name: 'Cincinnati Bengals',
    searchQuery: 'Cincinnati Bengals',
    color: 'hsl(25, 100%, 45%)',
    logoUrl: 'https://static.www.nfl.com/image/private/f_auto/league/okxpteoliyayufypqalq'
  },
  {
    name: 'Cleveland Browns',
    searchQuery: 'Cleveland Browns',
    color: 'hsl(25, 85%, 40%)',
    logoUrl: 'https://static.www.nfl.com/image/upload/f_auto/league/bedyixmmjhszfcx5wv2l'
  },
  {
    name: 'Pittsburgh Steelers',
    searchQuery: 'Pittsburgh Steelers',
    color: 'hsl(45, 100%, 50%)',
    logoUrl: 'https://static.www.nfl.com/image/private/f_auto/league/xujg9t3t4u5nmjgr54wx'
  },
  {
    name: 'Houston Texans',
    searchQuery: 'Houston Texans',
    color: 'hsl(215, 60%, 30%)',
    logoUrl: 'https://static.www.nfl.com/image/upload/f_auto/league/u6camnphqvjc6mku6u3c'
  },
  {
    name: 'Indianapolis Colts',
    searchQuery: 'Indianapolis Colts',
    color: 'hsl(215, 100%, 45%)',
    logoUrl: 'https://static.www.nfl.com/image/private/f_auto/league/ketwqeuschqzjsllbid5'
  },
  {
    name: 'Jacksonville Jaguars',
    searchQuery: 'Jacksonville Jaguars',
    color: 'hsl(180, 100%, 35%)',
    logoUrl: 'https://static.www.nfl.com/image/private/f_auto/league/qycbib6ivrm9dqaexryk'
  },
  {
    name: 'Tennessee Titans',
    searchQuery: 'Tennessee Titans',
    color: 'hsl(210, 100%, 40%)',
    logoUrl: 'https://static.www.nfl.com/image/private/f_auto/league/pln44vuzugjgipyidsre'
  },
  {
    name: 'Dallas Cowboys',
    searchQuery: 'Dallas Cowboys',
    color: 'hsl(210, 100%, 40%)',
    logoUrl: 'https://static.www.nfl.com/image/private/f_auto/league/ieid8hoygzdlmzo0tnf6'
  },
  {
    name: 'New York Giants',
    searchQuery: 'New York Giants',
    color: 'hsl(215, 100%, 45%)',
    logoUrl: 'https://static.www.nfl.com/image/private/f_auto/league/t6mhdmgizi6qhndh8b9p'
  },
  {
    name: 'Philadelphia Eagles',
    searchQuery: 'Philadelphia Eagles',
    color: 'hsl(170, 60%, 30%)',
    logoUrl: 'https://static.www.nfl.com/image/private/f_auto/league/puhrqgj71gobgdkdo6uq'
  },
  {
    name: 'Washington Commanders',
    searchQuery: 'Washington Commanders',
    color: 'hsl(355, 85%, 40%)',
    logoUrl: 'https://static.www.nfl.com/image/private/f_auto/league/xymxwrxtyj9fhaemhdyd'
  },
  {
    name: 'Atlanta Falcons',
    searchQuery: 'Atlanta Falcons',
    color: 'hsl(0, 100%, 35%)',
    logoUrl: 'https://static.www.nfl.com/image/private/f_auto/league/d8m7hzpsbrl6pnqht8op'
  },
  {
    name: 'Carolina Panthers',
    searchQuery: 'Carolina Panthers',
    color: 'hsl(195, 100%, 40%)',
    logoUrl: 'https://static.www.nfl.com/image/private/f_auto/league/ervfzgrqdpnc7lh5gqwq'
  },
  {
    name: 'New Orleans Saints',
    searchQuery: 'New Orleans Saints',
    color: 'hsl(45, 100%, 50%)',
    logoUrl: 'https://static.www.nfl.com/image/private/f_auto/league/grhjkahghjkk17v43hdx'
  },
  {
    name: 'Tampa Bay Buccaneers',
    searchQuery: 'Tampa Bay Buccaneers',
    color: 'hsl(0, 100%, 40%)',
    logoUrl: 'https://static.www.nfl.com/image/private/f_auto/league/v8uqiualryypwqgvwcih'
  },
  {
    name: 'Arizona Cardinals',
    searchQuery: 'Arizona Cardinals',
    color: 'hsl(355, 85%, 45%)',
    logoUrl: 'https://static.www.nfl.com/image/private/f_auto/league/u9fltoslqdsyao8cpm0k'
  },
  {
    name: 'Los Angeles Rams',
    searchQuery: 'Los Angeles Rams',
    color: 'hsl(210, 100%, 45%)',
    logoUrl: 'https://static.www.nfl.com/image/private/f_auto/league/ayvwcmluj2ohkdlbiegi'
  },
  {
    name: 'San Francisco 49ers',
    searchQuery: 'San Francisco 49ers',
    color: 'hsl(0, 100%, 45%)',
    logoUrl: 'https://static.www.nfl.com/image/private/f_auto/league/dxibuyxbk0b9ua5ih9hn'
  },
  {
    name: 'Seattle Seahawks',
    searchQuery: 'Seattle Seahawks',
    color: 'hsl(210, 100%, 35%)',
    logoUrl: 'https://static.www.nfl.com/image/private/f_auto/league/gcytzwpjdzbpwnwxincg'
  },
];
