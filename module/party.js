import { SwnPartySheet } from "./dialog/party-sheet.js";

export const addControl = (object, html) => {
    let control = `<button class='swn-party-sheet' type="button" title='${game.i18n.localize('SWN.dialog.partysheet')}'><i class='fas fa-users'></i></button>`;
    html.find(".fas.fa-search").replaceWith($(control))
    html.find('.swn-party-sheet').click(ev => {
        showPartySheet(object);
    })
}

export const showPartySheet = (object) => {
    event.preventDefault();
    new SwnPartySheet(object, {
      top: window.screen.height / 2 - 180,
      left:window.screen.width / 2 - 140,
    }).render(true);
}

export const update = (actor, data) => {
    if (actor.getFlag('swn', 'party')) {
        Object.values(ui.windows).forEach(w => {
            if (w instanceof SwnPartySheet) {
                w.render(true);
            }
        })
    }
}