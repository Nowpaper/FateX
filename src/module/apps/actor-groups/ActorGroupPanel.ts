import { ActorFate } from "../../actor/ActorFate";

/**
 * Represents the actor group panel containing multiple actor groups.
 * Is displayed inside the actor sidebar tab by default.
 */
export class ActorGroupPanel extends ActorDirectory {
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

    initialize() {
        // Assign Folders
        this.folders = game.folders.filter(() => false);

        // Assign Entities
        this.entities = game.actors.filter((e) => e.data.type === "group");

        // Build Tree
        this.tree = SidebarDirectory.setupFolders(this.folders, this.entities, "");
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

    static hooks() {
        Hooks.on("ready", (_app, _html) => {
            CONFIG.FateX.instances.actorGroupsPanel = new ActorGroupPanel();
            CONFIG.FateX.instances.actorGroupsPanel.render(true);
        });

        /**
         * Injects the actor group panel wrapper inside the actors sidebar
         */
        Hooks.on("renderSidebarTab", (app, html) => {
            if (app.options.id !== "actors") {
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
    }

    static _onCreateGroup() {
        const createData = {
            name: game.i18n.localize("FAx.ActorGroups.New"),
            type: "group",
        };

        ActorFate._create(createData, { renderSheet: true });
    }
}
