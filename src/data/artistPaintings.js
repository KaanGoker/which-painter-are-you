// Static map of artist name (lowercase, normalized) → iconic painting data
// All images are public domain from Wikimedia Commons
const ARTIST_PAINTINGS = {
    'vincent van gogh': {
        title: 'The Starry Night',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/300px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
    },
    'claude monet': {
        title: 'Water Lilies',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg/300px-Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg',
    },
    'pablo picasso': {
        title: 'Guernica',
        url: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/74/PicassoGuernica.jpg/300px-PicassoGuernica.jpg',
    },
    'salvador dalí': {
        title: 'The Persistence of Memory',
        url: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/dd/The_Persistence_of_Memory.jpg/300px-The_Persistence_of_Memory.jpg',
    },
    'salvador dali': {
        title: 'The Persistence of Memory',
        url: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/dd/The_Persistence_of_Memory.jpg/300px-The_Persistence_of_Memory.jpg',
    },
    'rembrandt': {
        title: 'The Night Watch',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/The_Night_Watch_-_HD.jpg/300px-The_Night_Watch_-_HD.jpg',
    },
    'leonardo da vinci': {
        title: 'Mona Lisa',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/300px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg',
    },
    'michelangelo': {
        title: 'Creation of Adam',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg/300px-Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg',
    },
    'johannes vermeer': {
        title: 'Girl with a Pearl Earring',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/300px-1665_Girl_with_a_Pearl_Earring.jpg',
    },
    'vermeer': {
        title: 'Girl with a Pearl Earring',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/300px-1665_Girl_with_a_Pearl_Earring.jpg',
    },
    'wassily kandinsky': {
        title: 'Composition VIII',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Kandinsky_Composition_8%2C_huile_sur_toile%2C_1923.jpg/300px-Kandinsky_Composition_8%2C_huile_sur_toile%2C_1923.jpg',
    },
    'gustav klimt': {
        title: 'The Kiss',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg/300px-The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg',
    },
    'edvard munch': {
        title: 'The Scream',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg/300px-Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg',
    },
    'pierre-auguste renoir': {
        title: 'Luncheon of the Boating Party',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Auguste_Renoir_-_Luncheon_of_the_Boating_Party_-_Google_Art_Project.jpg/300px-Auguste_Renoir_-_Luncheon_of_the_Boating_Party_-_Google_Art_Project.jpg',
    },
    'renoir': {
        title: 'Luncheon of the Boating Party',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Auguste_Renoir_-_Luncheon_of_the_Boating_Party_-_Google_Art_Project.jpg/300px-Auguste_Renoir_-_Luncheon_of_the_Boating_Party_-_Google_Art_Project.jpg',
    },
    'jackson pollock': {
        title: 'No. 31',
        url: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b2/Pollock_No_31.jpg/300px-Pollock_No_31.jpg',
    },
    'paul cézanne': {
        title: 'The Card Players',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Paul_C%C3%A9zanne_-_The_Card_Players_-_Mus%C3%A9e_d%27Orsay_RF_1969-30.jpg/300px-Paul_C%C3%A9zanne_-_The_Card_Players_-_Mus%C3%A9e_d%27Orsay_RF_1969-30.jpg',
    },
    'paul cezanne': {
        title: 'The Card Players',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Paul_C%C3%A9zanne_-_The_Card_Players_-_Mus%C3%A9e_d%27Orsay_RF_1969-30.jpg/300px-Paul_C%C3%A9zanne_-_The_Card_Players_-_Mus%C3%A9e_d%27Orsay_RF_1969-30.jpg',
    },
    'edgar degas': {
        title: 'The Dance Class',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Degas_-_The_Dance_Class.jpg/300px-Degas_-_The_Dance_Class.jpg',
    },
    'degas': {
        title: 'The Dance Class',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Degas_-_The_Dance_Class.jpg/300px-Degas_-_The_Dance_Class.jpg',
    },
    'paul gauguin': {
        title: 'Where Do We Come From?',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Paul_Gauguin_-_D%27ou_venons-nous.jpg/300px-Paul_Gauguin_-_D%27ou_venons-nous.jpg',
    },
    'gauguin': {
        title: 'Where Do We Come From?',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Paul_Gauguin_-_D%27ou_venons-nous.jpg/300px-Paul_Gauguin_-_D%27ou_venons-nous.jpg',
    },
    'edward hopper': {
        title: 'Nighthawks',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Nighthawks_by_Edward_Hopper_1942.jpg/300px-Nighthawks_by_Edward_Hopper_1942.jpg',
    },
    'hopper': {
        title: 'Nighthawks',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Nighthawks_by_Edward_Hopper_1942.jpg/300px-Nighthawks_by_Edward_Hopper_1942.jpg',
    },
    'georges seurat': {
        title: 'A Sunday on La Grande Jatte',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/A_Sunday_on_La_Grande_Jatte%2C_Georges_Seurat%2C_1884.jpg/300px-A_Sunday_on_La_Grande_Jatte%2C_Georges_Seurat%2C_1884.jpg',
    },
    'seurat': {
        title: 'A Sunday on La Grande Jatte',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/A_Sunday_on_La_Grande_Jatte%2C_Georges_Seurat%2C_1884.jpg/300px-A_Sunday_on_La_Grande_Jatte%2C_Georges_Seurat%2C_1884.jpg',
    },
    'caravaggio': {
        title: 'Judith Beheading Holofernes',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Judith_Beheading_Holofernes-Caravaggio_%28c.1598-9%29.jpg/300px-Judith_Beheading_Holofernes-Caravaggio_%28c.1598-9%29.jpg',
    },
    'raphael': {
        title: 'The School of Athens',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg/300px-%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg',
    },
    'henri matisse': {
        title: 'Dance',
        url: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/Matissedance.jpg/300px-Matissedance.jpg',
    },
    'matisse': {
        title: 'Dance',
        url: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/Matissedance.jpg/300px-Matissedance.jpg',
    },
    'piet mondrian': {
        title: 'Composition with Red, Blue and Yellow',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Piet_Mondriaan%2C_1930_-_Mondrian_Composition_II_in_Red%2C_Blue%2C_and_Yellow.jpg/300px-Piet_Mondriaan%2C_1930_-_Mondrian_Composition_II_in_Red%2C_Blue%2C_and_Yellow.jpg',
    },
    'mondrian': {
        title: 'Composition with Red, Blue and Yellow',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Piet_Mondriaan%2C_1930_-_Mondrian_Composition_II_in_Red%2C_Blue%2C_and_Yellow.jpg/300px-Piet_Mondriaan%2C_1930_-_Mondrian_Composition_II_in_Red%2C_Blue%2C_and_Yellow.jpg',
    },
    'j.m.w. turner': {
        title: 'The Fighting Temeraire',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/The_Fighting_Temeraire%2C_JMW_Turner%2C_National_Gallery.jpg/300px-The_Fighting_Temeraire%2C_JMW_Turner%2C_National_Gallery.jpg',
    },
    'turner': {
        title: 'The Fighting Temeraire',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/The_Fighting_Temeraire%2C_JMW_Turner%2C_National_Gallery.jpg/300px-The_Fighting_Temeraire%2C_JMW_Turner%2C_National_Gallery.jpg',
    },
    'jan van eyck': {
        title: 'Arnolfini Portrait',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Van_Eyck_-_Arnolfini_Portrait.jpg/300px-Van_Eyck_-_Arnolfini_Portrait.jpg',
    },
};

// Normalize artist name for lookup
const normalize = (name) => name.toLowerCase().trim().replace(/\s+/g, ' ');

export const getPainting = (artistName) => {
    if (!artistName) return null;
    return ARTIST_PAINTINGS[normalize(artistName)] || null;
};

export default ARTIST_PAINTINGS;
