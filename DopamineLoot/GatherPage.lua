-- Dopamine Loot "Professions" settings page (a plain page built with ns.Native in Settings.lua): the details
-- of gathering (Gather.lua), crafting (Craft.lua, CraftTray.lua) and skill-ups (Skill.lua, SkillBar.lua),
-- and their tests. The main switches (Gathering effects, Crafting effects, Skill-up banner) are on the
-- first page with the other features; moving frames is there too.
local _, ns = ...

local sub
local KINDS = { { "herb", "Herbalism" }, { "ore", "Mining" }, { "fish", "Fishing" }, { "skin", "Skinning" } }
local CRAFTS = {
  { "Leatherworking", "Leatherworking" }, { "Alchemy", "Alchemy" }, { "Tailoring", "Tailoring" }, { "Engineering", "Engineering" },
  { "Cooking", "Cooking" }, { "Blacksmithing", "Blacksmithing" }, { "Enchanting", "Enchanting" }, { "First Aid", "First Aid" },
}
local function Kind() return ns.settings.testGather or "herb" end
local function Craft() return ns.settings.testCraft or "Tailoring" end

local function Create()
  local N = ns.Native
  local cat, layout = N.Page("Professions", ns.settingsCategory)
  sub = cat

  N.Header(layout, "Gathering")
  N.Toggle(cat, "noGatherTally", "Harvest window",
    "A list in the side column of what you gathered this session, by profession, with the pace and what it's worth. It fades a while after you stop gathering, hides when a fight starts, and right-click closes it; it comes back on your next gather.", true)
  N.Toggle(cat, "noGatherNotes", "Climbing notes",
    "A soft note with each gather, a step higher each time; it starts low again after 8 seconds without gathering.", true)
  N.Slider(cat, "gatherCalm", "Calm after", 0, 100, 5, 40,
    "When you gather a lot (a farming run), the bursts get small and the notes stop after this many gathers within 10 minutes. The harvest window and rare finds stay. 0: never calm down.",
    function(v) return math.floor(v + 0.5) .. " gathers" end)
  N.Choice(cat, "skinRare", "Rare skinning find", {
    { "slash", "Double slash (default)" }, { "flurry", "Flurry" },
  }, "slash", "How a rare skinning find plays: two glints crossing in an X, or a flurry of quick slashes from every angle ending in one big slash.")

  N.Header(layout, "Crafting")
  N.Toggle(cat, "noCraftTray", "Create All pile",
    "During a Create All, a tray slides out under the profession window and every item made drops into a growing pile, with a count; on long batches the pile sinks as it fills. At the end it shakes and sparkles.", true)

  N.Header(layout, "Skill-ups")
  N.Choice(cat, "skillBarLook", "Bar look", {
    { "crafted", "Crafted (default)" }, { "simple", "Simple" },
  }, "crafted", "Crafted: the bar is made of the profession's material (stitched cloth, punched leather, a glass tube, glowing runes...), a small tool at its end moves on each skill-up, and the next herb or ore you can gather shows at its end. Simple: a plain bar in the profession's color with your new skill and what's next.")

  N.Header(layout, "Try it")
  N.Choice(cat, "testGather", "Gathering to test", KINDS, "herb", "Which gathering profession the gathering tests show.")
  N.Button(layout, "Gather once", "Test gather", function() ns.RunAction("testgather", Kind()) end,
    "A gather of the profession picked above, from the middle of the screen into the harvest window.")
  N.Button(layout, "Gather five in a row", "Test run", function() ns.RunAction("testgather", Kind() .. " run") end,
    "Five quick gathers: hear the notes climb and see the +N add up.")
  N.Button(layout, "Find something rare", "Test rare", function() ns.RunAction("testgather", Kind() .. " rare") end,
    "A gather with an Uncommon find: the bigger burst and its popup.")
  N.Button(layout, "Complete a stack", "Fill a stack", function() ns.RunAction("testgather", Kind() .. " stack") end,
    "Tops an item up to just under a full stack and gathers into it: the gold stack badge, the shine and the chime.")
  N.Button(layout, "Reach something new", "Test unlock", function() ns.RunAction("testskill", Kind() .. " unlock") end,
    "A skill-up that reaches the next unlock: the new herb or ore to gather (or, for Fishing and Skinning, the rank to train next).")
  N.Choice(cat, "testCraft", "Crafting to test", CRAFTS, "Tailoring", "Which crafting profession the crafting tests show.")
  N.Button(layout, "Craft one", "Test craft", function() ns.RunAction("testcraft", Craft() .. " 1") end,
    "One craft of the profession picked above, with a pretend cast.")
  N.Button(layout, "Create All", "Test Create All", function() ns.RunAction("testcraft", Craft() .. " 6") end,
    "Six crafts in a row, the way Create All plays: the sounds step down after the first, and the items drop into the pile.")
  N.Button(layout, "A long Create All", "Test 60 quickly", function() ns.RunAction("testcraft", Craft() .. " 60") end,
    "Sixty quick crafts: watch the pile grow into a mound, then sink as it fills so it never overflows.")
  N.Button(layout, "Skill up", "Test skill-up", function() ns.RunAction("testcraftskill", Craft()) end,
    "A skill-up for the crafting profession picked above. Every other press also shows a recipe changing color.")
  N.Button(layout, "Every skill bar", "Show all", function() ns.RunAction("testcraftskill", "all") end,
    "A skill-up for each profession in turn (crafting, then gathering), about 3 seconds apart, so you can compare the bars.")
end

ns.OnInit(function() if not sub then Create() end end)
