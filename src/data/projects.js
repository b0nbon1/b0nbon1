import React from 'react';
import Barefoot from '../components/images/barefoot';
import Property from '../components/images/property';
import Restuarant from '../components/images/restuarant';
import Netflix from '../components/images/netflix';

const project = [
  { 
    name: 'Barefoot Nomad',
    id: '1',
    idea: 'Request trips',
    image: <Barefoot />,
    link: 'https://boondocks-bn-frontend-staging.herokuapp.com/',
  },
  { 
    name: 'Property Pro Lite',
    id: '2',
    idea: 'Real estate',
    image: <Property />,
    link: 'https://property-pro-lite-webpack.herokuapp.com/',
  },
  { 
    name: 'DA Restaurant',
    id: '3',
    idea: 'Restuarant PHP API',
    image: <Restuarant />,
    link: 'https://github.com/b0nbon1/restuarant-php/tree/master/api',
  },
  { 
    name: 'Mini-netflix',
    id: '4',
    idea: 'netflix like app',
    image: <Netflix />,
    link: 'https://mini-netflix-react.herokuapp.com/',
  },
]

export default project;
