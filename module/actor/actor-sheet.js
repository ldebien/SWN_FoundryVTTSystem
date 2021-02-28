import { SwnActor } from "./entity.js";
import { SwnEntityTweaks } from "../dialog/entity-tweaks.js";

export class SwnActorSheet extends ActorSheet {
  constructor(...args) {
    super(...args);
  }
  /* -------------------------------------------- */

  getData() {
    const data = super.getData();

    data.config = CONFIG.SWN;
    // Settings

    // Prepare owned items
    this._prepareItems(data);

    return data;
  }

  activateEditor(target, editorOptions, initialContent) {
    // remove some controls to the editor as the space is lacking
    if (target == "data.details.description") {
      editorOptions.toolbar = "styleselect bullist hr table removeFormat save";
    }
    super.activateEditor(target, editorOptions, initialContent);
  }

  /**
   * Organize and classify Owned Items for Character sheets
   * @private
   */
  _prepareItems(data) {
    // Partition items by category
    let [items, weapons, armors, arts, spells, foci, psychic] = data.items.reduce(
      (arr, item) => {
        // Classify items into types
        if (item.type === "item") arr[0].push(item);
        else if (item.type === "weapon") arr[1].push(item);
        else if (item.type === "armor") arr[2].push(item);
        else if (item.type === "art") arr[3].push(item);
        else if (item.type === "spell") arr[4].push(item);
        else if (item.type === "focus") arr[5].push(item);
        else if (item.type === "psychic") arr [6].push(item);
        return arr;
      },
      [[], [], [], [], [], [], []]
    );

    // Sort spells by level
    var sortedSpells = {};
    var slots = {};
    for (var i = 0; i < spells.length; i++) {
      let lvl = spells[i].data.lvl;
      if (!sortedSpells[lvl]) sortedSpells[lvl] = [];
      if (!slots[lvl]) slots[lvl] = 0;
      slots[lvl] += spells[i].data.memorized;
      sortedSpells[lvl].push(spells[i]);
    }
    data.slots = {
      used: slots,
    };
    // Assign and return
    data.owned = {
      items: items,
      weapons: weapons,
      armors: armors,
      arts: arts,
      foci: foci,
      psychic: psychic
    };
    data.spells = sortedSpells;
  }

  _onItemSummary(event) {
    event.preventDefault();
    let li = $(event.currentTarget).parents(".item"),
      item = this.actor.getOwnedItem(li.data("item-id")),
      description = TextEditor.enrichHTML(item.data.data.description);
    // Toggle summary
    if (li.hasClass("expanded")) {
      let summary = li.parents(".item-entry").children(".item-summary");
      summary.slideUp(200, () => summary.remove());
    } else {
      // Add item tags
      let div = $(
        `<div class="item-summary"><ol class="tag-list">${item.getTags()}</ol><div>${description}</div></div>`
      );
      li.parents(".item-entry").append(div.hide());
      div.slideDown(200);
    }
    li.toggleClass("expanded");
  }

  async _onSpellChange(event) {
    event.preventDefault();
    const itemId = event.currentTarget.closest(".item").dataset.itemId;
    const item = this.actor.getOwnedItem(itemId);
    if (event.target.dataset.field == "cast") {
      return item.update({ "data.cast": parseInt(event.target.value) });
    } else if (event.target.dataset.field == "memorize") {
      return item.update({
        "data.memorized": parseInt(event.target.value),
      });
    }
  }

  async _resetSpells(event) {
    this.actor.update({
      "data.spells.perDay.value": 0
      }
    );
  }

  async _onEffortChange(event) {
    event.preventDefault();
    const itemId = event.currentTarget.closest(".item").dataset.itemId;
    const item = this.actor.getOwnedItem(itemId);
    return item.update({ "data.effort": parseInt(event.target.value) });
  }

  async _onArtSourceChange(event) {
    event.preventDefault();
    const itemId = event.currentTarget.closest(".item").dataset.itemId;
    const item = this.actor.getOwnedItem(itemId);
    return item.update({ "data.source": event.target.value });
  }

  async _onArtTimeChange(event) {
    event.preventDefault();
    const itemId = event.currentTarget.closest(".item").dataset.itemId;
    const item = this.actor.getOwnedItem(itemId);
    return item.update({ "data.time": event.target.value });
  }

  activateListeners(html) {
    super.activateListeners(html);
    
    // Item summaries
    html
      .find(".item .item-name h4")
      .click((event) => this._onItemSummary(event));

    html.find(".item .item-controls .item-show").click(async (ev) => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.getOwnedItem(li.data("itemId"));
      item.show();
    });

    html.find(".saving-throw .attribute-name a").click((ev) => {
      let actorObject = this.actor;
      let element = event.currentTarget;
      let save = element.parentElement.parentElement.dataset.save;
      actorObject.rollSave(save, { event: event });
    });

    html.find(".item .item-rollable .item-image").click(async (ev) => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.getOwnedItem(li.data("itemId"));
      if (item.type == "weapon") {
        if (this.actor.data.type === "monster") {
          item.update({
            data: { counter: { value: item.data.data.counter.value - 1 } },
          });
        }
        item.rollWeapon({ skipDialog: ev.ctrlKey });
      } else if (item.type == "spell") {
        item.spendSpell({ skipDialog: ev.ctrlKey });
      } else {
        item.roll({ skipDialog: ev.ctrlKey });
      }
    });

    html.find(".attack a").click((ev) => {
      let actorObject = this.actor;
      let element = event.currentTarget;
      let attack = element.parentElement.parentElement.dataset.attack;
      const rollData = {
        actor: this.data,
        roll: {},
      };
      actorObject.targetAttack(rollData, attack, {
        type: attack,
        skipDialog: ev.ctrlKey,
      });
    });

    html
      .find(".artEffort input")
      .click((ev) => ev.target.select())
      .change(this._onEffortChange.bind(this));

     html
      .find(".artSource input")
      .click((ev) => ev.target.select())
      .change(this._onArtSourceChange.bind(this));

    html
      .find(".artTime input")
      .click((ev) => ev.target.select())
      .change(this._onArtTimeChange.bind(this));
    
    html.find(".hit-dice .attribute-name a").click((ev) => {
      let actorObject = this.actor;
      actorObject.rollHitDice({ event: event });
    });

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    html
      .find(".memorize input")
      .click((ev) => ev.target.select())
      .change(this._onSpellChange.bind(this));


    html.find(".spells .item-reset").click((ev) => {
      this._resetSpells(ev);
    });

    /** Attempt to copy input focus */
    if ( this.isEditable ) {
      const inputs = html.find("input");
      inputs.focus(ev => ev.currentTarget.select());
    }
  }

  // Override to set resizable initial size
  async _renderInner(...args) {
    const html = await super._renderInner(...args);
    this.form = html[0];

    // Resize resizable classes
    let resizable = html.find(".resizable");
    if (resizable.length == 0) {
      return;
    }
    resizable.each((_, el) => {
      let heightDelta = this.position.height - this.options.height;
      el.style.height = `${heightDelta + parseInt(el.dataset.baseSize)}px`;
    });
    return html;
  }

  async _onResize(event) {
    super._onResize(event);

    let html = $(this.form);
    let resizable = html.find(".resizable");
    if (resizable.length == 0) {
      return;
    }
    // Resize divs
    resizable.each((_, el) => {
      let heightDelta = this.position.height - this.options.height;
      el.style.height = `${heightDelta + parseInt(el.dataset.baseSize)}px`;
    });
    // Resize editors
    let editors = html.find(".editor");
    editors.each((id, editor) => {
      let container = editor.closest(".resizable-editor");
      if (container) {
        let heightDelta = this.position.height - this.options.height;
        editor.style.height = `${
          heightDelta + parseInt(container.dataset.editorSize)
          }px`;
      }
    });
  }

  _onConfigureActor(event) {
    event.preventDefault();
    new SwnEntityTweaks(this.actor, {
      top: this.position.top + 40,
      left: this.position.left + (this.position.width - 400) / 2,
    }).render(true);
  }

  /**
   * Extend and override the sheet header buttons
   * @override
   */
  _getHeaderButtons() {
    let buttons = super._getHeaderButtons();

    // Token Configuration
    const canConfigure = game.user.isGM || this.actor.owner;
    if (this.options.editable && canConfigure) {
      buttons = [
        {
          label: game.i18n.localize("SWN.dialog.tweaks"),
          class: "configure-actor",
          icon: "fas fa-code",
          onclick: (ev) => this._onConfigureActor(ev),
        },
      ].concat(buttons);
    }
    return buttons;
  }
}
