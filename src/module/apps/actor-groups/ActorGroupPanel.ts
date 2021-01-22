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

        const panel = super.render(force, options);

        for (const group of CONFIG.FateX.groups) {
            group._element = undefined;
            group.render(true);
        }

        return panel;
    }

    get template() {
        return `/systems/fatex/templates/apps/actor-group-panel.html`;
    }
}
