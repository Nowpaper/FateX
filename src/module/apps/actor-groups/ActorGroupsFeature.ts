import { ActorGroup } from "./ActorGroup";
import { ActorGroupPanel } from "./ActorGroupPanel";

export class ActorGroupsFeature {
    static hooks() {
        Hooks.once("init", async () => {
            CONFIG.FateX.groups.push(
                new ActorGroup({
                    actors: ["HuQDCQtXYPXjZLug", "bJAgcZmAW8D6RgL3", "NvtZo1rDxh1YSNpZ"],
                })
            );

            CONFIG.FateX.instances.actorGroupsPanel = new ActorGroupPanel();
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

            CONFIG.FateX.instances.actorGroupsPanel.render(true);
        });
    }
}

CONFIG.groups = ActorGroupsFeature;
