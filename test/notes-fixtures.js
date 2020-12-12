function makeNotesArr() {
    return [
      {
        id: 1,
        name: 'Nautilus Shell',
        folderid: 2,
        content: 'Fascinating mathematical object',
        modified: '2020-01-03T03:00:00.000Z',
      },
      {
        id: 2,
        name: 'Einstein',
        folderid: 1,
        content: 'Theory of Relativity',
        modified: '2020-12-03T05:00:00.000Z',
      },
      {
        id: 3,
        name: 'Darwin',
        folderid: 2,
        content: 'On the Origin of Species',
        modified: '2020-07-03T11:00:00.000Z',
      },
    ];
}

module.exports = {
    makeNotesArr
}
