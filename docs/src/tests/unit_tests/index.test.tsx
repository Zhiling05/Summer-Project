import * as NavigationPages from '../../pages/sidebar';

describe('navigation/index.ts exports', () => {
    it('should export SettingsPage component', () => {
        expect(NavigationPages.SettingsPage).toBeDefined();
        expect(typeof NavigationPages.SettingsPage).toBe('function');
    });

    it('should export AboutPage component', () => {
        expect(NavigationPages.AboutPage).toBeDefined();
        expect(typeof NavigationPages.AboutPage).toBe('function');
    });

    it('should export ContactPage component', () => {
        expect(NavigationPages.ContactPage).toBeDefined();
        expect(typeof NavigationPages.ContactPage).toBe('function');
    });

    it('should not export a non-existent page', () => {
        expect('NonExistentPage' in NavigationPages).toBe(false);
        // expect(Object.hasOwn(NavigationPages, 'NonExistentPage')).toBe(false);

    });

    it('exports remain consistent (snapshot)', () => {
        expect(Object.keys(NavigationPages)).toMatchSnapshot();
    });
});
