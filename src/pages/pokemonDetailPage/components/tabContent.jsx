import { Slide, capitalize } from '@mui/material';
import { formatStat } from '../../../utils/formatters';
import './tabContent.css'

export default function TabContent({ activeTab, slideDirection, pokemon }) {

    const renderContent = () => {
        switch (activeTab) {
            case 'about':
                return (
                    <ul className="data-list">
                        <li>
                            <span className="data-label">Species</span>
                            <span className="data-value">{capitalize(pokemon.species.name)}</span>
                        </li>
                        <li>
                            <span className="data-label">Height</span>
                            <span className="data-value">{formatStat(pokemon.height)} m</span>
                        </li>
                        <li>
                            <span className="data-label">Weight</span>
                            <span className="data-value">{formatStat(pokemon.weight)} kg</span>
                        </li>
                        <li>
                            <span className="data-label">Abilities</span>
                            <span className="data-value">
                                {pokemon.abilities.map(a => capitalize(a.ability.name)).join(', ')}
                            </span>
                        </li>
                    </ul>
                );

            case 'stats':
                return (
                    <ul className="data-list stats-list">
                        {pokemon.stats.map(stat => (
                            <li key={stat.stat.name} className="stat-item">
                                <span className="data-label">{capitalize(stat.stat.name.replace('-', ' '))}:</span>
                                <span className="data-value">{stat.base_stat}</span>
                            </li>
                        ))}
                    </ul>
                );

            case 'evolution':
                return (
                    <div className="evolution-placeholder">
                        <p>Coming soon...</p>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div style={{ overflow: 'hidden' }}>
            <Slide
                key={activeTab}
                direction={slideDirection}
                in={true}
                mountOnEnter
                unmountOnExit
            >
                <div>
                    {renderContent()}
                </div>
            </Slide>
        </div>
    );
}
