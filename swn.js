// Import Modules
import { SwnItemSheet } from "./module/item/item-sheet.js";
import { SwnActorSheetCharacter } from "./module/actor/character-sheet.js";
import { SwnActorSheetMonster } from "./module/actor/monster-sheet.js";
import { preloadHandlebarsTemplates } from "./module/preloadTemplates.js";
import { SwnActor } from "./module/actor/entity.js";
import { SwnItem } from "./module/item/entity.js";
import { SWN } from "./module/config.js";
import { registerSettings } from "./module/settings.js";
import { registerHelpers } from "./module/helpers.js";
import * as chat from "./module/chat.js";
import * as treasure from "./module/treasure.js";
import * as macros from "./module/macros.js";
import * as party from "./module/party.js";
import { SwnCombat } from "./module/combat.js";

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

Hooks.once("init", async function () {
  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d8 + @initiative.value",
    decimals: 2,
  };

  CONFIG.SWN = SWN;

  game.swn = {
    rollItemMacro: macros.rollItemMacro,
  };

  // Custom Handlebars helpers
  registerHelpers();

  // Register custom system settings
  registerSettings();

  CONFIG.Actor.entityClass = SwnActor;
  CONFIG.Item.entityClass = SwnItem;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("swn", SwnActorSheetCharacter, {
    types: ["character"],
    makeDefault: true,
  });
  Actors.registerSheet("swn", SwnActorSheetMonster, {
    types: ["monster"],
    makeDefault: true,
  });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("swn", SwnItemSheet, { makeDefault: true });

  await preloadHandlebarsTemplates();
});

/**
 * This function runs after game data has been requested and loaded from the servers, so entities exist
 */
Hooks.once("setup", function () {
  // Localize CONFIG objects once up-front
  const toLocalize = ["saves", "scores", "armor", "colors", "tags", "skills", "attackSkills", "encumbLocation"];
  for (let o of toLocalize) {
    CONFIG.SWN[o] = Object.entries(CONFIG.SWN[o]).reduce((obj, e) => {
      obj[e[0]] = game.i18n.localize(e[1]);
      return obj;
    }, {});
  }
});

Hooks.once("ready", async () => {
  Hooks.on("hotbarDrop", (bar, data, slot) =>
    macros.createSwnMacro(data, slot)
  );
});

// License and KOFI infos
Hooks.on("renderSidebarTab", async (object, html) => {
  if (object instanceof ActorDirectory) {
    party.addControl(object, html);
  }
  if (object instanceof Settings) {
    let gamesystem = html.find("#game-details");
    // SRD Link
    let swn = gamesystem.find('h4').last();
    swn.append(` <sub><a href="https://oldschoolessentials.necroticgnome.com/srd/index.php">SRD<a></sub>`);

    // License text
    const template = "systems/swn/templates/chat/license.html";
    const rendered = await renderTemplate(template);
    gamesystem.find(".system").append(rendered);
    
    // User guide
    let docs = html.find("button[data-action='docs']");
    const styling = "border:none;margin-right:2px;vertical-align:middle;margin-bottom:5px";
    $(`<button data-action="userguide"><img src='/systems/swn/assets/dragon.png' width='16' height='16' style='${styling}'/>Old School Guide</button>`).insertAfter(docs);
    html.find('button[data-action="userguide"]').click(ev => {
      new FrameViewer('https://mesfoliesludiques.gitlab.io/foundryvtt-swn', {resizable: true}).render(true);
    });
  }
});

Hooks.on("preCreateCombatant", (combat, data, options, id) => {
  let init = game.settings.get("swn", "initiative");
  if (init == "group") {
    SwnCombat.addCombatant(combat, data, options, id);
  }
});

Hooks.on("preUpdateCombatant", SwnCombat.updateCombatant);
Hooks.on("renderCombatTracker", SwnCombat.format);
Hooks.on("preUpdateCombat", SwnCombat.preUpdateCombat);
Hooks.on("getCombatTrackerEntryContext", SwnCombat.addContextEntry);

Hooks.on("renderChatLog", (app, html, data) => SwnItem.chatListeners(html));
Hooks.on("getChatLogEntryContext", chat.addChatMessageContextOptions);
Hooks.on("renderChatMessage", chat.addChatMessageButtons);
Hooks.on("renderRollTableConfig", treasure.augmentTable);
Hooks.on("updateActor", party.update);