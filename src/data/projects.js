import React from 'react';
import Barefoot from '../components/images/barefoot';
import Property from '../components/images/property';
import Restuarant from '../components/images/restuarant';
import Netflix from '../components/images/netflix';
import EvenHelp from '../components/images/evenhelp';

const project = [
  { 
    name: 'Evenhelp',
    id: '1',
    idea: 'Knowledge base app',
    image: <EvenHelp />,
    link: 'https://evenhelp.io/',
  },
  { 
    name: 'Barefoot Nomad',
    id: '2',
    idea: 'Request trips',
    image: <Barefoot />,
    link: 'https://boondocks-bn-frontend-staging.herokuapp.com/',
  },
  { 
    name: 'Property Pro Lite',
    id: '3',
    idea: 'Real estate',
    image: <Property />,
    link: 'https://property-pro-lite-webpack.herokuapp.com/',
  },
  { 
    name: 'DA Restaurant',
    id: '4',
    idea: 'Restuarant PHP API',
    image: <Restuarant />,
    link: 'https://github.com/b0nbon1/restuarant-php/tree/master/api',
  },
]

export default project;
