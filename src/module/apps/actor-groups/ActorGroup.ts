import { InlineActorSheetFate } from "../../actor/InlineActorSheetFate";

/**
 * Represents a single actor group. Has a normal (inside groups panel) and a popped out state.
 */
export class ActorGroup extends Application {
    static get defaultOptions() {
        const options = super.defaultOptions;

        if (!options.classes) {
            options.classes = [];
        }

        return mergeObject(super.defaultOptions, {
            title: "Actor group",
            classes: options.classes.concat(["fatex fatex__sheet actor_group_overview"]),
            popOut: false,
            resizable: true,
            width: 500,
            height: 300,
            dragDrop: [{ dropSelector: null }],
        });
    }

    get template() {
        if (this.options.popOut) {
            return `/systems/fatex/templates/apps/actor-group-popout.html`;
        }

        return `/systems/fatex/templates/apps/actor-group.html`;
    }

    activateListeners(html) {
        html.find(".fatex__actor_group__title").click((e) => this._onPopOut.call(this, e));
    }

    /*************************
     * EVENT HANDLER
     *************************/

    async _onPopOut(e) {
        e.preventDefault();
        e.stopPropagation();

        const popout = new ActorGroup({
            popOut: true,
            actors: this.options.actors,
        });

        popout.render(true);
    }

    async getData() {
        const data: any = {};

        const ids = this.options.actors;
        data.actors = game.actors.filter((actor) => ids.includes(actor.id));

        return data;
    }

    _injectHTML(html, _options) {
        if (this.popOut) {
            return super._injectHTML(html, _options);
        }

        $(`#actor_group_panel_wrapper .actor_group_panel__groups`).append(html);
        this._element = html;
    }

    async _render(force = false, options = {}) {
        await super._render(force, options);

        if (!this.popOut) {
            return;
        }

        const ids = this.options.actors;
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

    /** @override */
    /*async _onDrop(event) {
        // Try to extract the data
        let data;
        try {
            data = JSON.parse(event.dataTransfer.getData("text/plain"));
        } catch (err) {
            return false;
        }

        let actor = await Actor.fromDropData(data);
    }*/
}
