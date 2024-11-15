const COUNTRY = require('./countries');
const SHAPE = require('./shape');
const COLOR = require('./color');

const OPEN_INCLUSION_TABLE = {
  YES: true,
  NO: false
}

const OPEN_INCLUSION_CROWN = {
    YES: true,
    NO: false
}

const WHITE_INCLUSION_TABLE = {
    YES: true,
    NO: false
}

const WHITE_INCLUSION_CROWN = {
    YES: true,
    NO: false
}

const BLACK_INCLUSION_TABLE = {
    YES: true,
    NO: false
}

const BLACK_INCLUSION_CROWN = {
    YES: true,
    NO: false
}

const OPEN_INCLUSION_PAVILION = {
    YES: true,
    NO: false
}

const OPEN_INCLUSION_GIRDLE = {
    YES: true,
    NO: false
}

const EYECLEAN = {
    YES: true,
    NO: false
}

const MILKY = {
    NO: 'No',
    YES: 'Yes',
}

const SHADE = {
    NONE: 'None',
    BROWN: 'Brown',
    MIXED: 'Mixed',
    NOBGM: 'No BGM'
}

const CULET = {
    NONE: 'None',
    VERY_SMALL: 'Very Small',
    SMALL: 'Small',
    MEDIUM: 'Medium',
    SLIGHTLY_LARGE: 'Slightly Large',
    LARGE: 'Large',
    VERY_LARGE: 'Very Large',
    EXTREMELY_LARGE: 'Extremely Large',
}

const CULET_CONDITION = {
    P: 'P',
    C: 'C',
    A: 'A',
}

const GIRDLE_MINMAX = {
    XTN: 'XTN',
    VTN: 'VTN',
    TN: 'TN',
    STN: 'STN',
    M: 'M',
    STK: 'STK',
    TK: 'TK',
    VTK: 'VTK',
    XTK: 'XTK',
}

const GIRDLE_CONDITION = {
    F: 'F',
    P: 'P',
    B: 'B'
}

const FL_COLOR = {
    B: 'B',
    Y: 'Y',
    G: 'G',
    R: 'R',
    O: 'O',
    W: 'W',
}

const BRAND = {
    HEARTS_AND_ARROWS: 'Hearts and Arrows',
    CANADA_MARK: 'Canada Mark',
    POLAR_ICE: 'Polar Ice',
    '88_CUT': '88-Cut',
    CANADIAN_ICE: 'Canadian Ice',
    ARCTIC_FOX: 'Arctic Fox',
    HEARTS_ON_FIRE: 'Hearts On Fire',
    ARGYLE: 'Argyle',
    POLAR_BEAR: 'Polar Bear',
}

const HNA = {
    NV: 'NV',
    EX: 'EX',
    VG: 'VG',
    GD: 'GD',
    FR: 'FR',
    NA: 'NA',
    N: 'N'
}

const LAB = {
    GIA: 'GIA',
    HRD: 'HRD',
    IGI: 'IGI',
    NONE: 'NONE',
    OTHER: 'OTHER',
}

const KEY_TO_SYMBOLS = {
    BEARDING: 'Bearding',
    BROWN_PATCH_OF_COLOR: 'Brown Patch of Color',
    BRUISE: 'Bruise',
    CAVITY: 'Cavity',
    CHIP: 'Chip',
    CLEAVAGE: 'Cleavage',
    CLOUD: 'Cloud',
    CRYSTAL: 'Crystal',
    CRYSTAL_SURFACE: 'Crystal Surface',
    ETCH_CHANNEL: 'Etch Channel',
    EXTRA_FACET: 'Extra Facet',
    FEATHER: 'Feather',
    FLUX_REMNANT: 'Flux Remnant',
    INDENTED_NATURAL: 'Indented Natural',
    INTERNAL_GRAINING: 'Internal Graining',
    INTERNAL_INSCRIPTION: 'Internal Inscription',
    INTERNAL_LASER_DRILLING: 'Internal Laser Drilling',
    KNOT: 'Knot',
    LASER_DRILL_HOLE: 'Laser Drill Hole',
    MANUFACTURING_REMNANT: 'Manufacturing Remnant',
    MINOR_DETAILS_OF_POLISH: 'Minor Details of Polish',
    NATURAL: 'Natural',
    NEEDLE: 'Needle',
    NO_INCLUSION: 'No Inclusion',
    PINPOINT: 'Pinpoint',
    REFLECTING_SURFACE_GRAINING: 'Reflecting Surface Graining',
    SURFACE_GRAINING: 'Surface Graining',
    TWINNING_WISP: 'Twinning Wisp'
}

const FANCY_INTENSITY = {
    FAINT: 'Faint',
    VERY_LIGHT: 'Very Light',
    LIGHT: 'Light',
    FANCY: 'Fancy',
    FANCY_LIGHT: 'Fancy Light',
    FANCY_DARK: 'Fancy Dark',
    FANCY_INTENSE: 'Fancy Intense',
    FANCY_VIVID: 'Fancy Vivid',
    FANCY_DEEP: 'Fancy Deep',
    DARK: 'Dark'
}

const FANCY_OVERTONE = {
    NONE: 'None',
    YELLOWISH: 'Yellowish',
    PINKISH: 'Pinkish',
    BLUISH: 'Bluish',
    REDDISH: 'Reddish',
    GREENISH: 'Greenish',
    PURPLISH: 'Purplish',
    ORANGEY: 'Orangey',
    VIOLETISH: 'Violetish',
    GRAYISH: 'Grayish',
    BLACKISH: 'Blackish',
    BROWNISH: 'Brownish',
    OTHER: 'Other',
}

const FANCY_COLOR = {
    YELLOW: 'Yellow',
    PINK: 'Pink',
    BLUE: 'Blue',
    RED: 'Red',
    GREEN: 'Green',
    PURPLE: 'Purple',
    ORANGE: 'Orange',
    VIOLET: 'Violet',
    GRAY: 'Gray',
    BLACK: 'Black',
    BROWN: 'Brown',
    CHAMPANGE: 'Champagne',
    COGNAC: 'Cognac',
    CHAMELEON: 'Chameleon',
    WHITE: 'White',
    OTHER: 'Other'
}

const CLARITY = {
    FL: 'FL',
    IF: 'IF',
    VVS1: 'VVS1',
    VVS2: 'VVS2',
    VS1: 'VS1',
    VS2: 'VS2',
    SI1: 'SI1',
    SI2: 'SI2',
    SI2: 'SI2',
    SI3: 'SI3',
    I1: 'I1',
    I2: 'I2',
    I3: 'I3'
}

const CUT = {
    I: 'ID',
    EX: 'EX',
    VG: 'VG',
    G: 'G',
    F: 'F',
    P: 'P',
    None: 'None'
}

const POLISH = {
    I: 'ID',
    EX: 'EX',
    VG: 'VG',
    G: 'G',
    F: 'F',
    P: 'P',
    None: 'None'
}

const SYMMETRY = {
    I: 'ID',
    EX: 'EX',
    VG: 'VG',
    G: 'G',
    F: 'F',
    P: 'P',
    None: 'None'
}

const FL_INTENSITY = {
    N :'None',
    VSL :'Very Slight',
    SL :'Slight',
    F :'Faint',
    M :'Medium',
    S :'Strong',
    VST :'Very Strong'
}

const SIZE = {
    '0.20-0.29': `0.20's`,
    '0.30-0.39': `0.30's`,
    '0.40-0.49': `0.40's`,
    '0.50-0.59': `0.50's`,
    '0.60-0.69': `0.60's`,
    '0.70-0.79': `0.70's`,
    '0.80-0.89': `0.80's`,
    '0.90-0.99': `0.90's`,
    '1-1.19': `1-1.19`,
    '1.20-1.49': `1.20-1.49`,
    '1.50-1.79': `1.50-1.79`,
    '1.80-1.99': `1.80-1.99`,
    '2-2.49': `2-2.49`,
    '2.50-2.99': `2.50-2.99`,
    '3-3.99': `3-3.99`,
    '4-4.99': `4-4.99`,
    '5-9.99': `5-9.99`,
    '10-20': `10-20`,
}

 const constants = {
    COUNTRY,
    OPEN_INCLUSION_TABLE,
    OPEN_INCLUSION_CROWN,
    WHITE_INCLUSION_TABLE,
    WHITE_INCLUSION_CROWN,
    BLACK_INCLUSION_TABLE,
    BLACK_INCLUSION_CROWN,
    KEY_TO_SYMBOLS,
    SHAPE,
    COLOR,
    OPEN_INCLUSION_PAVILION,
    OPEN_INCLUSION_GIRDLE,
    EYECLEAN,
    MILKY,
    SHADE,
    CULET,
    CULET_CONDITION,
    GIRDLE_MINMAX,
    GIRDLE_CONDITION,
    FL_COLOR,
    BRAND,
    HNA,
    LAB,
    FANCY_INTENSITY,
    FANCY_OVERTONE,
    FANCY_COLOR,
    CLARITY,
    CUT,
    POLISH,
    SYMMETRY,
    FL_INTENSITY,
    SIZE
};
module.exports = constants;
