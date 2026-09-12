import { expect, test } from '@playwright/test';

test('focuses and empties the response input for each next question', async ({ page }) => {
  await page.goto('/');
  await page.locator('#select-action').selectOption({ label: 'Réviser' });
  await expect(page.locator('article > table')).toHaveCount(0);

  for (let questionIndex = 0; questionIndex < 3; questionIndex++) {
    await page.locator('[data-e2e="btn-next-question"]').click();
    const question = page.locator('.question');
    await expect(question).toHaveText(/Combien font \d+ fois \d+ ?/);
    const [, firstOperand, secondOperand] = (await question.textContent())!.match(
      /Combien font (\d+) fois (\d+) ?/
    )!;
    const response = page.locator('#reponse');
    await expect(response).toBeVisible();
    await expect(response).toBeFocused();
    await expect(response).toHaveValue('');
    await response.fill(String(Number(firstOperand) * Number(secondOperand)));
    await page.locator('[data-e2e="btn-validate-answer"]').click();
    await expect(page.locator('[data-e2e="good-answer"]')).toBeVisible();
    await expect(page.locator('[data-e2e="bad-answer"]')).toHaveCount(0);
  }
});
