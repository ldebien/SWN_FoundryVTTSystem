export const registerSettings = function () {

  game.settings.register("swn", "initiative", {
    name: game.i18n.localize("SWN.Setting.Initiative"),
    hint: game.i18n.localize("SWN.Setting.InitiativeHint"),
    default: "group",
    scope: "world",
    type: String,
    config: true,
    choices: {
      individual: "SWN.Setting.InitiativeIndividual",
      group: "SWN.Setting.InitiativeGroup",
    },
    onChange: _ => window.location.reload()
  });

  game.settings.register("swn", "rerollInitiative", {
    name: game.i18n.localize("SWN.Setting.RerollInitiative"),
    hint: game.i18n.localize("SWN.Setting.RerollInitiativeHint"),
    default: "keep",
    scope: "world",
    type: String,
    config: true,
    choices: {
      keep: "SWN.Setting.InitiativeKeep",
      reset: "SWN.Setting.InitiativeReset",
      reroll: "SWN.Setting.InitiativeReroll",
    }
  });

  game.settings.register("swn", "movementRate", {
    name: game.i18n.localize("SWN.Setting.MovementRate"),
    hint: game.i18n.localize("SWN.Setting.MovementRateHint"),
    default: "moveswn",
    scope: "world",
    type: String,
    config: true,
    choices: {
      moveswn: "SWN.Setting.MoveSWN",
      movebx: "SWN.Setting.MoveBX",
    },
    onChange: _ => window.location.reload()
  });

  game.settings.register("swn", "showMovement", {
    name: game.i18n.localize("SWN.Setting.showMovement"),
    hint: game.i18n.localize("SWN.Setting.showMovementHint"),
    default: false,
    scope: "world",
    type: Boolean,
    config: true,
    onChange: _ => window.location.reload()
  });

  game.settings.register("swn", "morale", {
    name: game.i18n.localize("SWN.Setting.Morale"),
    hint: game.i18n.localize("SWN.Setting.MoraleHint"),
    default: true,
    scope: "world",
    type: Boolean,
    config: true,
  });

  game.settings.register("swn", "languageList", {
    name: game.i18n.localize("SWN.Languages"),
    hint: game.i18n.localize("SWN.LanguagesHint"),
    default: [
      "Trade Cant",
      "Ancient Vothian",
      "Old Vothian",
      "Modern Vothian",
      "Ancient Olok",
      "Brass Speech",
      "Ancient Lin",
      "Emedian",
      "Ancient Osrin",
      "Thurian",
      "Ancient Khalan",
      "Llaigisan",
      "Anak Speech",
      "Predecessant",
      "Abased",
      "Recurrent",
      "Deep Speech"
    ],
    scope: "world",
    type: String,
    config: true,
    onChange: _ => window.location.reload()
  });

  game.settings.register("swn", "currencyTypes", {
    name: game.i18n.localize("SWN.items.Currency"),
    hint: game.i18n.localize("SWN.items.CurrencyHint"),
    default: "currencyswn",
    scope: "world",
    type: String,
    config: true,
    choices: {
      currencyswn: "SWN.Setting.CurrencySWN",
      currencybx: "SWN.Setting.CurrencyBX",
    },
    onChange: _ => window.location.reload()
  });
  
  game.settings.register("swn", "psychicSkills", {
    name: game.i18n.localize("SWN.Setting.psychicSkills"),
    hint: game.i18n.localize("SWN.Setting.psychicSkillsHint"),
    default: false,
    scope: "world",
    type: Boolean,
    config: true,
    onChange: _ => window.location.reload()
  });
};