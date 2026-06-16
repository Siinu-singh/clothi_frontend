import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/')
    
    // Verify page loaded - check for page title or content
    await page.waitForLoadState('networkidle')
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/homepage.png' })
  })

  test('should display New Arrivals in grid and handle Load More', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Check for SHOP BY section
    const shopByLabel = page.locator('h2:has-text("SHOP BY")').first()
    await expect(shopByLabel).toBeVisible()
    
    // Check that we have product cards visible (should be up to 10 initially)
    const productGrid = page.locator('div[class*="productGrid"]')
    const productCards = productGrid.locator('a[class*="productCard"]')
    
    // Ensure we have some product cards visible
    const initialCount = await productCards.count()
    console.log(`Initial visible product cards count: ${initialCount}`)
    expect(initialCount).toBeGreaterThan(0)
    expect(initialCount).toBeLessThanOrEqual(10)
    
    // Check if the Load More button is visible (it should be if there are more than 10 products fetched)
    const loadMoreBtn = page.locator('button:has-text("Load More")')
    const hasLoadMore = await loadMoreBtn.isVisible()
    
    if (hasLoadMore) {
      // Click Load More
      await loadMoreBtn.click()
      
      // Verify that more product cards are visible now
      const newCount = await productCards.count()
      console.log(`Visible product cards count after Load More: ${newCount}`)
      expect(newCount).toBeGreaterThan(initialCount)
    }
  })

  test('should have navigation links', async ({ page }) => {
    await page.goto('/')
    
    // Check for common navigation elements
    const nav = page.locator('nav, header')
    await expect(nav.first()).toBeVisible()
    
    // Look for catalog/shop link
    const catalogLink = page.locator('a[href*="catalog"], a:has-text("Shop"), a:has-text("Catalog")')
    const hasCatalogLink = await catalogLink.count() > 0
    
    if (hasCatalogLink) {
      await expect(catalogLink.first()).toBeVisible()
    }
  })

  test('should navigate to catalog page', async ({ page }) => {
    await page.goto('/')
    
    // Try to find and click catalog link
    const catalogLink = page.locator('a[href*="catalog"], a:has-text("Shop"), a:has-text("Catalog")').first()
    
    if (await catalogLink.isVisible()) {
      await catalogLink.click()
      await page.waitForLoadState('networkidle')
      
      // Verify we navigated
      expect(page.url()).toContain('catalog')
    }
  })
})

test.describe('Navigation', () => {
  test('should have responsive design', async ({ page }) => {
    // Test desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/')
    await page.screenshot({ path: 'test-results/homepage-desktop.png' })
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.screenshot({ path: 'test-results/homepage-mobile.png' })
  })
})
