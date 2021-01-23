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
            template: "/systems/fatex/templates/actor/group.html",
            dragDrop: [{ dropSelector: null }],
        });
    }

    getData(): ActorSheetData<any> {
        const data: any = super.getData();

        return data;
    }

    /**
     * Render InlineActorSheets after
     * @param force
     * @param options
     */
    async _render(force = false, options = {}) {
        await super._render(force, options);

        const ids: number[] = [];
        const actors = game.actors.filter((actor) => ids.includes(actor.id));

        for (const actor of actors) {
            if (!(actor instanceof Actor)) {
                continue;
            }

            // get sheet but delete new app from actor
            const sheet = new InlineActorSheetFate(actor);
            sheet.render(true, { group: this });
        }
    }

    // activateListeners(_html) {}

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
