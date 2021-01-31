import { InlineActorSheetFate } from "../../actor/InlineActorSheetFate";
import { getReferencesByGroupType, ReferenceItem } from "../../helper/ActorGroupHelper";

/**
 * Represents a single actor group. Has a normal (inside groups panel) and a popped out state.
 */
export class ActorGroupSheet extends ActorSheet {
    public inlineSheets: InlineActorSheetFate[];

    /**
     * Initialize inlineSheets as an empty array of sheets
     * @param args
     */
    constructor(...args) {
        super(...args);

        /**
         * Inline sheets that are rendered by this actor group instance
         */
        this.inlineSheets = [];
    }

    /**
     * Sets the default options for every actor group sheet
     */
    static get defaultOptions() {
        const options = super.defaultOptions;

        if (!options.classes) {
            options.classes = [];
        }

        return mergeObject(options, {
            classes: options.classes.concat(["fatex fatex__sheet actor_group_overview"]),
            resizable: true,
            template: "/systems/fatex/templates/actor/group.html",
            dragDrop: [{ dropSelector: null }],
        });
    }

    /**
     * Delete all inline sheets that were created by this instance before closing the window
     */
    async close(options = {}) {
        for (const inlineSheet of this.inlineSheets) {
            delete inlineSheet.actor.apps[inlineSheet.appId];
        }

        // @ts-ignore
        return super.close(options);
    }

    /**
     * Render InlineActorSheets after
     * @param force
     * @param options
     */
    async _render(force = false, options = {}) {
        await super._render(force, options);

        const references = getReferencesByGroupType(this.actor.data.groupType, this.actor);

        for (const reference of references) {
            if (reference.type === "actorReference") {
                this.renderInlineActor(reference);
            } else if (reference.type === "tokenReference") {
                this.renderInlineToken(reference);
            }
        }
    }

    /**
     * Creates and renders a new InlineActorSheet based on an actor reference.
     * An actor is referenced by his actor id
     */
    renderInlineActor(reference: ReferenceItem) {
        const actor = game.actors.find((actor) => actor.id === reference.data.id && actor.isVisibleByPermission);

        if (!actor) {
            return;
        }

        const actorSheet = new InlineActorSheetFate(actor);
        actorSheet.render(true, { group: this });

        this.inlineSheets.push(actorSheet);
    }

    /**
     * Creates and renders a new InlineActorSheet based on a token reference.
     * A token is referenced by a combination of the scene where its placed and its token id
     */
    renderInlineToken(reference: ReferenceItem) {
        const scene: any = game.scenes.find((scene) => scene.id === reference.data.scene);
        const tokenData = scene?.data.tokens.find((token) => token._id === reference.data.id && token.visible);

        if (!tokenData) {
            return;
        }

        const token = new Token(tokenData, scene);

        const tokenSheet = new InlineActorSheetFate(token.actor);
        tokenSheet.render(true, { token: token, group: this });

        this.inlineSheets.push(tokenSheet);
    }

    /**
     * Create a new ownedItem of type ActorReference based on a given actorID
     * @param actorID
     */
    _createActorReference(actorID) {
        const itemData = {
            name: "ActorReference",
            type: "actorReference",
            data: {
                id: actorID,
            },
        };

        this.actor.createOwnedItem(itemData);
    }

    /**
     * Create a new ownedItem of type tokenReference based on a given sceneID and tokenID
     */
    _createTokenReference(tokenID: string, sceneID: string): void {
        const itemData = {
            name: "TokenReference",
            type: "tokenReference",
            data: {
                id: tokenID,
                scene: sceneID,
            },
        };

        this.entity.createOwnedItem(itemData);
    }

    /*************************
     * EVENT HANDLER
     *************************/

    /**
     * Override of the default drop handler.
     * Handles the ability to drop actors from the sidebar into an actor group
     */
    async _onDrop(event) {
        let data;

        try {
            data = JSON.parse(event.dataTransfer.getData("text/plain"));
        } catch (err) {
            return false;
        }

        // Handle different data types
        switch (data.type) {
            case "Actor":
                return this._createActorReference(data.id);
            case "Item":
                // @ts-ignore
                return this._onDropItem(event, data);
            default:
                break;
        }
    }
}
