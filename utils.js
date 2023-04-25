function getHolyMonsterName() {
    const holyMonsters = ['Ancient Dragon', 'Chaos Mage', 'Crystal Dragon', 'Crystal Titan', 'Cursed Knight', 'Demon Lord', 'Divine Guardian', 'Forest Guardian', 'Goblin Chieftain', 'Ice Queen'];
    const holyAdjectives = ["Adorable", "Friendly", "Playful", "Affectionate", "Curious", "Gentle", "Loyal", "Helpful", "Cheerful", "Brave"];
    let i = Math.floor(Math.random() * holyMonsters.length);
    let j = Math.floor(Math.random() * holyAdjectives.length);


    return holyAdjectives[j] + ' ' + holyMonsters[i]
}

console.log(getHolyMonsterName())

function getChaosMonsterName() {
    const chaosMonsters = ['Inferno Demon', 'Moonlight Dragon', 'Necromancer', 'Ocean Guardian', 'Phoenix Feather', 'Sky Elemental', 'Spectral Knight', 'Thunder God', 'Thunderbird', 'Vampire Lord'];
    const chaosAdjectives = ["Ferocious", "Vicious", "Malevolent", "Cruel", "Monstrous", "Terrifying", "Malicious", "Sinister", "Diabolical", "Savage"];
    let i = Math.floor(Math.random() * chaosMonsters.length);
    let j = Math.floor(Math.random() * chaosAdjectives.length);


    return chaosAdjectives[j] + ' ' + chaosMonsters[i]
}
