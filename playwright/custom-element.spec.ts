import { expect, test } from './fixtures';

// main.js embedded in another site, like https://lacourt.dev/2023/01/21 does: the host page only
// contains the custom element, not the component's root element of this project's index.html.
for (const tag of [
  'app-tables-multiplications',
  'tables-multiplications-app'
]) {
  test(`renders as <${tag}> in a host page`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on(
      'console',
      (message) => message.type() === 'error' && errors.push(message.text())
    );
    await page.route('**/host-page.html', (route) =>
      route.fulfill({
        contentType: 'text/html',
        body: `<!doctype html><html><body>
          <h1>Host page</h1>
          <${tag}></${tag}>
          <script type="module" src="/main.js"></script>
        </body></html>`
      })
    );

    await page.goto('/host-page.html');

    await expect(page.locator(tag)).toContainText(
      'Les tables de multiplication'
    );
    expect(await page.evaluate((t) => !!customElements.get(t), tag)).toBe(true);
    expect(errors).toEqual([]);
  });
}
