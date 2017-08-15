import { JEdiUiPage } from './app.po';

describe('j-edi-ui App', () => {
  let page: JEdiUiPage;

  beforeEach(() => {
    page = new JEdiUiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
