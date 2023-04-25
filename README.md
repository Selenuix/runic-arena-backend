# Goblins Runic Arena API

Goblins Runic Arena is a browser-based trading card game that allows players to collect cards and battle with them in turn-based battles. This project is responsible for developing the API that will be used by the game's application to manage the card library, and a reactive administration interface that exploits this API.

## Table of Contents

- [Understanding the game](#understanding-the-game)
  - [Cards](#cards)
  - [Skills](#skills)
  - [Abilities](#abilities)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installing](#installing)
- [API Reference](#api-reference)
- [Built With](#built-with)
- [Authors](#authors)

## Understanding the game

### Cards

A card, called an "invocation", will fight for you in battles.

It is defined by:

- A name
- An illustration
- A type among 2: 🌑 Chaos and ☀️ Halo.
- A class among 5: Mage, Healer, Warrior, Archer, Assassin
- A power (ex: `75`)
- From 1 to 2 active abilities
- A unique passive ability

### Skills

The outcome of a duel is strongly influenced by the triggering of skills via active or passive abilities. Here are the existing skills:

**Buff: on its own card**

| Name | Description | Example |
| --- | --- | --- |
| Dodge | Dodge the next X attacks | Dodge 2 |
| Protection | Block the next X damages | Protection +200 |
| Critical | Double the damages of the next X attacks | Critical 1 |
| Rage | Increases attack by X | Rage +50 |

**Debuff: on the opponent's card**

| Name | Description | Example |
| --- | --- | --- |
| Curse | Divide by 2 the damages of the next X attacks | Curse 1 |
| Exhaustion | Reduces attack by X | Exhaustion +50 |
| Madness | At each attack of your opponent, he has X% chance to take damage equal to his power | Madness 25% |
| Surrender | At each attack, your opponent has X% chance to stop his series of attacks | Surrender 30% |

**Damages**

| Name | Description | Example |
| --- | --- | --- |
| Counterattack | For the next X attacks of your opponent, you inflict damages equal to your power | Counterattack 2 |
| Life steal | Heal X% of the damages inflicted | Life steal 20% |
| Direct strike | For the next X attacks of your card, the inflicted damages cannot be reduced by opponent's debuffs or buffs | Direct strike 3 |

<aside>
👉 These skills can be triggered by a **passive** or **active** ability.

</aside>

### Abilities

- **Active abilities**
    
    For an active ability to be triggered, its cost in elemental cube must be satisfied.
    
- **Passive abilities**
    
    For a passive ability to be triggered, a condition must be met. Here are the 4 existing conditions:
    
    | Name | Description | Example |
    | --- | --- | --- |
    | Attack | If the card engages the duel, the skill is triggered | Attack: Rage +20 |
    | Defend | If the card defends in the duel, the skill is triggered | Defend: Counterattack 2 |
    | Advantage | If the opponent's card is of a certain element or specific class, the skill is triggered | Advantage ☀️ Halo: Life steal 10% |
    | Group | For each card of a specific element
