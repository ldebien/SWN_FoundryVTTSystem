export const preloadHandlebarsTemplates = async function () {
    const templatePaths = [
        //Character Sheets
        'systems/swn/templates/actors/character-sheet.html',
        'systems/swn/templates/actors/monster-html.html',
        //Actor partials
        //Sheet tabs
        'systems/swn/templates/actors/partials/character-header.html',
        'systems/swn/templates/actors/partials/character-attributes-tab.html',
        'systems/swn/templates/actors/partials/character-skills-tab.html',
        'systems/swn/templates/actors/partials/character-foci-tab.html',
        'systems/swn/templates/actors/partials/character-spells-tab.html',
        'systems/swn/templates/actors/partials/character-psychic-skills-tab.html',
        'systems/swn/templates/actors/partials/character-inventory-tab.html',
        'systems/swn/templates/actors/partials/character-notes-tab.html',

        'systems/swn/templates/actors/partials/monster-header.html',
        'systems/swn/templates/actors/partials/monster-attributes-tab.html'
    ];
    return loadTemplates(templatePaths);
};
