// Layout placeholders approved by the user. Replace with verified workbook data.
// These numbered slots and items do not describe real game categories or items.
window.BH_DATA = {
  slots: [1, 2, 3].map(n => ({id: 'slot-' + n, label: 'Equipment slot 0' + n})),
  items: [1, 2, 3].map(n => ({
    id: 'placeholder-' + n,
    name: '[ADD: equipment item 0' + n + ']',
    slot: 'slot-' + n,
    description: 'Item information will appear here when the equipment data is supplied.',
    image: '', placeholder: true, bonuses: null
  })),
  stats: [1, 2, 3].map(n => ({id: 'stat-' + n, label: '[ADD: stat label 0' + n + ']'})),
  // Supply this function only from verified formulas. No guessed game calculations.
  calculate: null
};
