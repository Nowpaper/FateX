/**
 * The Fate extended game system for FoundryVTT
 *
 * Author: Patrick Bauer (Daddi#2333)
 * Repository: https://github.com/anvil-vtt/FateX
 * Software License: MIT
 * Content License:
 *      This work is based on Fate Core System and Fate Accelerated Edition (found at http://www.faterpg.com/),
 *      products of Evil Hat Productions, LLC, developed, authored, and edited by Leonard Balsera, Brian Engard,
 *      Jeremy Keller, Ryan Macklin, Mike Olson, Clark Valentine, Amanda Valentine, Fred Hicks, and Rob Donoghue,
 *      and licensed for our use under the Creative Commons Attribution 3.0 Unported license
 *      (http://creativecommons.org/licenses/by/3.0/).
 */

import { FateX } from "./config";
import { ActorFate } from "./module/actor/ActorFate";
import { CharacterSheet } from "./module/actor/character/CharacterSheet";
import { HandlebarsHelpers } from "./module/helper/HandlebarsHelpers";
import { TemplatePreloader } from "./module/helper/TemplatePreloader";
import { AspectSheet } from "./module/item/aspect/AspectSheet";
import { ConsequenceSheet } from "./module/item/consequence/ConsequenceSheet";
import { ExtraSheet } from "./module/item/extra/ExtraSheet";
import { ItemFate } from "./module/item/ItemFate";
import { SkillSheet } from "./module/item/skill/SkillSheet";
import { StressSheet } from "./module/item/stress/StressSheet";
import { StuntSheet } from "./module/item/stunt/StuntSheet";
import { TemplateActors } from "./module/apps/template-actors/TemplateActors";
import { MigrationHandler } from "./module/helper/MigrationHandler";

/* -------------------------------- */
/*	Register hooks      			*/
/* -------------------------------- */
TemplateActors.hooks();
MigrationHandler.hooks();

/* -------------------------------- */
/*	System initialization			*/
/* -------------------------------- */
Hooks.once("init", async () => {
    console.log(`FateX | Initializing Fate extended game system`);

    // Initialise config
    CONFIG.FateX = FateX;

    //@ts-ignore
    CONFIG.Actor.entityClass = ActorFate;
    CONFIG.Item.entityClass = ItemFate;

    CONFIG.FateX.global.useMarkdown = !![...game.modules.values()].filter((module) => {
        return module.id === "markdown-editor" && module.active;
    }).length;

    // Preload all needed templates
    await TemplatePreloader.preloadHandlebarsTemplates();

    // Register HandlebarsHelpers
    HandlebarsHelpers.registerHelpers();

    // Unregister Core sheets
    Actors.unregisterSheet("core", ActorSheet);
    Items.unregisterSheet("core", ItemSheet);

    // Register FateX actor sheets
    Actors.registerSheet("FateX", CharacterSheet, {
        types: ["character"],
        makeDefault: true,
    });

    // Register FateX item sheets
    Items.registerSheet("FateX", StressSheet, {
        types: ["stress"],
        makeDefault: true,
    });

    Items.registerSheet("FateX", AspectSheet, {
        types: ["aspect"],
        makeDefault: true,
    });

    Items.registerSheet("FateX", ConsequenceSheet, {
        types: ["consequence"],
        makeDefault: true,
    });

    Items.registerSheet("FateX", SkillSheet, {
        types: ["skill"],
        makeDefault: true,
    });

    Items.registerSheet("FateX", StuntSheet, {
        types: ["stunt"],
        makeDefault: true,
    });

    Items.registerSheet("FateX", ExtraSheet, {
        types: ["extra"],
        makeDefault: true,
    });
});

if (import.meta.hot) {
    import.meta.hot.accept();
}

alert("Test5");
