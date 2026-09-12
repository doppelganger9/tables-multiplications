import { expect, test } from '@playwright/test';

test.describe('tables de multiplication', () => {
  test('visits the initial project page', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Les tables de multiplication')).toBeVisible();
  });

  test('can view and change app mode', async ({ page }) => {
    await page.goto('/');

    const actionSelect = page.locator('#select-action');
    await expect(actionSelect).toBeVisible();
    await expect(actionSelect).toHaveValue('Afficher');
    await expect(page.locator('article > table')).toBeVisible();
    await expect(page.locator('article > table th').filter({ hasText: 'Opération' })).toBeVisible();
    await expect(page.locator('[data-e2e="btn-next-question"]')).toHaveCount(0);

    await actionSelect.selectOption({ label: 'Réviser' });
    await expect(page.locator('article > table')).toHaveCount(0);
    await expect(page.locator('[data-e2e="btn-next-question"]')).toBeVisible();
  });

  test('can change number to study', async ({ page }) => {
    await page.goto('/');

    const numberSelect = page.locator('#select-nombre');
    await numberSelect.selectOption('3');
    await expect(page.locator('article > table')).toBeVisible();
    await expect(page.locator('tbody tr').nth(0).locator('td').nth(0)).toContainText('1 x 3');
    await expect(page.locator('tbody tr').nth(0).locator('td').nth(1)).toContainText('3');
    await expect(page.locator('tbody tr').nth(3).locator('td').nth(0)).toContainText('4 x 3');
    await expect(page.locator('tbody tr').nth(3).locator('td').nth(1)).toContainText('12');
    await expect(page.locator('tbody tr').nth(9).locator('td').nth(0)).toContainText('10 x 3');
    await expect(page.locator('tbody tr').nth(9).locator('td').nth(1)).toContainText('30');

    await numberSelect.selectOption('10');
    await expect(page.locator('tbody tr').nth(0).locator('td').nth(0)).toContainText('1 x 10');
    await expect(page.locator('tbody tr').nth(0).locator('td').nth(1)).toContainText('10');
    await expect(page.locator('tbody tr').nth(3).locator('td').nth(0)).toContainText('4 x 10');
    await expect(page.locator('tbody tr').nth(3).locator('td').nth(1)).toContainText('40');
    await expect(page.locator('tbody tr').nth(9).locator('td').nth(0)).toContainText('10 x 10');
    await expect(page.locator('tbody tr').nth(9).locator('td').nth(1)).toContainText('100');
  });

  test('can answer questions', async ({ page }) => {
    await page.goto('/');

    await page.locator('#select-action').selectOption({ label: 'Réviser' });
    await expect(page.locator('article > table')).toHaveCount(0);

    await page.locator('[data-e2e="btn-next-question"]').click();
    await expect(page.locator('[data-e2e="good-answer"]')).toHaveCount(0);
    await expect(page.locator('[data-e2e="bad-answer"]')).toHaveCount(0);

    const question = page.locator('.question');
    await expect(question).toHaveText(/Combien font \d+ fois \d+ ?/);
    const [, firstOperand, secondOperand] = (await question.textContent())!.match(
      /Combien font (\d+) fois (\d+) ?/
    )!;
    await page.locator('#reponse').fill(String(Number(firstOperand) * Number(secondOperand)));
    await page.locator('[name="submit"]').click();
    await expect(page.locator('[data-e2e="good-answer"]')).toBeVisible();
    await expect(page.locator('[data-e2e="bad-answer"]')).toHaveCount(0);

    await page.locator('[data-e2e="btn-next-question"]').click();
    await expect(page.locator('[data-e2e="good-answer"]')).toHaveCount(0);
    await expect(page.locator('[data-e2e="bad-answer"]')).toHaveCount(0);
    await expect(question).toHaveText(/Combien font \d+ fois \d+ ?/);
    await page.locator('#reponse').fill('438427');
    await page.locator('[name="submit"]').click();
    await expect(page.locator('[data-e2e="good-answer"]')).toHaveCount(0);
    await expect(page.locator('[data-e2e="bad-answer"]')).toBeVisible();
  });
});
