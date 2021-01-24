import { ActorFate } from "../../actor/ActorFate";

/**
 * Represents the actor group panel containing multiple actor groups.
 * Is displayed inside the actor sidebar tab by default.
 */
export class ActorGroupPanel extends Application {
    get popOut() {
        return false;
    }

    /**
     * Injects itself into the panel wrapper instead of the body element
     * The panel wrapper is injected into the actor sidebar
     *
     * @param html
     * @param _options
     */
    _injectHTML(html, _options) {
        $(`#actor_group_panel_wrapper`).append(html);
        this._element = html;
    }

    /**
     * Removes the _element reference before rendering if necessary and then renders all available actor groups
     *
     * @param force
     * @param options
     */
    render(force = false, options = {}) {
        if (this._element && !document.contains(this._element[0])) {
            this._element = null;
        }

        return super.render(force, options);
    }

    get template() {
        return `/systems/fatex/templates/apps/actor-group-panel.html`;
    }

    getData(_options) {
        const data: {
            groups?: Actor[];
        } = {};

        data.groups = game.actors.filter((actor) => actor.data.type === "group");

        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);

        // Entry-level events
        html.on("click", ".entity-name", this._onClickEntityName.bind(this));
    }

    /* -------------------------------------------- */

    /**
     * Handle clicking on an Entity name in the Sidebar directory
     * @param {Event} event   The originating click event
     * @private
     */
    _onClickEntityName(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const entityId = element.parentElement.dataset.entityId;
        const entity = game.actors.get(entityId);
        const sheet = entity.sheet;

        // If the sheet is already rendered:
        if (sheet.rendered) {
            sheet.maximize();
            // @ts-ignore
            sheet.bringToTop();
        }

        // Otherwise render the sheet
        else sheet.render(true);
    }

    static hooks() {
        Hooks.on("ready", (_app, _html) => {
            CONFIG.FateX.instances.actorGroupsPanel = new ActorGroupPanel();
            CONFIG.FateX.instances.actorGroupsPanel.render(true);
        });

        /**
         * Injects the actor group panel wrapper inside the actors sidebar
         */
        Hooks.on("renderActorDirectory", (app, html) => {
            if (app.options.popOut || html.find(".actor_group_panel_wrapper").length) {
                return;
            }

            html.find(".directory-list").before(`
                <div id="actor_group_panel_wrapper" class="actor_group_panel_wrapper"></div>
            `);

            html.find(".header-actions").after(`
                <div class="header-actions action-buttons flexrow">
                    <button class="create-actor-group"><i class="fas fa-users"></i> ${"Create Group"}</button>
                </div>
            `);

            html.on("click", "button.create-actor-group", () => this._onCreateGroup.call(this));

            if (game.ready) {
                CONFIG.FateX.instances.actorGroupsPanel.render(true);
            }
        });

        Hooks.on("updateActor", (entity, _data, _options, _userId) => {
            for (const sheet of game.inlineSheets[entity.id]) {
                sheet.render();
            }
        });
    }

    static _onCreateGroup() {
        const createData = {
            name: game.i18n.localize("FAx.ActorGroups.New"),
            type: "group",
        };

        ActorFate._create(createData, { renderSheet: true });
    }
}
