import { InlineActorSheetFate } from "../../actor/InlineActorSheetFate";

/**
 * Represents a single actor group. Has a normal (inside groups panel) and a popped out state.
 */
export class ActorGroup extends BaseEntitySheet {
    /*constructor(...args) {
        super(...args);

        /!**
         * If this Actor Sheet represents a synthetic Token actor, reference the active Token
         * @type {Token}
         *!/
        this.token = this.object.token;
    }*/

    static get defaultOptions() {
        const options = super.defaultOptions;

        if (!options.classes) {
            options.classes = [];
        }

        return mergeObject(super.defaultOptions, {
            title: "Actor group",
            classes: options.classes.concat(["fatex fatex__sheet actor_group_overview"]),
            resizable: true,
            width: 500,
            height: 300,
            closeOnSubmit: false,
            submitOnClose: true,
            submitOnChange: true,
            template: "/systems/fatex/templates/actor/group.html",
            dragDrop: [{ dropSelector: null }],
        });
    }

    getData(): ActorSheetData<any> {
        const data: any = super.getData();

        // Entity data
        data.actor = data.entity;
        data.data = data.entity.data;

        // Owned items
        data.items = data.actor.items;
        data.items.sort((a, b) => (a.sort || 0) - (b.sort || 0));

        return data;
    }

    /**
     * Render InlineActorSheets after
     * @param force
     * @param options
     */
    async _render(force = false, options = {}) {
        await super._render(force, options);

        const items = this.entity.items.map((i) => i.data).sort(this._sortItems);
        const references = items.filter((item) => ["actorReference", "tokenReference"].includes(item.type));

        for (const reference of references) {
            if (reference.type === "actorReference") {
                const actor = game.actors.find((actor) => actor.id === reference.data.id);

                if (!actor) {
                    continue;
                }

                const actorSheet = new InlineActorSheetFate(actor);
                actorSheet.render(true, { group: this });
            }

            if (reference.type === "tokenReference") {
                const scene: any = game.scenes.filter((scene) => scene.id === reference.data.scene).shift();
                const tokenData = scene.data.tokens.filter((token) => token._id === reference.data.id).shift();

                const token = new Token(tokenData, scene);
                const tokenSheet = new InlineActorSheetFate(token.actor);
                tokenSheet.render(true, { token: token, group: this });

                // Save inline sheets to global store (needed in onUpdateActor)
                game.inlineSheets = game.inlineSheets || [];
                game.inlineSheets[tokenData.actorId] = game.inlineSheets[tokenData.actorId] || [];
                game.inlineSheets[tokenData.actorId].push(tokenSheet);
            }

            /**
             * Save all inline token globally (find better location than game.)
             * Add inline token to ActorFate getActiveTokens
             * create new InlineToken class that holds a reference to its own actors sheet
             * override the token._onUpdateBaseActor(this.data, data) to make sure it renders its saved inline sheet
             * remove game.inlinesheets
             * add onclose-handler for actor groups to cleanup inline token list
             * refactor and cleanup base classes
             */
        }
    }

    _sortItems(a, b) {
        return (a.sort || 0) - (b.sort || 0);
    }

    /*************************
     * EVENT HANDLER
     *************************/

    /** @override */
    async _onDrop(event) {
        const data = JSON.parse(event.dataTransfer.getData("text/plain"));

        if (data.type && data.type === "Actor") {
            this._createActorReference(data.id);
        }

        if (data.type && data.type === "Token") {
            this._createTokenReference(data.id, data.scene);
        }
    }

    private _createActorReference(id) {
        const itemData = {
            name: "ActorReference",
            type: "actorReference",
            data: {
                id: id,
            },
        };

        this.entity.createOwnedItem(itemData);
    }

    private _createTokenReference(id: string, scene: string): void {
        const itemData = {
            name: "TokenReference",
            type: "tokenReference",
            data: {
                id: id,
                scene: scene,
            },
        };

        this.entity.createOwnedItem(itemData);
    }
}
