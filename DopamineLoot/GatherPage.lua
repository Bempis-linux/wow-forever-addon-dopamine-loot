-- Dopamine Loot "Gathering" settings page (a plain page built with ns.Native in Settings.lua): the
-- gathering effects (Gather.lua), skill-ups (Skill.lua), where they sit (Mover.lua) and tests.
local _, ns = ...

local sub
local KINDS = { { "herb", "Herbalism" }, { "ore", "Mining" }, { "fish", "Fishing" }, { "skin", "Skinning" } }
local function Kind() return ns.settings.testGather or "herb" end

local function Create()
  local N = ns.Native
  local cat, layout = N.Page("Gathering", ns.settingsCategory)
  sub = cat

  N.Header(layout, "Gathering")
  N.Toggle(cat, "noGather", "Gathering effects",
    "Each herb, ore, fish or skin you gather bursts where you clicked (leaves, rock chips, a splash, tufts) and flies into the harvest tally. Gathered items don't start a loot rain.", true)
  N.Toggle(cat, "noGatherTally", "Harvest tally",
    "A list of what you gathered this session, with a +N while you're gathering fast. It fades after a while without gathering and comes back on the next. Drag it with Move frames.", true)
  N.Toggle(cat, "noGatherNotes", "Climbing notes",
    "A soft note with each gather, a step higher each time; it starts low again after 8 seconds without gathering.", true)
  N.Slider(cat, "gatherCalm", "Calm after", 0, 100, 5, 40,
    "After this many gathers within 10 minutes, the bursts get small and the notes stop (the tally and rare finds stay). 0: never calm down.",
    function(v) return math.floor(v + 0.5) .. " gathers" end)
  N.Toggle(cat, "noSkillUp", "Skill-up bar",
    "When a profession's skill goes up: your new skill and a bar in the profession's color toward what's next (the next herb or ore you can gather, or the next rank).", true)

  N.Header(layout, "Placement")
  N.Button(layout, "Drag frames into place", "Move frames", function() ns.Mover.Unlock() end,
    "Shows a box over the harvest tally and the skill-up bar: drag them where you want them, then click Done. Close this window to see them.")
  N.Button(layout, "Put them back", "Reset positions", function() ns.Mover.Reset() end,
    "Moves every movable Dopamine Loot frame back to where it started.")

  N.Header(layout, "Try it")
  N.Choice(cat, "testGather", "Test gathering", KINDS, "herb", "Which kind of gathering the buttons below show.")
  N.Button(layout, "Gather once", "Test gather", function() ns.RunAction("testgather", Kind()) end,
    "A gather of the kind picked above, from the middle of the screen into the tally.")
  N.Button(layout, "Gather five in a row", "Test run", function() ns.RunAction("testgather", Kind() .. " run") end,
    "Five quick gathers: hear the notes climb and see the +N add up.")
  N.Button(layout, "Find something rare", "Test rare", function() ns.RunAction("testgather", Kind() .. " rare") end,
    "A gather with an Uncommon find: the bigger burst and its popup.")
  N.Button(layout, "Skill up", "Test skill-up", function() ns.RunAction("testskill", Kind()) end,
    "A skill-up for the profession picked above.")
end

ns.OnInit(function() if not sub then Create() end end)
