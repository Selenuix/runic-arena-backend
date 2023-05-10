function getMonsterName() {
    const monsterNames = ['Ancient Dragon', 'Chaos Mage', 'Crystal Dragon', 'Crystal Titan', 'Cursed Knight', 'Demon Lord', 'Divine Guardian', 'Forest Guardian', 'Goblin Chieftain', 'Ice Queen', 'Inferno Demon', 'Moonlight Dragon', 'Necromancer', 'Ocean Guardian', 'Phoenix Feather', 'Sky Elemental', 'Spectral Knight', 'Thunder God', 'Thunderbird', 'Vampire Lord']
    const monsterAdjectives = ['Adorable', 'Friendly', 'Playful', 'Affectionate', 'Curious', 'Gentle', 'Loyal', 'Helpful', 'Cheerful', 'Brave', 'Ferocious', 'Vicious', 'Malevolent', 'Cruel', 'Monstrous', 'Terrifying', 'Malicious', 'Sinister', 'Diabolical', 'Savage']

    let j = Math.floor(Math.random() * monsterAdjectives.length)
    let i = Math.floor(Math.random() * monsterNames.length)

    return monsterAdjectives[j] + ' ' + monsterNames[i]
}

module.exports = getMonsterName()