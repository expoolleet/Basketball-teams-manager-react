import { ITeam } from "../components/pages/Teams/Teams";

export const teamsList : ITeam[] = [ // список команд для первичной загрузки (либо если прописать localStorage.clear())
    {
        logo: '/portraits/portland.png',
        name: 'Portland trail blazers',
        division: 'Northwest',
        conference: 'Western',
        year: '1970',
    },
    {
        logo: '/portraits/denver.png',
        name: 'Denver Nuggets',
        division: 'Notrhwestern',
        conference: 'Western',
        year: '1976',
    },
    {
        logo: '/portraits/minnesota.png',
        name: 'Minnesota timberwolves',
        division: 'Northwest',
        conference: 'Western',
        year: '1989',
    },
    {
        logo: '/portraits/memphis.png',
        name: 'Memphis Grizzlies',
        division: 'Southwest',
        conference: 'Western',
        year: '1995',
    },
    {
        logo: '/portraits/oklahoma.png',
        name: 'Oklahoma city thunder',
        division: 'Northwest',
        conference: 'Western',
        year: '1967',
    },
    {
        logo: '/portraits/philadelphia.png',
        name: 'Philadelphia 76ers',
        division: 'Atlantic',
        conference: 'Eastern',
        year: '1949',
    },
]