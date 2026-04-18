import { useMemo, useState } from 'react';
import type { CandidatePosition } from '../types';
import { CATEGORIES } from '../utils/position-constants';
import { stripHtml } from '../utils/position-format';

export function useCandidatePositionFilter(positions: CandidatePosition[]) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);

    const filtered = useMemo(() => {
        return positions.filter((position) => {
            const query = searchQuery.toLowerCase();
            const plainDescription = stripHtml(position.description).toLowerCase();
            const matchSearch =
                position.title.toLowerCase().includes(query) ||
                plainDescription.includes(query);
            const matchCategory =
                activeCategory === CATEGORIES[0] ||
                position.title
                    .toLowerCase()
                    .includes(activeCategory.toLowerCase());

            return matchSearch && matchCategory;
        });
    }, [activeCategory, positions, searchQuery]);

    return {
        activeCategory,
        filtered,
        searchQuery,
        setActiveCategory,
        setSearchQuery,
    };
}
