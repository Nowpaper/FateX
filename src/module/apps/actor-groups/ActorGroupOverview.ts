export class ActorGroupOverview extends Application {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "actor_group_overview",
            popOut: false,
            width: 150,
            dragDrop: [{ dropSelector: null }],
        });
    }

    get template() {
        if (this.options.popOut) {
            return `/systems/fatex/templates/apps/actor-group-overview-popout.html`;
        }

        return `/systems/fatex/templates/apps/actor-group-overview.html`;
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

        const popout = new ActorGroupOverview({
            title: "Actor group",
            popOut: true,
            id: "actor_group_overview_popout",
            resizable: true,
        });

        popout.render(true);
    }

    async getData() {
        const data: any = {};
        data.sheets = [];

        const ids = ActorGroupOverview.getFakeData();
        const actors = game.actors.filter((actor) => ids.includes(actor.id));

        for (const actor in actors) {
            const cls = actors[actor]._sheetClass;

            if (!cls) {
                continue;
            }

            // get sheet but delete new app from actor
            const sheet = new cls(actors[actor], { type: "inline" });
            delete actors[actor].apps[sheet.appId];

            const sheetData = await sheet.getData();

            if (sheetData) {
                const rendered = await renderTemplate(sheet.template, sheetData);
                data.sheets.push(rendered);
            }
        }

        return data;
    }

    static getFakeData() {
        return ["HuQDCQtXYPXjZLug", "bJAgcZmAW8D6RgL3", "NvtZo1rDxh1YSNpZ"];
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
