import { InlineActorSheetFate } from "../../actor/InlineActorSheetFate";

/**
 * Represents a single actor group. Has a normal (inside groups panel) and a popped out state.
 */
export class ActorGroup extends BaseEntitySheet {
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

        const testData = [
            { type: "actor", id: "60DlfoJBm1r3zzUf" },
            { type: "token", scene: "fUCkdSOqyzmveZNW", id: "9fjxCWZBnkQkYUH6" },
        ];

        for (const sheet of testData) {
            if (sheet.type === "actor") {
                const actor = game.actors.filter((actor) => actor.id === sheet.id).shift();
                const actorSheet = new InlineActorSheetFate(actor);
                actorSheet.render(true, { group: this });
            }

            if (sheet.type === "token") {
                const scene: any = game.scenes.filter((scene) => scene.id === sheet.scene).shift();
                const tokenData = scene.data.tokens.filter((token) => token._id === sheet.id).shift();

                const token = new Token(tokenData, scene);
                const tokenSheet = new InlineActorSheetFate(token.actor);
                tokenSheet.render(true, { token: token, group: this });

                // Save inline sheets to global store (needed in onUpdateActor)
                game.inlineSheets = game.inlineSheets || [];
                game.inlineSheets[tokenData.actorId] = game.inlineSheets[tokenData.actorId] || [];
                game.inlineSheets[tokenData.actorId].push(tokenSheet);
            }
        }
    }

    /*************************
     * EVENT HANDLER
     *************************/

    /** @override */
    async _onDrop(event) {
        // Try to extract the data
        const data = JSON.parse(event.dataTransfer.getData("text/plain"));

        alert("drop!");
        console.log(data);
    }
}
