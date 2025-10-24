import TabContent from './tabContent';
import { useTabIndicator } from '../../../hooks/useTabIndicator';

export default function DetailTabs({ activeTab, slideDirection, handleTabChange, pokemon }) {
    const { tabRefs, indicatorRef, navTabsRef } = useTabIndicator(activeTab);

    return (
        <div className="details-card">
            <div className="nav-tabs" ref={navTabsRef}>
                <span ref={indicatorRef} className="nav-tabs-indicator" />
                <span
                    ref={el => tabRefs.current['about'] = el}
                    className={`nav-tab-item ${activeTab === 'about' ? 'active' : ''}`}
                    onClick={() => handleTabChange('about')}>
                    About
                </span>
                <span
                    ref={el => tabRefs.current['stats'] = el}
                    className={`nav-tab-item ${activeTab === 'stats' ? 'active' : ''}`}
                    onClick={() => handleTabChange('stats')}>
                    Base Stats
                </span>
                <span
                    ref={el => tabRefs.current['evolution'] = el}
                    className={`nav-tab-item ${activeTab === 'evolution' ? 'active' : ''}`}
                    onClick={() => handleTabChange('evolution')}
                >Evolution
                </span>
            </div>

            <TabContent
                activeTab={activeTab}
                slideDirection={slideDirection}
                pokemon={pokemon}
            />
        </div>
    );
}