import { Video } from '../slices/videosSlice';

const mockVideos: Video[] = [
    {
        id: 'mock-1',
        title: 'Super Bowl XI: John Madden & the Raiders – First Championship (1977)',
        description:
            'Step back to 1977, when coach John Madden led the Oakland Raiders to their first Super Bowl title with a commanding 32–14 victory over the Minnesota Vikings in Pasadena.',
        thumbnail: 'https://i.ytimg.com/vi/0LZcouQeE8U/hqdefault.jpg',
        channelTitle: 'NFL Films',
        channelId: 'mock-channel-1',
        publishedAt: new Date().toISOString(),
    },
    {
        id: 'mock-2',
        title: 'Super Bowl LI: Patriots 34 x 28 Falcons – The 28–3 Comeback',
        description:
            'Relive Tom Brady’s greatest comeback as New England erased a 25-point deficit to defeat the Falcons in overtime.',
        thumbnail: 'https://i.ytimg.com/vi/016LXFHpFCk/maxresdefault.jpg',
        channelTitle: 'ESPN Brasil',
        channelId: 'mock-channel-2',
        publishedAt: new Date().toISOString(),
    },
    {
        id: 'mock-3',
        title: 'The Minneapolis Miracle – Vikings vs Saints 2018 Playoffs',
        description:
            'Stefon Diggs’ last-second touchdown that stunned New Orleans and sent Minnesota to the NFC Championship.',
        thumbnail: 'https://i.insider.com/5a5c0820f421491f008b4ed6?width=1068&format=jpeg',
        channelTitle: 'NFL Network',
        channelId: 'mock-channel-3',
        publishedAt: new Date().toISOString(),
    },
    {
        id: 'mock-4',
        title: 'Beast Quake: Marshawn Lynch’s Legendary Run vs Saints (2011)',
        description:
            'The ground literally shook as Marshawn Lynch bulldozed through defenders for a 67-yard playoff touchdown run.',
        thumbnail: 'https://gridironexperts.com/wp-content/uploads/2024/03/Beast-Quake-1.jpg',
        channelTitle: 'NFL',
        channelId: 'mock-channel-4',
        publishedAt: new Date().toISOString(),
    },
    {
        id: 'mock-5',
        title: 'Super Bowl XLII: Giants vs Patriots – The Helmet Catch',
        description:
            'David Tyree’s miraculous helmet catch set up the Giants’ stunning upset over the undefeated Patriots.',
        thumbnail: 'https://static.clubs.nfl.com/image/private/t_editorial_landscape_12_desktop/giants/zc9wgy0s8ngypaeoy7hr',
        channelTitle: 'ESPN',
        channelId: 'mock-channel-5',
        publishedAt: new Date().toISOString(),
    },
    {
        id: 'mock-6',
        title: 'The Immaculate Reception – Steelers vs Raiders (1972)',
        description:
            'Franco Harris makes an unbelievable catch that remains one of the most debated and celebrated plays in NFL history.',
        thumbnail: 'https://ca-times.brightspotcdn.com/dims4/default/315f8e8/2147483647/strip/true/crop/4576x3050+14+0/resize/2000x1333!/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F8a%2F4e%2F4d9ee39343d382506646914e8da8%2Fsteelers-honoring-harris-football-87974.jpg',
        channelTitle: 'NFL Films',
        channelId: 'mock-channel-6',
        publishedAt: new Date().toISOString(),
    },
    {
        id: 'mock-7',
        title: 'Super Bowl XXXIV: Rams Stop Titans One Yard Short',
        description:
            'The St. Louis Rams sealed the win as Mike Jones tackled Kevin Dyson just shy of the goal line in a dramatic finish.',
        thumbnail: 'https://i.ytimg.com/vi/Hx0tlnRXa-0/maxresdefault.jpg',
        channelTitle: 'NFL Classics',
        channelId: 'mock-channel-7',
        publishedAt: new Date().toISOString(),
    },
    {
        id: 'mock-8',
        title: 'Super Bowl XLIII: Santonio Holmes Toe-Tap Touchdown',
        description:
            'Ben Roethlisberger connects with Holmes for one of the most precise and iconic catches in Super Bowl history.',
        thumbnail: 'https://i.ytimg.com/vi/cCjHA-YnuIs/maxresdefault.jpg',
        channelTitle: 'NFL',
        channelId: 'mock-channel-8',
        publishedAt: new Date().toISOString(),
    },
    {
        id: 'mock-9',
        title: 'The Music City Miracle – Titans vs Bills (2000)',
        description:
            'A wild kickoff return lateral play sends the Titans to victory in one of the greatest playoff finishes ever.',
        thumbnail: 'https://static.www.nfl.com/image/private/t_editorial_landscape_12_desktop/league/x4bfrnlvyg744may5h3c',
        channelTitle: 'NFL Throwback',
        channelId: 'mock-channel-9',
        publishedAt: new Date().toISOString(),
    },
    {
        id: 'mock-10',
        title: 'Super Bowl LIV: Chiefs vs 49ers – Mahomes Rallies Kansas City',
        description:
            'Patrick Mahomes leads a furious comeback to capture Kansas City’s first championship in 50 years.',
        thumbnail: 'https://ca-times.brightspotcdn.com/dims4/default/cba3334/2147483647/strip/true/crop/3949x2633+0+0/resize/1200x800!/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2Ff6%2F64%2Fe3d2b55245d191568ab3f216ff38%2Fafc-championship-titans-chiefs-football-97114.jpg',
        channelTitle: 'NFL',
        channelId: 'mock-channel-10',
        publishedAt: new Date().toISOString(),
    },
    {
        id: 'mock-11',
        title: 'Aaron Rodgers Hail Mary vs Lions – Miracle at Motown',
        description:
            'Rodgers unleashes a 61-yard bomb as time expires to defeat the Lions in a jaw-dropping Thursday Night thriller.',
        thumbnail: 'https://image.mlive.com/home/mlive-media/pgfull/img/detroit/photo/2015/12/04/-1b5fafcdea49f984.JPG',
        channelTitle: 'NFL Highlights',
        channelId: 'mock-channel-11',
        publishedAt: new Date().toISOString(),
    },
    {
        id: 'mock-12',
        title: 'Super Bowl LII: Eagles vs Patriots – The Philly Special',
        description:
            'Nick Foles catches a touchdown pass on a trick play that helped the Eagles win their first Super Bowl title.',
        thumbnail: 'https://i.ytimg.com/vi/_XmhBaUdges/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLB9CFJI8UWqPx2_FNa50YBk3JMg4Q',
        channelTitle: 'NFL on FOX',
        channelId: 'mock-channel-12',
        publishedAt: new Date().toISOString(),
    },
];

export default mockVideos;
