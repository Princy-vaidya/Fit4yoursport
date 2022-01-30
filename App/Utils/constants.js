import {Dimensions} from 'react-native';
// export const base_url = 'http://81.7.134.74:1446/api';
// export const base_url = 'https://nodeserver.mydevfactory.com:1446/api';
export const base_url = 'https://fit4yoursport.dk:1446/api';


export const FONT = {
  SIZE: {
    SMALL: 14,
    MEDIUM: 16,
    LARGE: 18,
    BIG: 20,
    EXTRALARGE: 22,
  },
  FAMILY: {
    REGULAR: 'Montserrat-Regular',
    SEMI_BOLD: 'Montserrat-SemiBold',
    BOLD: 'Montserrat-Bold',
  },
};

export const HEIGHT = Dimensions.get('window').height;
export const WIDTH = Dimensions.get('window').width;

export const COLORS = {
  PRIMARY: '#b70148',
  SECONDARY: '#f53a91',
  WHITE: '#ffffff',
  GRAY: '#B1B1B1',
  BLACK: '#000000',
  RED: '#CD1B1B',
  LIGHTGRAY: '#f5f5f4',
  TRANSPARENT: 'transparent',
  BLUE:'#3a95d2',
  FAINTGRAY:'#dee2e2'
};

export const GAP = {
  SMALL: 10,
  MEDIUM: 20,
  LARGE: 30,
};
