import { renderHook, act } from '@testing-library/react';
import { useTabIndicator } from '../../hooks/useTabIndicator';

const TAB_POSITIONS = {
    NAV_TABS_LEFT: 20,
    ABOUT: { width: 100, left: 50 },
    STATS: { width: 80, left: 150 },
};

const createMockElement = (data = {}, style = {}) => ({
    getBoundingClientRect: () => ({
        left: data.left || 0,
        width: data.width || 0,
    }),
    offsetWidth: data.width || 0,
    style: style,
});

describe('useTabIndicator', () => {
    let indicatorMock, navTabsMock, tabAboutMock, tabStatsMock;

    beforeEach(() => {
        indicatorMock = createMockElement({ width: 0, left: 0 }, { width: '', transform: '' });
        navTabsMock = createMockElement({ left: TAB_POSITIONS.NAV_TABS_LEFT });
        tabAboutMock = createMockElement(TAB_POSITIONS.ABOUT);
        tabStatsMock = createMockElement(TAB_POSITIONS.STATS);
    });

    it('deve recalcular e atualizar o indicador ao mudar a aba de "about" para "stats"', () => {
        const { result, rerender } = renderHook(({ activeTab }) => useTabIndicator(activeTab), {
            initialProps: { activeTab: 'fake-init' },
        });

        act(() => {
            result.current.indicatorRef.current = indicatorMock;
            result.current.navTabsRef.current = navTabsMock;
            result.current.tabRefs.current['about'] = tabAboutMock;
            result.current.tabRefs.current['stats'] = tabStatsMock;
        });

        rerender({ activeTab: 'about' });
        expect(indicatorMock.style.width).toBe('100px');
        expect(indicatorMock.style.transform).toBe('translateX(30px)');

        rerender({ activeTab: 'stats' });
        expect(indicatorMock.style.width).toBe('80px');
        expect(indicatorMock.style.transform).toBe('translateX(130px)');
    });
});