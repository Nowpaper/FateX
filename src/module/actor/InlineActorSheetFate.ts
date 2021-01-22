import { ActorSheetFate } from "./ActorSheetFate";

export class InlineActorSheetFate extends ActorSheetFate {
    get popOut() {
        return false;
    }

    get template() {
        return "systems/fatex/templates/actor/inline.html";
    }

    _injectHTML(html, options) {
        $(`#${options.group.id} .fatex__actor_group_overview_popout__sheets`).append(html);
        this._element = html;
    }

    render(force = false, options: RenderOptions & { group?: Application } = {}) {
        return super.render(force, options);
    }
}
