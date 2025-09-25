import referenceContentData from '../referenceContent';

describe('referenceContent', () => {
  it('exposes hero and section placeholders', () => {
    expect(referenceContentData.hero.title).toBeTruthy();
    expect(referenceContentData.currentPhase.cards.length).toBeGreaterThan(0);
    expect(referenceContentData.learnMore.accordion.length).toBeGreaterThan(0);
  });
});
